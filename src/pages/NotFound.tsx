import { Link } from 'react-router-dom';
import { Footprints } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/i18n';
export default function NotFound(){useApp();return <div className="panel p-12 text-center"><Footprints className="text-primary mx-auto mb-4" size={40}/><h1 className="text-2xl font-bold">{t('هذه الخطوة خارج الطريق','This step is off the path')}</h1><p className="text-muted mt-3 mb-6">{t('الصفحة غير موجودة.','This page does not exist.')}</p><Link className="btn-primary" to="/">{t('العودة إلى يومي','Return to my day')}</Link></div>;}
