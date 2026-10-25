import { Check, RotateCcw } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { addDays, displayDate, habitScheduled, progress } from '@/lib/dates';
import { nextScheduledDate } from '@/lib/habitSchedule';
import { t } from '@/lib/i18n';
import type { Habit } from '@/types';
interface Props { habit:Habit }
export default function HabitActions({habit}:Props){const {today,check}=useApp(),outcome=habit.history[today];
 if(habit.mode!=='build')return null;
 if(outcome)return <><span className="text-sm flex gap-2 text-primary">{outcome==='done'?<Check size={16}/>:<RotateCcw size={16}/>} {outcome==='done'?t('أنجزتها اليوم','Completed today'):outcome==='freeze'?t('سلسلتك محمية اليوم','Your streak is protected today'):t('فرصة أخرى تنتظرك','Another chance awaits')}</span><button className="icon-btn" onClick={()=>check(habit,'undo')} aria-label={t('إلغاء تسجيل اليوم','Undo today’s entry')}><RotateCcw size={16}/></button></>;
 if(progress(habit)>=habit.target)return <span className="text-primary font-bold">{t('اكتمل هدفك','Your target is complete')}</span>;
 if(!habitScheduled(habit,today)){const next=nextScheduledDate(habit.startDate>today?habit.startDate:addDays(today,1),habit.schedule,habit.hijriAdjustment,habit.endDate,habit.weeklyDays,habit.monthDay);return <p className="text-sm text-muted">{next?`${t('الموعد التالي','Next due day')}: ${displayDate(next)}`:t('انتهت الفترة؛ يمكنك تمديدها من التعديل','The date range has ended. Extend it in the editor.')}</p>;}
 return <><button type="button" className="btn bg-soft text-primary" onClick={()=>check(habit,'done')}><Check size={16}/>{t('أنجزتها اليوم','Done today')}</button><button type="button" className="btn text-muted font-normal" onClick={()=>check(habit,'skip')}>{t('لم أفعلها اليوم','Not today')}</button></>;
}
