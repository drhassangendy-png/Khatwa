import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { dayKey, habitActive } from '@/lib/dates';
import { t } from '@/lib/i18n';
import { unlockAudio, playChime } from '@/lib/audio';
import { calculatePrayers, PRAYER_LABELS } from '@/lib/prayerTimes';
import { readReminderLog, storeReminder } from '@/lib/reminderStorage';
import { requestNotificationPermission } from '@/lib/notificationPermission';
import type { AppData } from '@/types';
export function useReminders(data:AppData){
 const sent=useRef(new Set<string>());
 useEffect(()=>{
  let prayerCache:{key:string;items:ReturnType<typeof calculatePrayers>}|null=null;
  const check=()=>{
   const now=new Date(),today=dayKey(now),time=`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
   const alert=(key:string,title:string)=>{
    if(sent.current.has(key))return;
    if(readReminderLog().includes(key)){sent.current.add(key);return;}
    sent.current.add(key);storeReminder(key,today);
    toast(t('حان وقت خطوتك','Time for your next step'),{description:title,duration:10000});if(!data.settings.muted)playChime();
    if('Notification' in window&&Notification.permission==='granted'){try{new Notification(t('خطوة | تذكير لطيف','Khatwa | A gentle reminder'),{body:title});}catch{console.warn('Browser notification unavailable; in-app reminder delivered');}}
   };
   data.habits.filter(h=>h.mode!=='prayers'&&habitActive(h,today)&&(h.mode==='quit'||!h.history[today])).forEach(h=>{if(h.time===time)alert(`${today}-${h.id}-${time}`,t(h.title));});
   data.tasks.filter(task=>!task.done&&task.date===today&&task.time===time).forEach(task=>alert(`${today}-${task.id}-${time}`,task.title));
   const prayerHabits=data.habits.filter(h=>h.mode==='prayers'&&habitActive(h,today));
   if(!prayerHabits.length)return;
   if(prayerCache?.key!==today)prayerCache={key:today,items:calculatePrayers(today,data.settings.location)};
   prayerCache.items.forEach(item=>{const elapsed=now.getTime()-item.date.getTime();if(elapsed>=0&&elapsed<60000&&prayerHabits.some(h=>!h.prayers[today]?.includes(item.prayer)))alert(`${today}-prayer-${item.prayer}`,t(PRAYER_LABELS[item.prayer]));});
  };
  check();const timer=setInterval(check,10000);return()=>clearInterval(timer);
 },[data]);
 return async()=>{
  const permissionRequest=requestNotificationPermission();
  try{const enabled=await unlockAudio();if(enabled&&!data.settings.muted)playChime();if(!enabled)toast(t('الصوت غير متاح؛ التذكيرات المرئية مستمرة','Audio is unavailable; visual reminders remain active'));}catch{toast(t('تعذّر تفعيل الصوت؛ جرّب الرابط المنشور','Could not enable sound. Try the published app.'));}
  const permission=await permissionRequest;
  toast(permission==='granted'?t('فُعّلت التنبيهات أثناء فتح التطبيق','Reminders enabled while the app is open'):t('إشعارات النظام غير متاحة أو غير مسموحة؛ التذكيرات داخل التطبيق مستمرة أثناء فتحه','System notifications are unavailable or denied; in-app reminders remain active while the app is open'));
 };
}
