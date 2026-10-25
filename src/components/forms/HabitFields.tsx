import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';
import CategoryField from '@/components/forms/CategoryField';
import { t } from '@/lib/i18n';
import type { Category, EntryDraft } from '@/types';
interface Props { sessionTarget:boolean; register:UseFormRegister<EntryDraft>; errors:FieldErrors<EntryDraft>; onTargetChange:(target:number)=>void; onCategoryChange:(category:Category)=>void; onCategoryCreated:(category:Category)=>void }
export default function HabitFields({register,errors,onTargetChange,onCategoryChange,onCategoryCreated,sessionTarget}:Props){return <div className="grid sm:grid-cols-2 gap-4"><CategoryField register={register} errors={errors} onChange={onCategoryChange} onCreated={onCategoryCreated}/><div><label htmlFor="target" className="label">{sessionTarget?t('إجمالي الجلسات المستهدفة','Total session target'):t('إجمالي الأيام المستهدفة','Total successful-day target')}</label><input id="target" type="number" min="1" max="3650" className="field" {...register('target',{onChange:e=>onTargetChange(Number(e.target.value))})} aria-invalid={!!errors.target}/>{errors.target&&<p className="text-sm text-danger flex items-center gap-1 mt-1"><AlertCircle size={14}/>{t(errors.target.message||'')}</p>}</div></div>;}
