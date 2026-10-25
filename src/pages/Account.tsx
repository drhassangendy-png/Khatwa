import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/i18n';
import CloudBackupCard from '@/components/features/CloudBackupCard';
import LocalBackupCard from '@/components/features/LocalBackupCard';
import RestoreDialog from '@/components/features/RestoreDialog';
import OAuthSetup from '@/components/features/OAuthSetup';
import type { AppData } from '@/types';
export default function Account(){useApp();const {user,loading,logout}=useAuth(),[pending,setPending]=useState<{data:AppData;source:string}|null>(null);const restore=(data:AppData,source:string)=>setPending({data,source});return <div className="space-y-6 page-enter"><div className="flex gap-3 justify-between flex-wrap"><div><h1 className="text-2xl font-bold">{t('حسابك ونسخك الاحتياطية','Your account & backups')}</h1><p className="text-muted mt-1">{t('احفظ رحلتك وانقل بياناتك بأمان.','Save your journey and move your data safely.')}</p></div><Link className="btn-secondary" to="/settings"><Settings size={18}/>{t('الإعدادات','Settings')}</Link></div><section className="bg-soft border border-line rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4"><div className="flex gap-4 items-center"><ShieldCheck size={32} className="text-primary shrink-0"/><div><h2 className="font-bold">{loading?t('جارٍ التحقق من الحساب…','Checking your account…'):user?user.username:t('مساحة محلية، دون حساب','A local space, no account required')}</h2><p className="text-muted text-sm break-all">{user?user.email:t('بياناتك محفوظة في هذا المتصفح. التصدير متاح دائمًا.','Your data is stored in this browser. Export is always available.')}</p></div></div>{user?<button className="btn-secondary" onClick={logout}><LogOut size={18}/>{t('تسجيل الخروج','Sign out')}</button>:!loading&&<Link className="btn-secondary" to="/login">{t('ربط حساب Google','Connect Google account')}</Link>}</section><div className="grid lg:grid-cols-2 gap-6"><CloudBackupCard onRestore={restore}/><LocalBackupCard onRestore={restore}/></div><OAuthSetup/>{pending&&<RestoreDialog pending={pending} onClose={()=>setPending(null)}/>}</div>;}
