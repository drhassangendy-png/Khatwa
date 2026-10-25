import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';
import type { Prayer, PrayerLocation } from '@/types';
import { locale } from '@/lib/i18n';
export const PRAYERS:Prayer[]=['fajr','dhuhr','asr','maghrib','isha'];
export const PRAYER_LABELS:Record<Prayer,string>={fajr:'الفجر',dhuhr:'الظهر',asr:'العصر',maghrib:'المغرب',isha:'العشاء'};
export function calculatePrayers(key:string,location:PrayerLocation|null){
 if(!location)return [];
 const [year,month,day]=key.split('-').map(Number);
 const times=new PrayerTimes(new Coordinates(location.latitude,location.longitude),new Date(year,month-1,day),CalculationMethod.Egyptian());
 return PRAYERS.map(prayer=>({prayer,date:times[prayer]})).filter(item=>Number.isFinite(item.date.getTime()));
}
export const prayerDisplay=(date:Date,timezone:string)=>date.toLocaleTimeString(locale(),{timeZone:timezone,hour:'numeric',minute:'2-digit'});
