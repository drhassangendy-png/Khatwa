import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { exchangeOAuthCodeOnce, OAUTH_ERROR } from '@/lib/auth';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/i18n';
export default function OAuthCallback(){
 useApp();
 const [error,setError]=useState<string|null>(null);
 const navigate=useNavigate();
 useEffect(()=>{
  const isOAuthPopup=window.name==='onspace-oauth';
  const params=new URLSearchParams(window.location.search);
  const code=params.get('code');
  if(params.has('error')||params.has('error_code')){
   window.history.replaceState(null,'',window.location.pathname);
   if(isOAuthPopup&&window.opener){window.opener.postMessage({type:'OAUTH_ERROR',message:OAUTH_ERROR},'*');window.close();}
   else {setError(OAUTH_ERROR);toast.error(OAUTH_ERROR);}
   return;
  }
  if(code&&isOAuthPopup){
   if(!window.opener){setError('登录弹窗与主页面的连接已丢失，请重新登录。');return;}
   window.opener.postMessage({type:'OAUTH_CODE',code},'*');window.close();return;
  }
  if(code){
   void exchangeOAuthCodeOnce(code).then(()=>{window.history.replaceState(null,'',window.location.pathname);navigate('/',{replace:true});},()=>{window.history.replaceState(null,'',window.location.pathname);setError(OAUTH_ERROR);toast.error(OAUTH_ERROR);});
   return;
  }
  if(isOAuthPopup){setError('登录回调缺少授权码，请重新登录。');return;}
  navigate('/login',{replace:true});
 },[navigate]);
 return <section className="panel p-8 text-center max-w-xl mx-auto"><h1 className="text-xl font-bold">{error?t('تعذّر تسجيل الدخول','Sign-in failed'):t('جارٍ إتمام تسجيل الدخول','Completing sign-in')}</h1><p role={error?'alert':'status'} className={`mt-4 ${error?'text-danger':'text-muted'}`}>{error?t('تعذّر الدخول؛ اسمح بالنوافذ المنبثقة وتحقق من إعداد Google.','Sign-in failed. Allow popups and check Google configuration.'):t('انتظر لحظة حتى تكتمل العودة إلى حسابك.','Please wait while we return you to your account.')}</p>{error&&<button className="btn-secondary mt-6" onClick={()=>navigate('/login',{replace:true})}>{t('العودة لتسجيل الدخول','Return to sign in')}</button>}</section>;
}
