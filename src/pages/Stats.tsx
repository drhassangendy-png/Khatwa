import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/i18n';
import StatCards from '@/components/features/StatCards';
import WeeklyChart from '@/components/features/WeeklyChart';
import HeatMap from '@/components/features/HeatMap';
import HabitCard from '@/components/features/HabitCard';
import EmptyState from '@/components/features/EmptyState';
export default function Stats(){const {data}=useApp();return <div className="space-y-6 page-enter"><div><h1 className="text-2xl font-bold">{t('تقدّمك، دون مقارنة','Your progress, without comparison')}</h1><p className="text-muted mt-1">{t('كل خطوة محسوبة، وكل فرصة جديدة محفوظة.','Every step counts, and every new chance matters.')}</p></div><StatCards/><HeatMap/><WeeklyChart/><section className="space-y-4"><div><h2 className="text-xl font-bold">{t('كل عاداتك ومواعيدك','All your habits and schedules')}</h2><p className="text-sm text-muted">{t('إدارة وتعديل وتعويض جميع العادات، حتى خارج أيام الاستحقاق. النقاط هي خطوات الإنجاز بعد الخصم؛ التجميد محايد، والصلوات الجزئية بلا خصم.','Manage, edit and recover all habits, including on off days. Points equal completed steps after deductions; freezes are neutral and partial prayer days have no penalty.')}</p></div><div className="grid md:grid-cols-2 gap-5">{data.habits.map(h=><HabitCard key={h.id} habit={h}/>)}</div>{!data.habits.length&&<EmptyState title={t('قصتك تبدأ بخطوة','Your story starts with a step')} description={t('أضف عادة لترى تقدمك هنا.','Add a habit to see your progress here.')}/>}</section></div>;}
