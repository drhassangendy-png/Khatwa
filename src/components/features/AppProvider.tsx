import { useState, type ReactNode } from 'react';
import { useKhatwa } from '@/hooks/useKhatwa';
import { useReminders } from '@/hooks/useReminders';
import { AppContext, type EditorState, type DeleteState } from '@/lib/AppContext';
import { t } from '@/lib/i18n';
import Modal from '@/components/features/Modal';
import EntryForm from '@/components/forms/EntryForm';
import Confetti from '@/components/features/Confetti';
interface Props { children:ReactNode }
export default function AppProvider({children}:Props){const app=useKhatwa(),enableReminders=useReminders(app.data),[editor,setEditor]=useState<EditorState|null>(null),[deleting,setDeleting]=useState<DeleteState|null>(null);return <AppContext.Provider value={{...app,enableReminders,openEditor:setEditor,requestDelete:setDeleting}}>{children}<Confetti trigger={app.celebrate}/>{editor&&<Modal title={editor.item?t('تعديل خطوة','Edit a step'):editor.kind==='habit'?t('إضافة عادة','Add a habit'):t('إضافة مهمة','Add a task')} onClose={()=>setEditor(null)}><EntryForm editor={editor} onClose={()=>setEditor(null)}/></Modal>}{deleting&&<Modal title={t('حذف هذه الخطوة؟','Delete this step?')} onClose={()=>setDeleting(null)}><div className="p-6"><p>{t('هل تريد حذف','Delete')} «{deleting.title}»?</p><p className="text-muted text-sm mt-2">{t('سيُحذف سجلها من هذا الجهاز. صدّر نسخة إذا أردت الاحتفاظ بها.','Its history will be removed from this device. Export a backup to keep it.')}</p><div className="flex gap-3 mt-6"><button className="btn bg-danger text-surface" onClick={()=>{app.remove(deleting.kind,deleting.id);setDeleting(null);}}>{t('نعم، حذف','Yes, delete')}</button><button className="btn-secondary" onClick={()=>setDeleting(null)}>{t('الاحتفاظ بها','Keep it')}</button></div></div></Modal>}</AppContext.Provider>;}
