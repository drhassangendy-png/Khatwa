import type { HabitSchedule } from '@/types';
export const HABIT_SCHEDULES=['daily','weekly','weekdays','monthly','fasting-mon-thu','fasting-white','night-prayer','morning-azkar','evening-azkar'] as const;
export const SCHEDULE_LABELS:Record<HabitSchedule,string>={daily:'كل يوم',weekly:'أيام محددة كل أسبوع',weekdays:'أيام أسبوع محددة',monthly:'يوم محدد كل شهر','fasting-mon-thu':'صيام الاثنين والخميس','fasting-white':'صيام الأيام البيض','night-prayer':'قيام الليل','morning-azkar':'أذكار الصباح','evening-azkar':'أذكار المساء'};
export interface SpiritualTemplate { schedule:HabitSchedule; title:string; time:string; description:string; descriptionEn:string }
export const SPIRITUAL_TEMPLATES:SpiritualTemplate[]=[
 {schedule:'fasting-mon-thu',title:'صيام الاثنين والخميس',time:'04:30',description:'الاثنين والخميس فقط؛ بقية الأيام ليست فائتة.',descriptionEn:'Monday and Thursday only; other days are never missed days.'},
 {schedule:'fasting-white',title:'صيام الأيام البيض',time:'04:30',description:'١٣ و١٤ و١٥ هجريًا وفق أم القرى، مع تصحيح محلي.',descriptionEn:'Hijri 13, 14 and 15 using Umm al-Qura, with local adjustment.'},
 {schedule:'night-prayer',title:'قيام الليل',time:'04:00',description:'اختر تذكيرًا يناسب وقت الفجر في مدينتك.',descriptionEn:'Choose a reminder that suits dawn in your city.'},
 {schedule:'morning-azkar',title:'أذكار الصباح',time:'07:00',description:'تسجيل يومي مستقل لأذكار الصباح.',descriptionEn:'A separate daily check-in for morning azkar.'},
 {schedule:'evening-azkar',title:'أذكار المساء',time:'18:00',description:'تسجيل يومي مستقل لأذكار المساء.',descriptionEn:'A separate daily check-in for evening azkar.'}
];
export const FAITH_MOTIVATION=['خطوة طيبة أضفتها إلى يومك.'];
