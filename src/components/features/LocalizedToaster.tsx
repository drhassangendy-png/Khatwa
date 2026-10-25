import { Toaster } from 'sonner';
import { useApp } from '@/lib/AppContext';
export default function LocalizedToaster(){const {data}=useApp();return <Toaster position="top-center" dir={data.settings.language==='ar'?'rtl':'ltr'} toastOptions={{style:{fontFamily:'Tajawal, sans-serif',background:'hsl(var(--surface))',color:'hsl(var(--foreground))',border:'1px solid hsl(var(--line))'}}}/>;}
