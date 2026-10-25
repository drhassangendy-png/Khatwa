import { Sprout } from 'lucide-react';
interface Props { title:string; description:string; action?:()=>void; actionLabel?:string }
export default function EmptyState({title,description,action,actionLabel}:Props){return <div className="panel p-10 text-center"><Sprout size={32} className="text-primary mx-auto mb-4"/><h3 className="font-bold text-lg">{title}</h3><p className="text-muted mt-2 text-sm">{description}</p>{action&&<button className="btn-secondary mt-5" onClick={action}>{actionLabel}</button>}</div>;}
