import { CalendarDays } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { addDays, displayDate, number } from '@/lib/dates';
import { displayHijri, nextScheduledDate } from '@/lib/habitSchedule';
import { SCHEDULE_LABELS } from '@/constants/spiritual';
import { t } from '@/lib/i18n';
import type { Habit } from '@/types';
interface Props { habit:Habit }
export default function HabitScheduleInfo({habit}:Props){const {today}=useApp();const next=nextScheduledDate(habit.startDate>today?habit.startDate:habit.history[today]?addDays(today,1):today,habit.schedule,habit.hijriAdjustment,habit.endDate,habit.weeklyDays,habit.monthDay);return <div className="mt-3 text-sm space-y-1"><p className="text-primary flex gap-2 items-center"><CalendarDays size={16}/>{t(SCHEDULE_LABELS[habit.schedule])}{habit.schedule==='monthly'?` · ${habit.monthDay===0?t('آخر يوم','Last day'):number(habit.monthDay)}`:''}</p>{next&&<p className="text-muted">{t('الموعد التالي','Next due day')}: {displayDate(next)}{habit.schedule==='fasting-white'?` · ${displayHijri(next,habit.hijriAdjustment)}`:''}</p>}</div>;}
