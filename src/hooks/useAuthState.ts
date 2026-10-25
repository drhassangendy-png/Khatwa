import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/lib/api';
import { t } from '@/lib/i18n';
import { createAuthorizationUrl, exchangeOAuthCodeOnce, isInIframe, mapSupabaseUser, OAUTH_ERROR, type AuthUser, type OAuthProvider } from '@/lib/auth';
export function useAuthState() {
 const [user,setUser]=useState<AuthUser|null>(null);
 const [loading,setLoading]=useState(true);
 const [signingIn,setSigningIn]=useState(false);
 const [error,setError]=useState<string|null>(null);
 const popupRef=useRef<Window|null>(null);
 const timerRef=useRef<ReturnType<typeof setInterval>|null>(null);
 const navigate=useNavigate();
 const stopPopup=useCallback(()=>{if(timerRef.current)clearInterval(timerRef.current);timerRef.current=null;popupRef.current?.close();popupRef.current=null;setSigningIn(false);},[]);
 useEffect(()=>{
  let mounted=true;
  supabase.auth.getSession().then(({data,error:sessionError})=>{if(!mounted)return;if(sessionError){setError('تعذّر تحميل الحساب. حاول تسجيل الدخول مجددًا.');toast.error(t('تعذّر تحميل الحساب','Could not load your account'));}if(data.session?.user)setUser(mapSupabaseUser(data.session.user));setLoading(false);},()=>{if(mounted){setLoading(false);toast.error(t('تعذّر الاتصال بالحساب. تحقق من اتصالك.','Could not connect to your account. Check your connection.'));}});
  const {data:{subscription}}=supabase.auth.onAuthStateChange((event,session)=>{
   if(!mounted)return;
   if(event==='SIGNED_IN'&&session?.user){setUser(mapSupabaseUser(session.user));setLoading(false);setSigningIn(false);setError(null);}
   else if(event==='SIGNED_OUT'){setUser(null);setLoading(false);}
   else if(event==='TOKEN_REFRESHED'&&session?.user)setUser(mapSupabaseUser(session.user));
  });
  return()=>{mounted=false;subscription.unsubscribe();};
 },[]);
 useEffect(()=>{
  const onMessage=(event:MessageEvent<unknown>)=>{
   if(!event.data||typeof event.data!=='object')return;
   const message=event.data as Record<string,unknown>;
   if(message.type==='OAUTH_CODE'&&typeof message.code==='string'&&message.code.length>0&&message.code.length<4096){
    if(timerRef.current)clearInterval(timerRef.current);timerRef.current=null;
    void exchangeOAuthCodeOnce(message.code).then(()=>{stopPopup();setError(null);toast.success(t('تم تسجيل الدخول','Signed in'));navigate('/',{replace:true});},()=>{stopPopup();setError(OAUTH_ERROR);toast.error(OAUTH_ERROR);});
   }else if(message.type==='OAUTH_ERROR'&&typeof message.message==='string'){stopPopup();setError(OAUTH_ERROR);toast.error(OAUTH_ERROR);}
  };
  window.addEventListener('message',onMessage);
  return()=>{window.removeEventListener('message',onMessage);if(timerRef.current)clearInterval(timerRef.current);popupRef.current?.close();};
 },[navigate,stopPopup]);
 const startSocialLogin=useCallback(async(provider:OAuthProvider)=>{
  if(popupRef.current){popupRef.current.focus();return;}
  const iframe=isInIframe(), width=520,height=720;
  const left=Math.max(0,window.screenX+(window.outerWidth-width)/2),top=Math.max(0,window.screenY+(window.outerHeight-height)/2);
  const popup=iframe?window.open('about:blank','onspace-oauth',`popup=yes,width=${width},height=${height},left=${Math.round(left)},top=${Math.round(top)}`):null;
  if(iframe&&!popup){const message='登录弹窗被浏览器阻止，请允许弹窗后重试。';setError(message);toast.error(message);return;}
  popupRef.current=popup;setSigningIn(true);setError(null);
  try{
   const {data,error:oauthError}=await createAuthorizationUrl(provider);
   if(oauthError||!data.url)throw new Error(OAUTH_ERROR);
   if(iframe&&popup){
    popup.location.assign(data.url);
    timerRef.current=setInterval(()=>{if(popup.closed){stopPopup();setError('أُغلقت نافذة تسجيل الدخول. يمكنك المحاولة مجددًا.');toast(t('أُغلقت نافذة تسجيل الدخول','The sign-in popup was closed'));}},700);
   }else window.location.assign(data.url);
  }catch{stopPopup();setError(OAUTH_ERROR);toast.error(OAUTH_ERROR);}
 },[stopPopup]);
 const signInWithGoogle=useCallback(()=>startSocialLogin('google'),[startSocialLogin]);
 const logout=useCallback(async()=>{
  try{const {error:logoutError}=await supabase.auth.signOut();if(logoutError)throw logoutError;stopPopup();toast.success(t('تم تسجيل الخروج؛ بيانات الجهاز لم تتغير','Signed out; device data is unchanged'));}
  catch{toast.error(t('تعذّر تسجيل الخروج. تحقق من اتصالك وحاول مجددًا.','Sign-out failed. Check your connection and try again.'));}
 },[stopPopup]);
 return {user,loading,signingIn,error,signInWithGoogle,logout};
}
