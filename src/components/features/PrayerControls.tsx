import { useMemo, useState } from 'react';
import { Check, Clock } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { number, dayKey, habitScheduled, displayDate } from '@/lib/dates';
import { PRAYERS, PRAYER_LABELS, calculatePrayers, prayerDisplay } from '@/lib/prayerTimes';
import { t } from '@/lib/i18n';
import type { Habit } from '@/types';
interface Props { habit:Habit }
export default function PrayerControls({habit}:Props){
 const {today,data,togglePrayer}=useApp(),[selected,setSelected]=useState(''),key=selected||today,checked=habit.prayers[key]||[];
 const times=useMemo(()=>calculatePrayers(key,data.settings.location),[key,data.settings.location]);
 const min=habit.startDate>habit.trackingFrom?habit.startDate:habit.trackingFrom,valid=key>=min&&key<=dayKey()&&habitScheduled(habit,key);
 return <section className="bg-soft rounded-xl p-4 mt-3 space-y-3">
  <div className="flex justify-between items-center gap-2"><h4 className="font-bold">{t('الصلوات الخمس','Five daily prayers')}</h4><strong className="text-primary text-xl">{number(checked.length)} / {number(5)}</strong></div>
  <label htmlFor={`prayer-day-${habit.id}`} className="label">{t('اليوم / قضاء صلاة سابقة','Today / make up a previous prayer')}</label>
  <div className="flex gap-2"><input id={`prayer-day-${habit.id}`} type="date" className="field min-w-0" min={min} max={today} value={key} onChange={e=>setSelected(e.target.value)}/><button type="button" className="btn-secondary" onClick={()=>setSelected('')}>{t('اليوم','Today')}</button></div>
  {key!==today&&<p className="text-primary text-sm">{t('قضاء صلوات','Make up prayers')}: {displayDate(key)}</p>}
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{PRAYERS.map(prayer=>{const time=times.find(item=>item.prayer===prayer);return <button type="button" key={prayer} disabled={!valid} aria-pressed={checked.includes(prayer)} className={`min-h-16 rounded-xl border p-3 flex flex-col items-center justify-center gap-1 ${checked.includes(prayer)?'bg-primary text-surface border-primary':'bg-surface border-line'}`} onClick={()=>togglePrayer(habit.id,key,prayer)}><span className="flex items-center gap-1 font-bold">{checked.includes(prayer)&&<Check size={16}/>} {t(PRAYER_LABELS[prayer])}</span>{time&&data.settings.location&&<span className="text-sm">{prayerDisplay(time.date,data.settings.location.timezone)}</span>}</button>;})}</div>
  <p className="text-sm text-muted flex gap-2"><Clock size={18} className="shrink-0"/>{data.settings.location?t('المواقيت محسوبة بالهيئة المصرية العامة للمساحة (العصر القياسي)، حسب موقعك ومنطقته الزمنية؛ طابق مسجدك المحلي.','Times use the Egyptian Survey Authority (standard Asr), your coordinates and time zone. Verify with your local mosque.'):t('حدّد موقعك من الإعدادات لحساب المواقيت. لا نستخدم موقعًا افتراضيًا.','Set your location in Settings to calculate times. No default location is assumed.')}</p>
  <p className="text-sm text-muted">{t('كل صلاة تُظهر تقدمك. اليوم الجزئي لا يخصم نقاطًا ولا يعيد السلسلة للصفر. القضاء يُسجّل بتاريخ الصلاة الأصلي.','Each prayer shows your progress. Partial days do not deduct points or reset your streak. Make-ups are recorded on the prayer’s original date.')}</p>
 </section>;
}
