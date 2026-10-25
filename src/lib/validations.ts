import { z } from 'zod';
import { dateSchema, weeklyFieldsSchema, habitOptionsSchema } from '@/lib/dataValidation';
import { HABIT_SCHEDULES } from '@/constants/spiritual';
import { countScheduledDates } from '@/lib/habitSchedule';
import { categorySchema } from '@/lib/categories';
import { t } from '@/lib/i18n';
export const entrySchema=z.object({...weeklyFieldsSchema.shape,...habitOptionsSchema.shape,weeklyTarget:z.coerce.number().int().min(1).max(7),dailyLimit:z.coerce.number().int().min(0).max(10000),monthDay:z.coerce.number().int().min(0).max(31),title:z.string().trim().min(2,'اكتب اسمًا من حرفين على الأقل').max(80,'الحد الأقصى ٨٠ حرفًا'),time:z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/,'اختر وقتًا صحيحًا'),target:z.coerce.number().int('أدخل عددًا صحيحًا').min(1,'المدة يوم واحد على الأقل').max(3650,'الحد الأقصى ٣٦٥٠ يومًا'),category:categorySchema,schedule:z.enum(HABIT_SCHEDULES).default('daily'),hijriAdjustment:z.coerce.number().int().min(-2).max(2).default(0),date:dateSchema,startDate:dateSchema,endDate:dateSchema});
export const entrySchemaFor=(kind:'habit'|'task')=>entrySchema.superRefine((v,ctx)=>{
 const issue=(path:string,message:string)=>ctx.addIssue({code:z.ZodIssueCode.custom,path:[path],message});
 if(v.endDate<v.startDate)issue('endDate',t('النهاية يجب ألا تسبق البداية','End date must not precede start date'));
 if(kind!=='habit')return;
 if(v.mode==='prayers'&&(v.category!=='faith'||v.schedule!=='daily'))issue('schedule',t('الصلوات الخمس تستخدم تصنيف روحانيات وموعدًا يوميًا','Five daily prayers require the spiritual category and a daily schedule'));
 if(countScheduledDates(v.startDate,v.endDate,v.schedule,v.hijriAdjustment,v.target,v.weeklyDays,v.monthDay)<v.target)issue('endDate',t('مدّد الفترة لتضم جميع المواعيد المستهدفة','Extend the date range to include all target sessions'));
 if(v.schedule==='weekly'&&v.weeklyDays.length!==v.weeklyTarget)issue('weeklyDays',t('عدد الأيام المختارة يجب أن يطابق الهدف الأسبوعي','Selected weekdays must match the weekly target'));
 if(v.schedule==='weekdays'&&!v.weeklyDays.length)issue('weeklyDays',t('اختر يومًا واحدًا على الأقل','Select at least one weekday'));
 if(v.category!=='faith'&&!['daily','weekly','weekdays','monthly'].includes(v.schedule))issue('schedule',t('اختر تصنيف روحانيات لهذا الموعد','Use the spiritual category for this schedule'));
});
export const weightSchema=z.object({date:dateSchema,kg:z.coerce.number().min(10,'أدخل وزنًا بين ١٠ و٥٠٠ كغ').max(500,'أدخل وزنًا بين ١٠ و٥٠٠ كغ')});
