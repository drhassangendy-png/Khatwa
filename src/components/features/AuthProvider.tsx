import type { ReactNode } from 'react';
import { AuthContext } from '@/lib/AuthContext';
import { useAuthState } from '@/hooks/useAuthState';
interface Props { children:ReactNode }
export default function AuthProvider({children}:Props) { const auth=useAuthState(); return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>; }
