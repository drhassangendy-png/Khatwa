import type { HabitSchedule } from '@/types';
import { DEFAULT_WEEKLY_DAYS } from '@/constants/habits';
import { locale } from '@/lib/i18n';
const DAY_MS=86400000;
const hijriFormatter=new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn',{day:'numeric',timeZone:'UTC'});
const timestamp=(key:string)=>new Date(`${key}T12:00:00Z`).getTime();
const keyAt=(ms:number)=>new Date(ms).toISOString().slice(0,10);
const LAST_DAY=timestamp('9999-12-31');
export const isFasting=(schedule:HabitSchedule='daily')=>schedule==='fasting-mon-thu'||schedule==='fasting-white';
export const hijriDay=(key:string,adjustment=0)=>Number(hijriFormatter.formatToParts(new Date(timestamp(key)+adjustment*DAY_MS)).find(p=>p.type==='day')?.value);
export const displayHijri=(key:string,adjustment=0)=>new Intl.DateTimeFormat(locale(),{calendar:'islamic-umalqura',day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(timestamp(key)+adjustment*DAY_MS));
// Monthly 0 means last day; a date absent in a short month is not silently moved.
export function matchesSchedule(key:string,schedule:HabitSchedule='daily',adjustment=0,weeklyDays:readonly number[]=DEFAULT_WEEKLY_DAYS,monthDay=15){
 const date=new Date(timestamp(key)),weekday=date.getUTCDay();
 if(schedule==='weekly'||schedule==='weekdays')return weeklyDays.includes(weekday);
 if(schedule==='monthly')return monthDay===0?new Date(timestamp(key)+DAY_MS).getUTCDate()===1:date.getUTCDate()===monthDay;
 if(schedule==='fasting-mon-thu')return weekday===1||weekday===4;
 if(schedule==='fasting-white'){const day=hijriDay(key,adjustment);return day>=13&&day<=15;}
 return true;
}
export function nextScheduledDate(from:string,schedule:HabitSchedule='daily',adjustment=0,end?:string,days:readonly number[]=DEFAULT_WEEKLY_DAYS,monthDay=15):string|null{
 const start=timestamp(from);if(!Number.isFinite(start))return null;
 for(let i=0;i<370;i++){const ms=start+i*DAY_MS;if(ms>LAST_DAY)return null;const key=keyAt(ms);if(end&&key>end)return null;if(matchesSchedule(key,schedule,adjustment,days,monthDay))return key;}return null;
}
export function previousScheduledDate(from:string,schedule:HabitSchedule='daily',adjustment=0,days:readonly number[]=DEFAULT_WEEKLY_DAYS,monthDay=15):string|null{
 const start=timestamp(from);if(!Number.isFinite(start))return null;
 for(let i=0;i<370;i++){const key=keyAt(start-i*DAY_MS);if(matchesSchedule(key,schedule,adjustment,days,monthDay))return key;}return null;
}
export function countScheduledDates(start:string,end:string,schedule:HabitSchedule='daily',adjustment=0,limit=Infinity,days:readonly number[]=DEFAULT_WEEKLY_DAYS,monthDay=15){
 const from=timestamp(start),to=timestamp(end);if(!Number.isFinite(from)||!Number.isFinite(to)||to<from)return 0;
 let count=0;for(let ms=from;ms<=to&&count<limit;ms+=DAY_MS)if(matchesSchedule(keyAt(ms),schedule,adjustment,days,monthDay))count++;return count;
}
export function endDateForTarget(start:string,target:number,schedule:HabitSchedule='daily',adjustment=0,days:readonly number[]=DEFAULT_WEEKLY_DAYS,monthDay=15){
 const from=timestamp(start);if(!Number.isFinite(from)||!Number.isInteger(target)||target<1||target>3650)return start;
 if((schedule==='weekly'||schedule==='weekdays')&&!days.length)return start;
 let count=0;for(let i=0;i<target*70;i++){const ms=from+i*DAY_MS;if(ms>LAST_DAY)return '9999-12-31';const key=keyAt(ms);if(matchesSchedule(key,schedule,adjustment,days,monthDay)&&++count===target)return key;}return start;
}
