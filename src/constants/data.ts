import { DEFAULT_WEEKLY_DAYS } from '@/constants/habits';
import { addDays, dayKey } from '@/lib/dates';
import type { AppData, BuiltinCategory, Category, Habit } from '@/types';
import { DEFAULT_OPTIONS, DEFAULT_SETTINGS } from '@/lib/habitEngine';
export const CATEGORIES:Record<BuiltinCategory,string>={reading:'قراءة',sport:'رياضة',faith:'روحانيات',learning:'تعلّم',other:'أخرى'};
const createHabit=(id:string,title:string,time:string,target:number,category:Category):Habit=>({...DEFAULT_OPTIONS,slips:{},quitLimits:{},prayers:{},makeups:{},trackingFrom:dayKey(),settledThrough:addDays(dayKey(),-1),id,title,time,target,category,weeklyTarget:3,weeklyDays:[...DEFAULT_WEEKLY_DAYS],trainingType:'full-body',schedule:id==='azkar'?'morning-azkar':'daily',hijriAdjustment:0,history:{},createdAt:dayKey(),startDate:dayKey(),endDate:addDays(dayKey(),target-1),weights:[]});
export const INITIAL_DATA:AppData={dark:false,categories:[],settings:DEFAULT_SETTINGS,habits:[createHabit('azkar','أذكار الصباح','07:00',30,'faith'),createHabit('reading','قراءة ١٠ صفحات','09:00',100,'reading'),createHabit('sport','المشي لمدة ٣٠ دقيقة','17:00',30,'sport'),createHabit('learn','تعلّم شيء جديد','20:00',60,'learning')],tasks:[]};
export const MOTIVATION=['شكرًا لنفسك على هذه الخطوة. الاستمرار يصنع الفرق.'];
