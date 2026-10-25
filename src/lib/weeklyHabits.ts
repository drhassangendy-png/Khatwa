import { addDays, dayKey, weekKey, outcomeOn } from '@/lib/dates';
import type { Habit } from '@/types';
export function weeklySummary(habit:Habit,today=dayKey()){
 const start=weekKey(today),dates=Array.from({length:7},(_,index)=>addDays(start,index));
 const completed=dates.filter(date=>date<=today&&outcomeOn(habit,date)==='done').length,target=habit.schedule==='weekdays'?habit.weeklyDays.length:habit.weeklyTarget;
 return {start,end:addDays(start,6),dates,completed,target,percent:target?Math.min(100,completed/target*100):0};
}
