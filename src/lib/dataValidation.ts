import { z } from 'zod';
import { dayKey, addDays, weekKey } from '@/lib/dates';
import { HABIT_SCHEDULES } from '@/constants/spiritual';
import { DEFAULT_WEEKLY_DAYS, TRAINING_TYPES } from '@/constants/habits';
import { endDateForTarget } from '@/lib/habitSchedule';
import { categorySchema, customCategoriesSchema } from '@/lib/categories';
export const dateSchema=z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(key=>{const date=new Date(`${key}T12:00:00`);return !Number.isNaN(date.getTime())&&dayKey(date)===key;},'اختر تاريخًا صحيحًا');
export const timeSchema=z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
export const weeklyFieldsSchema=z.object({weeklyTarget:z.number().int().min(1).max(7).default(3),weeklyDays:z.array(z.number().int().min(0).max(6)).max(7).default(DEFAULT_WEEKLY_DAYS).refine(days=>new Set(days).size===days.length),trainingType:z.enum(TRAINING_TYPES).default('full-body')});
export const habitOptionsSchema=z.object({mode:z.enum(['build','quit','prayers']).default('build'),dailyLimit:z.number().int().min(0).max(10000).default(0),monthDay:z.number().int().min(0).max(31).default(15),strict:z.boolean().default(false)});
export const weightEntrySchema=z.object({date:dateSchema,kg:z.number().min(10).max(500)});
export const settingsSchema=z.object({language:z.enum(['ar','en']).default('ar'),numerals:z.enum(['arabic','latin']).default('arabic'),muted:z.boolean().default(false),location:z.object({latitude:z.number().min(-90).max(90),longitude:z.number().min(-180).max(180),timezone:z.string().max(100).refine(value=>{try{new Intl.DateTimeFormat('en',{timeZone:value});return true;}catch{return false;}})}).nullable().default(null)}).default({});
const habitSchema=z.object({
 id:z.string().min(1).max(100),title:z.string().trim().min(1).max(80),time:timeSchema,target:z.number().int().min(1).max(3650),category:categorySchema,...weeklyFieldsSchema.shape,...habitOptionsSchema.shape,
 schedule:z.enum(HABIT_SCHEDULES).default('daily'),hijriAdjustment:z.number().int().min(-2).max(2).default(0),history:z.record(dateSchema,z.enum(['done','skip','freeze','partial'])).refine(h=>Object.keys(h).length<=10000),createdAt:dateSchema,
 startDate:dateSchema.optional(),endDate:dateSchema.optional(),weights:z.array(weightEntrySchema).max(1000).default([]),
 slips:z.record(dateSchema,z.number().int().min(0).max(10000)).refine(v=>Object.keys(v).length<=10000).default({}),quitLimits:z.record(dateSchema,z.number().int().min(0).max(10000)).refine(v=>Object.keys(v).length<=10000).default({}),prayers:z.record(dateSchema,z.array(z.enum(['fajr','dhuhr','asr','maghrib','isha'])).max(5).refine(p=>new Set(p).size===p.length)).default({}),makeups:z.record(dateSchema,dateSchema).refine(v=>Object.keys(v).length<=10000).default({}),trackingFrom:dateSchema.optional(),settledThrough:dateSchema.optional()
}).transform(h=>({...h,startDate:h.startDate||h.createdAt,endDate:h.endDate||endDateForTarget(h.startDate||h.createdAt,h.target,h.schedule,h.hijriAdjustment,h.weeklyDays,h.monthDay),trackingFrom:h.trackingFrom||dayKey(),settledThrough:h.settledThrough||addDays(dayKey(),-1),weights:[...h.weights].sort((a,b)=>a.date.localeCompare(b.date))}))
 .refine(h=>h.endDate>=h.startDate)
 .refine(h=>['daily','weekly','weekdays','monthly'].includes(h.schedule)||h.category==='faith')
 .refine(h=>h.schedule!=='weekly'||h.weeklyDays.length===h.weeklyTarget)
 .refine(h=>!['weekly','weekdays'].includes(h.schedule)||h.weeklyDays.length>0)
 .refine(h=>new Set(h.weights.map(w=>weekKey(w.date))).size===h.weights.length);
const taskSchema=z.object({id:z.string().min(1).max(100),title:z.string().trim().min(1).max(80),time:timeSchema,date:dateSchema,done:z.boolean(),startDate:dateSchema.optional(),endDate:dateSchema.optional()}).transform(t=>({...t,startDate:t.startDate||t.date,endDate:t.endDate||t.date,date:t.endDate||t.date})).refine(t=>t.endDate>=t.startDate);
export const appDataSchema=z.object({habits:z.array(habitSchema).max(500),tasks:z.array(taskSchema).max(5000),dark:z.boolean(),categories:customCategoriesSchema,settings:settingsSchema})
 .refine(d=>new Set(d.habits.map(h=>h.id)).size===d.habits.length&&new Set(d.tasks.map(t=>t.id)).size===d.tasks.length)
 .refine(d=>d.habits.every(h=>!h.category.startsWith('custom:')||d.categories.some(c=>c.id===h.category)));
export const backupSchema=z.object({app:z.literal('khatwa'),version:z.union([z.literal(2),z.literal(3)]),exportedAt:z.string(),data:appDataSchema});
export function parseBackup(text:string){const value:unknown=JSON.parse(text);const wrapped=backupSchema.safeParse(value);return wrapped.success?wrapped.data.data:appDataSchema.parse(value);}
