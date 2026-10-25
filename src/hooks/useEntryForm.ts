import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { entrySchemaFor } from '@/lib/validations';
import { dayKey } from '@/lib/dates';
import { endDateForTarget } from '@/lib/habitSchedule';
import { DEFAULT_WEEKLY_DAYS } from '@/constants/habits';
import type { EditorState } from '@/lib/AppContext';
import type { Category, EntryDraft, HabitSchedule } from '@/types';
export function useEntryForm(editor:EditorState) {
 const defaults=useMemo<EntryDraft>(()=>{
  const habit=editor.item&&'history' in editor.item?editor.item:undefined;
  const preset=editor.preset, startDate=editor.item?.startDate||preset?.startDate||dayKey();
  const target=habit?.target||preset?.target||30, schedule=habit?.schedule||preset?.schedule||'daily';
  const hijriAdjustment=habit?.hijriAdjustment??preset?.hijriAdjustment??0;
  const weeklyDays=[...(habit?.weeklyDays||preset?.weeklyDays||DEFAULT_WEEKLY_DAYS)];
  return {mode:habit?.mode||preset?.mode||'build',dailyLimit:habit?.dailyLimit??preset?.dailyLimit??0,monthDay:habit?.monthDay??preset?.monthDay??15,strict:habit?.strict??preset?.strict??false,title:editor.item?.title||preset?.title||'',time:editor.item?.time||preset?.time||'09:00',target,category:habit?.category||preset?.category||'other',schedule,hijriAdjustment,weeklyDays,weeklyTarget:habit?.weeklyTarget??preset?.weeklyTarget??3,trainingType:habit?.trainingType||preset?.trainingType||'full-body',date:dayKey(),startDate,endDate:editor.item?.endDate||preset?.endDate||(editor.kind==='habit'?endDateForTarget(startDate,target,schedule,hijriAdjustment,weeklyDays,habit?.monthDay??preset?.monthDay??15):dayKey())};
 },[editor]);
 const form=useForm<EntryDraft>({resolver:zodResolver(entrySchemaFor(editor.kind)),defaultValues:defaults});
 const resize=(overrides:Partial<EntryDraft>={})=>{
  const value={...form.getValues(),...overrides}, target=Number(value.target);
  if(editor.kind==='habit'&&Number.isInteger(target)&&target>=1&&target<=3650)form.setValue('endDate',endDateForTarget(value.startDate,target,value.schedule,value.hijriAdjustment,value.weeklyDays,Number(value.monthDay)),{shouldValidate:true});
 };
 const changeSchedule=(schedule:HabitSchedule)=>{form.setValue('schedule',schedule,{shouldDirty:true});resize({schedule});};
 const changeCategory=(category:Category)=>{
  const schedule=form.getValues('schedule');
  if(category!=='faith'&&!['daily','weekly','weekdays','monthly'].includes(schedule)){form.setValue('hijriAdjustment',0);changeSchedule('daily');}
 };
 const changeWeeklyTarget=(count:number)=>{
  const days=[...new Set([...form.getValues('weeklyDays'),...DEFAULT_WEEKLY_DAYS,2,4,6,0])].slice(0,count);
  form.setValue('weeklyTarget',count,{shouldDirty:true});form.setValue('weeklyDays',days,{shouldValidate:true,shouldDirty:true});resize({weeklyDays:days});
 };
 const toggleDay=(day:number)=>{
  const current=form.getValues('weeklyDays'), days=current.includes(day)?current.filter(d=>d!==day):[...current,day];
  form.setValue('weeklyDays',days,{shouldValidate:true,shouldDirty:true});resize({weeklyDays:days});
 };
 return {...form,resize,changeSchedule,changeCategory,changeWeeklyTarget,toggleDay};
}
