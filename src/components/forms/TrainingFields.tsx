import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { TRAINING_LABELS } from '@/constants/habits';
import { t } from '@/lib/i18n';
import type { EntryDraft } from '@/types';
interface Props { register:UseFormRegister<EntryDraft>; errors:FieldErrors<EntryDraft> }
export default function TrainingFields({register,errors}:Props){return <div><label htmlFor="trainingType" className="label">{t('نوع التدريب','Training type')}</label><select id="trainingType" className="field" {...register('trainingType')} aria-invalid={!!errors.trainingType}>{Object.entries(TRAINING_LABELS).map(([value,label])=><option key={value} value={value}>{t(label)}</option>)}</select></div>;}
