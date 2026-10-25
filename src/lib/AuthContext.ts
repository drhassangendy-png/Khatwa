import { createContext, useContext } from 'react';
import type { AuthUser } from '@/lib/auth';
export interface AuthContextValue { user: AuthUser | null; loading: boolean; signingIn: boolean; error: string | null; signInWithGoogle: () => Promise<void>; logout: () => Promise<void> }
export const AuthContext = createContext<AuthContextValue | null>(null);
export function useAuth() { const value = useContext(AuthContext); if(!value) throw new Error('Missing AuthProvider'); return value; }
