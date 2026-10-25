import type { User } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/lib/api';
export interface AuthUser { id: string; email: string; username: string; avatar?: string }
export type OAuthProvider = 'google' | 'apple';
export const OAUTH_ERROR = '无法完成第三方登录，请检查登录配置后重试。';
export function mapSupabaseUser(user: User): AuthUser {
 return { id:user.id, email:user.email || '', username:user.user_metadata?.full_name || user.user_metadata?.username || user.email?.split('@')[0] || 'حسابي', avatar:user.user_metadata?.avatar_url || user.user_metadata?.picture };
}
export function isInIframe() { try { return window.self !== window.top; } catch { return true; } }
export function createAuthorizationUrl(provider: OAuthProvider) {
 return getSupabaseClient().auth.signInWithOAuth({provider, options:{redirectTo:`${window.location.origin}/auth/callback`, skipBrowserRedirect:true}});
}
const exchanges = new Map<string, Promise<void>>();
export function exchangeOAuthCodeOnce(code: string) {
 const existing = exchanges.get(code); if (existing) return existing;
 const promise = getSupabaseClient().auth.exchangeCodeForSession(code).then(({error}) => {
  if(error) throw new Error(OAUTH_ERROR);
  console.log('OAuth session established');
 });
 exchanges.set(code,promise); return promise;
}
