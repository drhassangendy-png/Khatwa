import { AlertCircle, Bell, Plus } from 'lucide-react';
import { useApp, type EditorState } from '@/lib/AppContext';
import { useEntryForm } from '@/hooks/useEntryForm';
import { t } from '@/lib/i18n';
import HabitFields from '@/components/forms/HabitFields';
import HabitModeFields from '@/components/forms/HabitModeFields';
import ScheduleFields from '@/components/forms/ScheduleFields';
import FrequencyFields from '@/components/forms/FrequencyFields';
import TrainingFields from '@/components/forms/TrainingFields';
import DateRangeFields from '@/components/forms/DateRangeFields';
import type { EntryDraft } from '@/types';
interface Props { editor:EditorState; onClose:()=>void }
export default function EntryForm({editor,onClose}:Props){
 const {save}=useApp();const {register,handleSubmit,watch,setValue,resize,changeSchedule,changeCategory,changeWeeklyTarget,toggleDay,formState:{errors,isSubmitting}}=useEntryForm(editor);
 const values=watch(),habit=editor.kind==='habit',locked=!!editor.item&&'history' in editor.item&&(Object.keys(editor.item.history).length>0||editor.item.mode==='prayers');
 const submit=(draft:EntryDraft)=>{save(draft,editor.kind,editor.item?.id);onClose();};
 return <form onSubmit={handleSubmit(submit)} className="p-6 space-y-5"><div><label className="label" htmlFor="title">{habit?t('اسم العادة','Habit name'):t('عنوان المهمة','Task title')}</label><input id="title" className="field" autoFocus {...register('title')} aria-invalid={!!errors.title}/>{errors.title&&<p role="alert" className="text-danger flex gap-2 text-sm mt-2"><AlertCircle size={16}/>{t(errors.title.message||'')}</p>}</div>
 {habit&&<HabitModeFields register={register} errors={errors} mode={values.mode} locked={locked}/>}
 {habit&&<HabitFields register={register} errors={errors} sessionTarget={values.category==='sport'&&values.mode==='build'} onTargetChange={target=>resize({target})} onCategoryChange={changeCategory} onCategoryCreated={category=>{setValue('category',category,{shouldDirty:true,shouldValidate:true});changeCategory(category);}}/>}
 {habit&&values.category==='faith'&&<ScheduleFields register={register} errors={errors} schedule={values.schedule} onChange={changeSchedule} onAdjustmentChange={value=>{setValue('hijriAdjustment',value);resize({hijriAdjustment:value});}}/>}
 {habit&&(values.category!=='faith'||['weekly','weekdays','monthly'].includes(values.schedule))&&<FrequencyFields register={register} errors={errors} schedule={values.schedule} weeklyTarget={values.weeklyTarget} weeklyDays={values.weeklyDays} showSelector={values.category!=='faith'} onSchedule={changeSchedule} onFrequency={changeWeeklyTarget} onDay={toggleDay} onMonthDay={monthDay=>resize({monthDay})}/>}
 {habit&&values.category==='sport'&&<TrainingFields register={register} errors={errors}/>}
 {errors.schedule&&values.category!=='faith'&&<p role="alert" className="text-danger text-sm flex gap-2"><AlertCircle size={16}/>{t(errors.schedule.message||'')}</p>}
 <DateRangeFields register={register} errors={errors} task={!habit} onStartChange={startDate=>resize({startDate})}/>
 {values.mode!=='prayers'&&<div><label htmlFor="time" className="label">{t('وقت التذكير','Reminder time')}</label><input id="time" type="time" className="field" {...register('time')} aria-invalid={!!errors.time}/>{errors.time&&<p role="alert" className="text-danger text-sm">{t(errors.time.message||'')}</p>}</div>}
 <p className="text-sm text-muted bg-soft p-3 rounded-xl flex gap-2"><Bell size={18} className="shrink-0 text-primary"/>{t('التنبيهات تعمل أثناء فتح التطبيق. فعّل الصوت والإشعارات من الإعدادات. أيام الإقلاع تُغلق عند منتصف الليل حسب جهازك، ويبدأ التتبع التلقائي من يوم الإضافة دون عقوبات رجعية.','Reminders work while the app is open. Enable sound and notifications in Settings. Quit days close at device-local midnight. Automatic tracking starts on creation, without retroactive penalties.')}</p><div className="flex gap-3 border-t border-line pt-5"><button className="btn-primary flex-1" disabled={isSubmitting}><Plus size={18}/>{editor.item?t('حفظ التعديلات','Save changes'):habit?t('إضافة العادة','Add habit'):t('إضافة المهمة','Add task')}</button><button className="btn-secondary" type="button" onClick={onClose}>{t('إلغاء','Cancel')}</button></div></form>;
}
