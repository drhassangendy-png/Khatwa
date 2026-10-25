import { solarPosition, radians, degrees } from '@/lib/solarPosition';
export type SolarElevation=number|((declination:number)=>number);
export function solarNoon(midnight:number,longitude:number):number {
 let minutes=720-4*longitude;
 for(let iteration=0;iteration<4;iteration++) {
  minutes=720-4*longitude-solarPosition(midnight+minutes*60000).equationOfTime;
 }
 return minutes;
}
// Return UTC minutes relative to midnight, allowing events on adjacent UTC dates.
// Undefined means the sun never reaches this elevation on the selected date.
export function solarAltitudeTime(midnight:number,latitude:number,longitude:number,elevation:SolarElevation,morning:boolean):number|undefined {
 let minutes=solarNoon(midnight,longitude);
 for(let iteration=0;iteration<4;iteration++) {
  const {declination,equationOfTime}=solarPosition(midnight+minutes*60000);
  const altitude=typeof elevation==='number'?elevation:elevation(declination);
  const cosine=(Math.sin(radians(altitude))-Math.sin(radians(latitude))*Math.sin(radians(declination)))
   /(Math.cos(radians(latitude))*Math.cos(radians(declination)));
  if(!Number.isFinite(cosine)||Math.abs(cosine)>1)return undefined;
  const hourAngle=degrees(Math.acos(cosine));
  minutes=720-4*longitude-equationOfTime+(morning?-4:4)*hourAngle;
 }
 return minutes;
}
