import { useCallback, type Dispatch, type SetStateAction } from 'react';
import { toast } from 'sonner';
import { dayKey, habitScheduled, progress, outcomeOn } from '@/lib/dates';
import { freezeRemaining } from '@/lib/habitEngine';
import { t } from '@/lib/i18n';
import type { AppData, Habit, Prayer } from '@/types';
interface Options { data:AppData; setData:Dispatch<SetStateAction<AppData>>; celebrate:()=>void }
export function useHabitActions({data,setData,celebrate}:Options){
 const update=useCallback((id:string,transform:(habit:Habit)=>Habit)=>setData(old=>({...old,habits:old.habits.map(h=>h.id===id?transform(h):h)})),[setData]);
 const check=useCallback((habit:Habit,outcome:'done'|'skip'|'undo')=>{
  const current=data.habits.find(h=>h.id===habit.id),key=dayKey();if(!current||current.mode!=='build'||!habitScheduled(current,key))return;
  if(outcome!=='undo'&&(current.history[key]||progress(current)>=current.target))return;
  update(habit.id,h=>{const history={...h.history};if(outcome==='undo')delete history[key];else history[key]=outcome;return {...h,history};});
  if(outcome==='done'){celebrate();toast.success(t('خطوة جميلة. شكرًا لحرصك على الاستمرار.','A good step. Thank you for showing up.'));}
  else toast(outcome==='skip'?t('يوم صعب لا يلغي رحلتك. خطوة واحدة تتراجع، وفرصة جديدة تنتظرك.','A difficult day does not erase your journey. One step back, another chance ahead.'):t('أُلغي تسجيل اليوم','Today’s entry was undone'));
 },[data.habits,update,celebrate]);
 const logSlip=useCallback((id:string,delta:number)=>{
  const h=data.habits.find(item=>item.id===id),key=dayKey();if(!h||h.mode!=='quit'||!habitScheduled(h,key))return;
  const count=Math.max(0,Math.min(10000,(h.slips[key]||0)+delta));
  update(id,current=>({...current,slips:{...current.slips,[key]:count},quitLimits:{...current.quitLimits,[key]:current.dailyLimit},history:{...current.history,[key]:current.history[key]==='freeze'?'freeze':count<=current.dailyLimit?'done':'skip'}}));
  if(delta>0&&count===h.dailyLimit+1)toast(t('تجاوزت حدّك اليوم، وهذا لا يقلّل من قيمتك. لاحظ ما تحتاجه، وابدأ من جديد بهدوء.','You passed your limit today. This does not define your worth. Notice what you need, and begin again gently.'));
 },[data.habits,update]);
 const freeze=useCallback((id:string,key:string)=>{
  const h=data.habits.find(item=>item.id===id);
  if(!h||key>dayKey()||key.slice(0,7)!==dayKey().slice(0,7)||!habitScheduled(h,key)||outcomeOn(h,key)!=='skip')return;
  if(!freezeRemaining(data)){toast(t('استخدمت تجميدي هذا الشهر؛ يتجددان الشهر القادم','Both freezes are used for this month. They renew next month.'));return;}
  setData(old=>freezeRemaining(old)?{...old,habits:old.habits.map(current=>current.id===id?{...current,history:{...current.history,[key]:'freeze'}}:current)}:old);
  toast.success(t('حُفظت سلسلتك دون خصم خطوة. التجميد ليس يوم إنجاز.','Your streak is protected, with no step deduction. A freeze is not a completed day.'));
 },[data, setData]);
 const makeUp=useCallback((id:string,key:string)=>{
  const h=data.habits.find(item=>item.id===id),today=dayKey();
  if(!h||key>=today||key<h.trackingFrom||!habitScheduled(h,key)||outcomeOn(h,key)==='done'||h.mode==='prayers'||h.makeups[key])return;
  if(h.mode==='quit'&&Object.values(h.makeups).includes(today)){toast(t('يوم التعويض يعوّض يومًا واحدًا فقط','A replacement day can recover only one earlier day'));return;}
  update(id,current=>({...current,history:current.mode==='quit'?current.history:{...current.history,[key]:'done'},makeups:{...current.makeups,[key]:today}}));
  if(h.mode==='build')celebrate();
  toast.success(h.mode==='quit'?t('سُجّل التعويض. يُستعاد الخصم إذا انتهى اليوم ضمن حدّك، دون تغيير حقيقة اليوم السابق.','Recovery recorded. The deduction is restored if today closes within your limit; the earlier count is unchanged.'):t('سُجّلت خطوة التعويض بتاريخها الأصلي','Your make-up step is recorded on its original date'));
 },[data.habits,update,celebrate]);
 const togglePrayer=useCallback((id:string,key:string,prayer:Prayer)=>{
  const h=data.habits.find(item=>item.id===id);if(!h||h.mode!=='prayers'||key>dayKey()||key<h.trackingFrom||!habitScheduled(h,key))return;
  const current=h.prayers[key]||[],prayers=current.includes(prayer)?current.filter(p=>p!==prayer):[...current,prayer];
  update(id,habit=>({...habit,prayers:{...habit.prayers,[key]:prayers},history:{...habit.history,[key]:prayers.length===5?'done':'partial'},makeups:key<dayKey()?{...habit.makeups,[key]:dayKey()}:habit.makeups}));
  if(prayers.length===5){celebrate();toast.success(t('اكتمل تسجيل صلوات هذا اليوم. تقبّل الله.','All five prayers are recorded for this day.'));}
 },[data.habits,update,celebrate]);
 return {check,logSlip,freeze,makeUp,togglePrayer};
}
