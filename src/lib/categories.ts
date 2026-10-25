import { z } from 'zod';
import { CATEGORIES } from '@/constants/data';
import { t } from '@/lib/i18n';
import type { BuiltinCategory, Category, CustomCategory } from '@/types';
export const MAX_CUSTOM_CATEGORIES = 50;
export const normalizeCategoryName = (name:string) => name.normalize('NFKC').trim().replace(/\s+/g,' ');
const comparisonKey = (name:string) => normalizeCategoryName(name).toLocaleLowerCase();
export const customCategoryIdSchema = z.string().regex(/^custom:[a-zA-Z0-9-]+$/).max(100).transform(id=>id as CustomCategory['id']);
export const categorySchema = z.union([z.enum(['reading','sport','faith','learning','other']),customCategoryIdSchema]);
export const categoryNameSchema = z.object({name:z.string().transform(normalizeCategoryName).pipe(z.string().min(2,'اكتب اسمًا من حرفين على الأقل').max(40,'الحد الأقصى ٤٠ حرفًا'))});
const customCategorySchema = z.object({id:customCategoryIdSchema,name:categoryNameSchema.shape.name});
export const customCategoriesSchema = z.array(customCategorySchema).max(MAX_CUSTOM_CATEGORIES).default([])
 .refine(items=>new Set(items.map(item=>item.id)).size===items.length,'معرّفات التصنيفات مكررة')
 .refine(items=>{const names=[...Object.values(CATEGORIES),...items.map(item=>item.name)].map(comparisonKey);return new Set(names).size===names.length;},'أسماء التصنيفات مكررة');
export function categoryOptions(categories:CustomCategory[]):{id:Category; name:string}[]{
 return [...Object.entries(CATEGORIES).map(([id,name])=>({id:id as BuiltinCategory,name:t(name)})),...categories];
}
export function categoryLabel(id:Category,categories:CustomCategory[]):string{
 return categoryOptions(categories).find(item=>item.id===id)?.name||t('تصنيف مخصص');
}
export function findCategoryByName(name:string,categories:CustomCategory[]):Category|undefined{
 return [...categoryOptions(categories),...Object.entries(CATEGORIES).map(([id,label])=>({id:id as Category,name:label}))].find(item=>comparisonKey(item.name)===comparisonKey(name))?.id;
}
