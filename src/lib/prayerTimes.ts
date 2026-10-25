import type { Prayer, PrayerLocation } from '@/types';
import { locale } from '@/lib/i18n';
import { solarNoon, solarAltitudeTime } from '@/lib/solarTimes';
import { radians, degrees } from '@/lib/solarPosition';
export interface PrayerTime { prayer:Prayer; date:Date }
export const PRAYERS:Prayer[]=['fajr','dhuhr','asr','maghrib','isha'];
export const PRAYER_LABELS:Record<Prayer,string>={fajr:'الفجر',dhuhr:'الظهر',asr:'العصر',maghrib:'المغرب',isha:'العشاء'};
const DAY_MS=86400000;
function limitTwilight(value:number|undefined,boundary:number|undefined,morning:boolean):number|undefined {
 if(boundary===undefined)return value;
 return value===undefined?boundary:morning?Math.max(value,boundary):Math.min(value,boundary);
}
// Local Egyptian method: Fajr 19.5°, Isha 17.5°, standard one-shadow Asr.
// UTC instants are independent of the device zone; display uses the saved zone.
export function calculatePrayers(key:string,location:PrayerLocation|null):PrayerTime[] {
 if(!location||!/^\d{4}-\d{2}-\d{2}$/.test(key))return [];
 const midnight=Date.parse(`${key}T00:00:00.000Z`);
 if(!Number.isFinite(midnight)||new Date(midnight).toISOString().slice(0,10)!==key)return [];
 const {latitude,longitude}=location;
 if(!Number.isFinite(latitude)||!Number.isFinite(longitude)||Math.abs(latitude)>90||Math.abs(longitude)>180)return [];
 const sunrise=solarAltitudeTime(midnight,latitude,longitude,-0.833,true);
 const sunset=solarAltitudeTime(midnight,latitude,longitude,-0.833,false);
 const previousSunset=solarAltitudeTime(midnight-DAY_MS,latitude,longitude,-0.833,false);
 const nextSunrise=solarAltitudeTime(midnight+DAY_MS,latitude,longitude,-0.833,true);
 // Midpoint-of-night fallback only where actual sunrise and sunset exist.
 const dawnBoundary=sunrise!==undefined&&previousSunset!==undefined?(sunrise+previousSunset-1440)/2:undefined;
 const nightBoundary=sunset!==undefined&&nextSunrise!==undefined?(sunset+nextSunrise+1440)/2:undefined;
 const minutes:Record<Prayer,number|undefined>={
  fajr:limitTwilight(solarAltitudeTime(midnight,latitude,longitude,-19.5,true),dawnBoundary,true),
  dhuhr:solarNoon(midnight,longitude)+1,
  asr:solarAltitudeTime(midnight,latitude,longitude,declination=>degrees(Math.atan(1/(1+Math.tan(radians(Math.abs(latitude-declination)))))),false),
  maghrib:sunset,
  isha:limitTwilight(solarAltitudeTime(midnight,latitude,longitude,-17.5,false),nightBoundary,false),
 };
 return PRAYERS.flatMap(prayer=>{
  const value=minutes[prayer];
  return value!==undefined&&Number.isFinite(value)?[{prayer,date:new Date(midnight+Math.round(value)*60000)}]:[];
 });
}
export const prayerDisplay=(date:Date,timezone:string)=>date.toLocaleTimeString(locale(),{timeZone:timezone,hour:'numeric',minute:'2-digit'});
