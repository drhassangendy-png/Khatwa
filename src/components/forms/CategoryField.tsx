import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { useApp } from '@/lib/AppContext';
import { categoryOptions } from '@/lib/categories';
import { t } from '@/lib/i18n';
import CategoryCreator from '@/components/forms/CategoryCreator';
import type { Category, EntryDraft } from '@/types';
interface Props { register:UseFormRegister<EntryDraft>; errors:FieldErrors<EntryDraft>; onChange:(category:Category)=>void; onCreated:(category:Category)=>void }
export default function CategoryField({register,errors,onChange,onCreated}:Props){const {data}=useApp(),[adding,setAdding]=useState(false);return <div className="space-y-3"><label htmlFor="category" className="label">{t('التصنيف','Category')}</label><select id="category" className="field" {...register('category',{onChange:e=>onChange(e.target.value as Category)})} aria-invalid={!!errors.category}>{categoryOptions(data.categories).map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</select>{errors.category&&<p role="alert" className="text-danger text-sm">{t('اختر تصنيفًا صحيحًا','Choose a valid category')}</p>}<button type="button" className="btn text-primary px-0" aria-expanded={adding} onClick={()=>setAdding(!adding)}><Plus size={16}/>{adding?t('إخفاء الإضافة','Hide category creator'):t('إضافة تصنيف جديد','Add a category')}</button>{adding&&<CategoryCreator onCancel={()=>setAdding(false)} onCreated={category=>{onCreated(category);setAdding(false);}}/>}</div>;}
