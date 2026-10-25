import { addDays, dayKey, habitScheduled, outcomeOn } from '@/lib/dates';
import type { AppData, Habit } from '@/types';
export const DEFAULT_SETTINGS:AppData['settings']={language:'ar',numerals:'arabic',muted:false,location:null};
export const DEFAULT_OPTIONS={mode:'build' as const,dailyLimit:0,monthDay:15,strict:false};
// Close elapsed due dates once. Imported historical records are never overwritten.
export function settleHabit(habit:Habit,today=dayKey()):Habit{
 const end=habit.endDate<today?habit.endDate:addDays(today,-1);
 if(habit.settledThrough>=end)return habit;
 const history={...habit.history},quitLimits={...habit.quitLimits};
 for(let key=addDays(habit.settledThrough,1);key<=end;key=addDays(key,1)){
  if(key<habit.trackingFrom||!habitScheduled(habit,key))continue;
  if(habit.mode==='quit')quitLimits[key]??=habit.dailyLimit;
  if(history[key])continue;
  history[key]=habit.mode==='quit'?(habit.slips[key]||0)<=quitLimits[key]?'done':'skip':habit.mode==='prayers'?(habit.prayers[key]?.length===5?'done':'partial'):'skip';
 }
 return {...habit,history,quitLimits,settledThrough:end};
}
export const freezeRemaining=(data:AppData,month=dayKey().slice(0,7))=>Math.max(0,2-data.habits.reduce((sum,h)=>sum+Object.entries(h.history).filter(([key,outcome])=>key.startsWith(month)&&outcome==='freeze').length,0));
export const recentDueDates=(habit:Habit,today=dayKey())=>Array.from({length:60},(_,index)=>addDays(today,-index-1)).filter(key=>key>=habit.trackingFrom&&habitScheduled(habit,key)&&outcomeOn(habit,key)!=='done');
