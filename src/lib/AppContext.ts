import { createContext, useContext } from 'react';
import type { KhatwaState } from '@/hooks/useKhatwa';
import type { EntryDraft, Habit, Task } from '@/types';
export interface EditorState { kind:'habit'|'task'; item?:Habit|Task; preset?:Partial<EntryDraft> }
export interface DeleteState { kind:'habit'|'task'; id:string; title:string }
export interface AppContextValue extends KhatwaState { openEditor:(editor:EditorState)=>void; requestDelete:(entry:DeleteState)=>void; enableReminders:()=>Promise<void> }
export const AppContext=createContext<AppContextValue|null>(null);
export function useApp(){const value=useContext(AppContext);if(!value)throw new Error('Missing application provider');return value;}
