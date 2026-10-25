import type { Habit, Outcome } from '@/types';
import { matchesSchedule } from '@/lib/habitSchedule';
import { locale } from '@/lib/i18n';
export const dayKey=(date=new Date())=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export const number=(value:number)=>value.toLocaleString(locale());
export const addDays=(key:string,days:number)=>{const date=new Date(`${key}T12:00:00`);date.setDate(date.getDate()+days);return dayKey(date);};
export const displayDate=(key:string)=>new Date(`${key}T12:00:00`).toLocaleDateString(locale(),{day:'numeric',month:'short',year:'numeric'});
export const displayTime=(time:string)=>new Date(`2000-01-01T${time}`).toLocaleTimeString(locale(),{hour:'numeric',minute:'2-digit'});
export const weekKey=(key=dayKey())=>{const date=new Date(`${key}T12:00:00`);date.setDate(date.getDate()-(date.getDay()+6)%7);return dayKey(date);};
export const habitScheduled=(habit:Habit,key=dayKey())=>habit.startDate<=key&&habit.endDate>=key&&matchesSchedule(key,habit.schedule,habit.hijriAdjustment,habit.weeklyDays,habit.monthDay);
export const quitLimitOn=(habit:Habit,key:string)=>habit.quitLimits[key]??habit.dailyLimit;
export function outcomeOn(habit:Habit,key:string):Outcome|undefined{
 if(!habitScheduled(habit,key))return undefined;
 if(habit.history[key]==='freeze')return 'freeze';
 if(habit.mode==='quit'&&key>=habit.trackingFrom&&key<=dayKey()){
  if((habit.slips[key]||0)<=quitLimitOn(habit,key))return 'done';
  const recovery=habit.makeups[key];
  return recovery&&habit.history[recovery]==='done'&&recovery<dayKey()&&(habit.slips[recovery]||0)<=quitLimitOn(habit,recovery)?'partial':'skip';
 }
 return habit.history[key];
}
export const completedDays=(habit:Habit)=>Object.keys(habit.history).filter(key=>key<=dayKey()&&outcomeOn(habit,key)==='done').length;
export const habitActive=(habit:Habit,key=dayKey())=>habitScheduled(habit,key)&&(progress(habit)<habit.target||!!outcomeOn(habit,key));
export const progress=(habit:Habit)=>Object.keys(habit.history).sort().reduce((sum,key)=>{const outcome=key<=dayKey()?outcomeOn(habit,key):undefined;return Math.min(habit.target,Math.max(0,sum+(outcome==='done'?1:outcome==='skip'?-1:0)));},0);
export function streak(habit:Habit,longest=false){
 let count=0,max=0,misses=0;const today=dayKey(),first=[habit.trackingFrom,...Object.keys(habit.history)].sort()[0],end=habit.endDate<today?habit.endDate:today;
 for(let key=first;key<=end;key=addDays(key,1)){
  if(!habitScheduled(habit,key))continue;
  const outcome=outcomeOn(habit,key);if(key===today&&!outcome)continue;
  if(outcome==='done'){count++;misses=0;max=Math.max(max,count);}
  else if(outcome==='freeze'||outcome==='partial')misses=0;
  else if(++misses>=(habit.strict?1:2))count=0;
 }
 return longest?max:count;
}
