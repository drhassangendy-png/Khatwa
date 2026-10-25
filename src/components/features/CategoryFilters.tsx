import { useState } from 'react';
import { Plus, Tag } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { categoryOptions } from '@/lib/categories';
import { t } from '@/lib/i18n';
import CategoryCreator from '@/components/forms/CategoryCreator';
interface Props { category:string; onChange:(category:string)=>void }
export default function CategoryFilters({category,onChange}:Props){const {data}=useApp(),[adding,setAdding]=useState(false),options=[{id:'all',name:t('كل العادات','All habits')},...categoryOptions(data.categories)];return <section className="space-y-4"><div className="flex flex-wrap gap-3 items-center justify-between"><h2 className="text-lg font-bold flex items-center gap-2"><Tag size={18} className="text-primary"/>{t('تصنيفات العادات','Habit categories')}</h2><button type="button" className="btn-secondary" aria-expanded={adding} onClick={()=>setAdding(!adding)}><Plus size={18}/>{adding?t('إخفاء الإضافة','Hide creator'):t('إضافة تصنيف','Add category')}</button></div>{adding&&<div className="max-w-xl"><CategoryCreator onCancel={()=>setAdding(false)} onCreated={id=>{onChange(id);setAdding(false);}}/></div>}<div className="flex gap-2 flex-wrap" role="group" aria-label={t('تصفية حسب التصنيف','Filter by category')}>{options.map(item=><button type="button" className={`btn max-w-full break-words ${category===item.id?'bg-primary text-surface':'bg-surface border border-line text-muted'}`} aria-pressed={category===item.id} key={item.id} onClick={()=>onChange(item.id)}>{item.name}</button>)}</div></section>;}
