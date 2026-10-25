import { useId } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Plus } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { categoryNameSchema } from '@/lib/categories';
import { t } from '@/lib/i18n';
import type { Category } from '@/types';
interface CategoryInput { name:string }
interface Props { onCreated:(category:Category)=>void; onCancel:()=>void }
export default function CategoryCreator({onCreated,onCancel}:Props){const {createCategory}=useApp(),id=useId(),{register,handleSubmit,formState:{errors,isSubmitting}}=useForm<CategoryInput>({resolver:zodResolver(categoryNameSchema),defaultValues:{name:''}});const submit=({name}:CategoryInput)=>{const category=createCategory(name);if(category)onCreated(category);};return <fieldset className="bg-soft border border-line rounded-xl p-4 space-y-3" onKeyDown={e=>{if(e.key==='Enter'&&e.target instanceof HTMLInputElement){e.preventDefault();e.stopPropagation();void handleSubmit(submit)();}}}><legend className="font-bold px-1">{t('تصنيف جديد','New category')}</legend><label htmlFor={id} className="label">{t('اسم التصنيف','Category name')}</label><input id={id} className="field" autoFocus maxLength={40} {...register('name')} aria-invalid={!!errors.name}/>{errors.name&&<p role="alert" className="text-danger text-sm flex gap-2"><AlertCircle size={16}/>{t(errors.name.message||'')}</p>}<p className="text-sm text-muted">{t('يُحفظ التصنيف مع عاداتك ونسخك الاحتياطية.','The category is saved with your habits and backups.')}</p><div className="flex flex-wrap gap-2"><button type="button" className="btn-secondary" disabled={isSubmitting} onClick={()=>void handleSubmit(submit)()}><Plus size={18}/>{t('حفظ التصنيف','Save category')}</button><button type="button" className="btn text-muted" onClick={onCancel}>{t('إلغاء','Cancel')}</button></div></fieldset>;}
