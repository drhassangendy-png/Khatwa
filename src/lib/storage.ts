import { INITIAL_DATA } from '@/constants/data';
import { appDataSchema } from '@/lib/dataValidation';
import type { AppData } from '@/types';
export function loadLocalData():AppData{
 try{
  const saved=localStorage.getItem('khatwa-v1');if(!saved)return INITIAL_DATA;
  // Malformed JSON and invalid schemas are expected recovery cases; retain the raw file.
  try{const parsed=appDataSchema.safeParse(JSON.parse(saved));if(parsed.success)return parsed.data;}
  catch{console.warn('Malformed local JSON; retaining a raw recovery snapshot');}
  localStorage.setItem(`khatwa-recovery-${Date.now()}`,saved);localStorage.setItem('khatwa-recovery-notice','1');return INITIAL_DATA;
 }catch(error){console.warn('Local storage unavailable; downloaded backups remain supported',error);return INITIAL_DATA;}
}
