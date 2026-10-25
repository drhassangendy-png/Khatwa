import { supabase } from '@/lib/api';
import { appDataSchema } from '@/lib/dataValidation';
import type { AppData } from '@/types';
export interface CloudBackup { payload:AppData; updated_at:string }
export function validateBackupSize(data:AppData){if(new TextEncoder().encode(JSON.stringify(data)).length>650000)throw new Error('حجم البيانات كبير للنسخة السحابية. استخدم تصدير JSON المحلي.');}
export async function fetchBackup(userId:string):Promise<CloudBackup|null>{
 const {data,error}=await supabase.from('khatwa_backups').select('payload,updated_at').eq('user_id',userId).maybeSingle();
 if(error)throw new Error('تعذّر قراءة النسخة السحابية. تحقق من الاتصال.');
 if(!data)return null;
 const parsed=appDataSchema.safeParse(data.payload);
 if(!parsed.success)throw new Error('النسخة السحابية غير صالحة؛ استخدم نسخة JSON محلية أو احفظ نسخة جديدة.');
 return {payload:parsed.data,updated_at:data.updated_at};
}
export async function saveCloudBackup(userId:string,payload:AppData){
 validateBackupSize(payload);
 const {error}=await supabase.from('khatwa_backups').upsert({user_id:userId,payload,updated_at:new Date().toISOString()},{onConflict:'user_id'});
 if(error)throw new Error('تعذّر حفظ النسخة السحابية. تحقق من حسابك واتصالك.');
 console.log('Account backup saved');
}
