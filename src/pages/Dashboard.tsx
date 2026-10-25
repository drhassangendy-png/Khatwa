import { Plus, Quote } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/i18n';
import Hero from '@/components/features/Hero';
import StatCards from '@/components/features/StatCards';
import Timeline from '@/components/features/Timeline';
import DayProgress from '@/components/features/DayProgress';
import TasksPreview from '@/components/features/TasksPreview';
export default function Dashboard(){const {openEditor}=useApp();return <div className="page-enter space-y-6"><div className="flex justify-between gap-4 flex-wrap"><div><h2 className="font-bold text-xl">{t('يومك يبدأ بخطوة','Your day starts with a step')}</h2><p className="text-muted text-sm mt-1">{t('مساحة هادئة لعاداتك ومهامك وتقدمك.','A calm space for your habits, tasks and progress.')}</p></div><button className="btn-primary" onClick={()=>openEditor({kind:'habit'})}><Plus size={18}/>{t('عادة جديدة','New habit')}</button></div><Hero/><StatCards/><div className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-6"><Timeline/><aside className="space-y-5"><DayProgress/><TasksPreview/><section className="bg-soft rounded-2xl p-5 border border-line"><Quote size={22} className="text-primary mb-3"/><p>{t('لا تقارن خطوتك برحلة غيرك؛ قارنها بالمكان الذي كنت فيه بالأمس.','Do not compare your step with someone else’s journey. Compare it with where you were yesterday.')}</p></section></aside></div><p className="text-center text-xs text-muted">{t('خطوة، ثم خطوة… هكذا تبدأ الأشياء الجميلة.','One step, then another. This is how good things begin.')}</p></div>;}
