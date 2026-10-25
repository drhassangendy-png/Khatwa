import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { addDays, dayKey, weekKey } from '@/lib/dates';
import { loadLocalData } from '@/lib/storage';
import { appDataSchema, weightEntrySchema } from '@/lib/dataValidation';
import { categoryNameSchema, findCategoryByName, MAX_CUSTOM_CATEGORIES } from '@/lib/categories';
import { settleHabit } from '@/lib/habitEngine';
import { configureLocale, t } from '@/lib/i18n';
import { useHabitActions } from '@/hooks/useHabitActions';
import type { AppData, CustomCategory, EntryDraft, Settings, Task, WeightEntry } from '@/types';
export function useKhatwa(){
 const [data,setData]=useState<AppData>(()=>{const loaded=loadLocalData();return {...loaded,habits:loaded.habits.map(h=>settleHabit(h))};});
 const [today,setToday]=useState(dayKey()),[celebrate,setCelebrate]=useState(0);
 configureLocale(data.settings);
 useEffect(()=>{
  try{localStorage.setItem('khatwa-v1',JSON.stringify(data));if(localStorage.getItem('khatwa-recovery-notice')){localStorage.removeItem('khatwa-recovery-notice');toast.error(t('حُفظت نسخة خام من البيانات القديمة للاسترجاع','A raw copy of the old data was saved for recovery'));}}
  catch{toast.error(t('تعذّر الحفظ على الجهاز. صدّر نسخة قبل الإغلاق.','Local saving failed. Export a backup before closing.'));}
  document.title=t('خطوة — عاداتك اليومية','Khatwa — your daily habits');document.documentElement.classList.toggle('dark',data.dark);document.documentElement.lang=data.settings.language;document.documentElement.dir=data.settings.language==='ar'?'rtl':'ltr';
 },[data]);
 useEffect(()=>{const timer=setInterval(()=>setToday(dayKey()),15000);return()=>clearInterval(timer);},[]);
 useEffect(()=>{setData(old=>{const habits=old.habits.map(h=>settleHabit(h,today));return habits.some((h,i)=>h!==old.habits[i])?{...old,habits}:old;});},[today]);
 const celebrateNow=useCallback(()=>setCelebrate(Date.now()),[]);
 const actions=useHabitActions({data,setData,celebrate:celebrateNow});
 const createCategory=useCallback((name:string)=>{
  const valid=categoryNameSchema.safeParse({name});if(!valid.success){toast.error(t('اكتب اسمًا من حرفين إلى ٤٠ حرفًا','Enter a name of 2–40 characters'));return null;}
  const existing=findCategoryByName(valid.data.name,data.categories);if(existing){toast(t('التصنيف موجود بالفعل','This category already exists'));return existing;}
  if(data.categories.length>=MAX_CUSTOM_CATEGORIES){toast.error(t('الحد الأقصى ٥٠ تصنيفًا','Maximum 50 custom categories'));return null;}
  const category:CustomCategory={id:`custom:${crypto.randomUUID()}`,name:valid.data.name};setData(old=>({...old,categories:[...old.categories,category]}));toast.success(t('حُفظ التصنيف','Category saved'));return category.id;
 },[data.categories]);
 const save=useCallback((draft:EntryDraft,kind:'habit'|'task',id?:string)=>{
  const common={title:draft.title,time:draft.time,startDate:draft.startDate,endDate:draft.endDate};
  const options={weeklyTarget:draft.weeklyTarget,weeklyDays:[...draft.weeklyDays],trainingType:draft.trainingType,target:draft.target,category:draft.category,schedule:draft.schedule,hijriAdjustment:draft.hijriAdjustment,mode:draft.mode,dailyLimit:draft.dailyLimit,monthDay:draft.monthDay,strict:draft.strict};
  setData(old=>kind==='habit'?{...old,habits:id?old.habits.map(h=>h.id===id?{...h,...common,...options}:h):[...old.habits,{...common,...options,id:crypto.randomUUID(),history:{},weights:[],slips:{},quitLimits:{},prayers:{},makeups:{},createdAt:dayKey(),trackingFrom:dayKey(),settledThrough:addDays(dayKey(),-1)}]}:{...old,tasks:id?old.tasks.map(task=>task.id===id?{...task,...common,date:draft.endDate}:task):[...old.tasks,{...common,id:crypto.randomUUID(),date:draft.endDate,done:false}]});
  toast.success(t('حُفظت خطوتك','Your step is saved'));
 },[]);
 const saveWeight=useCallback((id:string,entry:WeightEntry)=>{
  const habit=data.habits.find(h=>h.id===id);if(!habit||!weightEntrySchema.safeParse(entry).success||entry.date>dayKey()||entry.date<habit.startDate||entry.date>habit.endDate){toast.error(t('أدخل وزنًا صحيحًا ضمن فترة العادة','Enter a valid weight within the habit’s date range'));return false;}
  setData(old=>({...old,habits:old.habits.map(h=>h.id===id?{...h,weights:[...h.weights.filter(w=>weekKey(w.date)!==weekKey(entry.date)),entry].sort((a,b)=>a.date.localeCompare(b.date))}:h)}));toast.success(t('حُفظ قياس الأسبوع','Weekly measurement saved'));return true;
 },[data.habits]);
 const replaceData=useCallback((next:AppData)=>{const valid=appDataSchema.safeParse(next);if(!valid.success){toast.error(t('النسخة غير صالحة؛ لم تتغير بياناتك','Invalid backup; your data is unchanged'));return false;}setData({...valid.data,habits:valid.data.habits.map(h=>settleHabit(h))});toast.success(t('استُعيدت بياناتك','Your data is restored'));return true;},[]);
 const toggleTask=useCallback((task:Task)=>{setData(old=>({...old,tasks:old.tasks.map(item=>item.id===task.id?{...item,done:!item.done}:item)}));toast.success(t('حُدّثت المهمة','Task updated'));},[]);
 const remove=useCallback((kind:'habit'|'task',id:string)=>{setData(old=>kind==='habit'?{...old,habits:old.habits.filter(h=>h.id!==id)}:{...old,tasks:old.tasks.filter(task=>task.id!==id)});toast.success(t('تم الحذف','Deleted'));},[]);
 const updateSettings=useCallback((settings:Partial<Settings>)=>setData(old=>({...old,settings:{...old.settings,...settings}})),[]);
 return {data,today,celebrate,save,createCategory,...actions,saveWeight,replaceData,toggleTask,remove,updateSettings,toggleDark:()=>setData(old=>({...old,dark:!old.dark}))};
}
export type KhatwaState=ReturnType<typeof useKhatwa>;
