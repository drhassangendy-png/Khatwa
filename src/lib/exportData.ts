import { dayKey, number, progress, streak, outcomeOn, quitLimitOn } from '@/lib/dates';
import { categoryLabel } from '@/lib/categories';
import { SCHEDULE_LABELS } from '@/constants/spiritual';
import { TRAINING_LABELS, WEEK_DAYS } from '@/constants/habits';
import { PRAYER_LABELS } from '@/lib/prayerTimes';
import { t } from '@/lib/i18n';
import type { AppData, HabitMode, Outcome } from '@/types';
function download(content:string,type:string,name:string){const url=URL.createObjectURL(new Blob([content],{type})),link=document.createElement('a');link.href=url;link.download=name;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export function exportJson(data:AppData){download(JSON.stringify({app:'khatwa',version:3,exportedAt:new Date().toISOString(),data},null,2),'application/json',`khatwa-backup-${dayKey()}.json`);}
function cell(value:string|number){const text=String(value),safe=/^[\s]*[=+\-@\t\r]/.test(text)?`'${text}`:text;return `"${safe.replace(/"/g,'""')}"`;}
const modeLabel=(mode:HabitMode)=>mode==='quit'?t('إقلاع عن عادة','Quit a habit'):mode==='prayers'?t('الصلوات الخمس','Five daily prayers'):t('بناء عادة','Build a habit');
const statusLabel=(outcome:Outcome|undefined)=>outcome==='done'?t('ضمن الهدف','Within target'):outcome==='skip'?t('تجاوز الحد / موعد غير مكتمل','Over limit / incomplete due day'):outcome==='freeze'?t('تجميد السلسلة','Streak freeze'):outcome==='partial'?t('جزئي / تعويض','Partial / recovered'):'';
export function exportCsv(data:AppData){
 const headers=[['نوع السجل','Record type'],['الاسم','Name'],['النوع','Mode'],['التصنيف','Category'],['البداية','Start'],['النهاية','End'],['التذكير','Reminder'],['الهدف','Target'],['الخطوات / النقاط','Steps / points'],['أطول سلسلة','Longest streak'],['التكرار','Schedule'],['أيام الأسبوع','Weekdays'],['يوم الشهر (٠ = الأخير)','Month day (0 = last)'],['تصحيح هجري','Hijri adjustment'],['الحد اليومي','Daily limit'],['وضع صارم','Strict mode'],['التاريخ','Date'],['الحالة','Status'],['عدد المرات','Occurrences'],['الصلوات المسجلة','Recorded prayers'],['تاريخ التعويض','Make-up date'],['الوزن كغ','Weight kg'],['التدريب','Training'],['بداية التتبع','Tracking starts']];
 const rows:(string|number)[][]=[headers.map(([ar,en])=>t(ar,en))];
 data.habits.forEach(h=>{
  const base=[t('عادة','Habit'),h.title,modeLabel(h.mode),categoryLabel(h.category,data.categories),h.startDate,h.endDate,h.time,h.target,progress(h),streak(h,true),t(SCHEDULE_LABELS[h.schedule]),WEEK_DAYS.filter(day=>h.weeklyDays.includes(day.value)).map(day=>t(day.label)).join(' / '),h.schedule==='monthly'?h.monthDay:'',h.hijriAdjustment,h.mode==='quit'?h.dailyLimit:'',h.strict?t('نعم','Yes'):t('لا','No')];
  const tail=[h.category==='sport'?t(TRAINING_LABELS[h.trainingType]):'',h.trackingFrom];
  rows.push([...base,'','','','','','',...tail]);
  const dates=[...new Set([...Object.keys(h.history),...Object.keys(h.slips),...Object.keys(h.prayers)])].sort();
  dates.forEach(date=>{const row=[t('تسجيل يومي','Daily entry'),...base.slice(1),date,statusLabel(outcomeOn(h,date)),h.slips[date]??'',(h.prayers[date]||[]).map(prayer=>t(PRAYER_LABELS[prayer])).join(' / '),h.makeups[date]||'','',...tail];if(h.mode==='quit')row[14]=quitLimitOn(h,date);rows.push(row);});
  h.weights.forEach(w=>rows.push([t('قياس وزن','Weight entry'),...base.slice(1),w.date,'','','','',w.kg,...tail]));
 });
 data.tasks.forEach(task=>rows.push([t('مهمة','Task'),task.title,'','',task.startDate,task.endDate,task.time,...Array<string>(9).fill(''),task.date,task.done?t('مكتملة','Completed'):t('نشطة','Active'),...Array<string>(6).fill('')]));
 download('\uFEFF'+rows.map(row=>row.map(value=>cell(typeof value==='number'?number(value):value)).join(',')).join('\r\n'),'text/csv;charset=utf-8',`khatwa-data-${dayKey()}.csv`);
}
