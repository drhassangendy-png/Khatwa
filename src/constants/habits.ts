import type { EntryDraft, TrainingType } from '@/types';
export const DEFAULT_WEEKLY_DAYS = [1, 3, 5];
export const WEEK_DAYS = [{value:1,label:'الاثنين'}, {value:2,label:'الثلاثاء'}, {value:3,label:'الأربعاء'}, {value:4,label:'الخميس'}, {value:5,label:'الجمعة'}, {value:6,label:'السبت'}, {value:0,label:'الأحد'}];
export const TRAINING_TYPES = ['full-body','chest','back','legs','shoulders','arms','cardio','other'] as const;
export const TRAINING_LABELS: Record<TrainingType,string> = {'full-body':'الجسم كاملًا / برنامج متنوع',chest:'الصدر (Chest)',back:'الظهر (Back)',legs:'الأرجل (Legs)',shoulders:'الأكتاف (Shoulders)',arms:'الذراعان (Arms)',cardio:'الكارديو (Cardio)',other:'تمرين آخر'};
export const GYM_PRESET: Partial<EntryDraft> = {title:'الچيم / الرياضة',category:'sport',schedule:'weekly',weeklyTarget:3,weeklyDays:DEFAULT_WEEKLY_DAYS,trainingType:'full-body',target:100,time:'18:00'};
