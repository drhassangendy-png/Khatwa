import { Dumbbell, Plus } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { GYM_PRESET } from '@/constants/habits';
import { t } from '@/lib/i18n';
export default function GymPreset(){const {openEditor}=useApp();return <section className="panel p-5 sm:p-6 flex flex-wrap gap-4 items-center"><Dumbbell size={32} className="text-primary"/><div className="flex-1 min-w-0"><p className="text-primary text-sm font-bold">{t('قالب جاهز · ٣ أيام أسبوعيًا','Ready preset · 3 days a week')}</p><h2 className="text-xl font-bold">{t('الچيم / الرياضة')}</h2><p className="text-muted text-sm mt-2">{t('١٠٠ جلسة، مع أيام راحة محفوظة. خصّص العضلة والوقت والأيام قبل الحفظ.','100 sessions with protected rest days. Customize training, time and weekdays before saving.')}</p></div><button className="btn-secondary" onClick={()=>openEditor({kind:'habit',preset:GYM_PRESET})}><Plus size={18}/>{t('تخصيص قالب الجيم','Customize gym preset')}</button></section>;}
