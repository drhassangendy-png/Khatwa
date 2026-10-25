import { BookOpen, Dumbbell, Heart, GraduationCap, Sprout, Flame, Pencil, Trash2, Tag, type LucideIcon } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { categoryLabel } from '@/lib/categories';
import { displayTime, displayDate, number, progress, streak } from '@/lib/dates';
import { TRAINING_LABELS } from '@/constants/habits';
import { t } from '@/lib/i18n';
import WeeklyHabitProgress from '@/components/features/WeeklyHabitProgress';
import WeightTracker from '@/components/features/WeightTracker';
import HabitActions from '@/components/features/HabitActions';
import HabitScheduleInfo from '@/components/features/HabitScheduleInfo';
import QuitControls from '@/components/features/QuitControls';
import PrayerControls from '@/components/features/PrayerControls';
import RecoveryControls from '@/components/features/RecoveryControls';
import type { Habit } from '@/types';
const ICONS:Record<string,LucideIcon>={reading:BookOpen,sport:Dumbbell,faith:Heart,learning:GraduationCap,other:Sprout};
interface Props { habit:Habit }
export default function HabitCard({habit}:Props){const {data,openEditor,requestDelete}=useApp(),completed=progress(habit),percent=Math.round(completed/habit.target*100),Icon=ICONS[habit.category]||Tag;
 return <article className="panel p-4 md:p-5 hover:-translate-y-0.5 transition-transform duration-200"><div className="flex items-start gap-3 flex-wrap"><span className="w-11 h-11 shrink-0 rounded-xl bg-soft text-primary flex items-center justify-center"><Icon size={21}/></span><div className="flex-1 min-w-0"><p className="text-xs text-primary font-bold mb-1">{habit.mode==='quit'?t('إقلاع بهدوء','A gentle change'):habit.mode==='prayers'?t('صلوات اليوم','Daily prayers'):t('بناء عادة','Build a habit')}{habit.strict?` · ${t('وضع صارم','Strict mode')}`:''}</p><h3 className="font-bold break-words">{t(habit.title)}</h3><div className="flex flex-wrap gap-2 text-sm text-muted mt-1"><span>{categoryLabel(habit.category,data.categories)}</span>{habit.mode!=='prayers'&&<span>· {displayTime(habit.time)}</span>}<span className="flex items-center gap-1 text-accent"><Flame size={14}/>{number(streak(habit))} {t('استمرار','streak')}</span></div></div><div className="shrink-0"><strong className="text-primary text-lg">{number(completed)}</strong><span className="text-sm text-muted"> / {number(habit.target)}</span><p className="text-xs text-muted">{t('خطوات / نقاط','steps / points')}</p></div></div>
 <p className="text-sm text-muted mt-3">{displayDate(habit.startDate)} — {displayDate(habit.endDate)}</p><HabitScheduleInfo habit={habit}/>
 {habit.category==='sport'&&<p className="text-sm text-primary mt-2">{t(TRAINING_LABELS[habit.trainingType])}</p>}
 {['weekly','weekdays'].includes(habit.schedule)&&<WeeklyHabitProgress habit={habit}/>}
 <div role="progressbar" aria-label={t('التقدم الكلي','Overall progress')} aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} className="h-2 bg-soft rounded-full my-4 overflow-hidden"><div className="h-full bg-primary rounded-full origin-left transition-transform duration-200" style={{transform:`scaleX(${percent/100})`}}/></div>
 {habit.mode==='quit'&&<QuitControls habit={habit}/>} {habit.mode==='prayers'&&<PrayerControls habit={habit}/>}
 <div className="flex items-center gap-2 flex-wrap mt-3"><div className="flex-1 flex flex-wrap gap-2 items-center"><HabitActions habit={habit}/></div><button className="icon-btn" aria-label={`${t('تعديل','Edit')} ${habit.title}`} onClick={()=>openEditor({kind:'habit',item:habit})}><Pencil size={16}/></button><button className="icon-btn" aria-label={`${t('حذف','Delete')} ${habit.title}`} onClick={()=>requestDelete({kind:'habit',id:habit.id,title:habit.title})}><Trash2 size={16}/></button></div>
 {habit.mode!=='prayers'&&<RecoveryControls habit={habit}/>} {habit.category==='sport'&&<WeightTracker habit={habit}/>}</article>;
}
