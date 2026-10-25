export type BuiltinCategory = 'reading' | 'sport' | 'faith' | 'learning' | 'other';
export type Category = BuiltinCategory | `custom:${string}`;
export interface CustomCategory { id:`custom:${string}`; name:string }
export interface WeightEntry { date:string; kg:number }
export type TrainingType = 'full-body'|'chest'|'back'|'legs'|'shoulders'|'arms'|'cardio'|'other';
export interface WeeklyPlan { weeklyTarget:number; weeklyDays:number[]; trainingType:TrainingType }
export type HabitSchedule = 'daily'|'weekly'|'weekdays'|'monthly'|'fasting-mon-thu'|'fasting-white'|'night-prayer'|'morning-azkar'|'evening-azkar';
export type HabitMode = 'build'|'quit'|'prayers';
export type Outcome = 'done'|'skip'|'freeze'|'partial';
export type Prayer = 'fajr'|'dhuhr'|'asr'|'maghrib'|'isha';
export interface HabitOptions { mode:HabitMode; dailyLimit:number; monthDay:number; strict:boolean }
export interface Habit extends WeeklyPlan, HabitOptions { schedule:HabitSchedule; hijriAdjustment:number; id:string; title:string; time:string; target:number; category:Category; history:Record<string,Outcome>; createdAt:string; startDate:string; endDate:string; weights:WeightEntry[]; slips:Record<string,number>; quitLimits:Record<string,number>; prayers:Record<string,Prayer[]>; makeups:Record<string,string>; trackingFrom:string; settledThrough:string }
export interface Task { id:string; title:string; time:string; date:string; done:boolean; startDate:string; endDate:string }
export interface PrayerLocation { latitude:number; longitude:number; timezone:string }
export interface Settings { language:'ar'|'en'; numerals:'arabic'|'latin'; muted:boolean; location:PrayerLocation|null }
export interface AppData { habits:Habit[]; tasks:Task[]; dark:boolean; categories:CustomCategory[]; settings:Settings }
export interface EntryDraft extends WeeklyPlan, HabitOptions { schedule:HabitSchedule; hijriAdjustment:number; title:string; time:string; target:number; category:Category; date:string; startDate:string; endDate:string }
