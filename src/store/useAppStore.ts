import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Candidato, Transaction } from '../types';
import { uid } from '../utils/uuid';

interface AppState {
  candidato: Candidato | null;
  transactions: Transaction[];
  identificar: (candidato: Candidato) => void;
  sair: () => void;
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, t: Omit<Transaction, 'id'>) => void;
  removeTransaction: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      candidato: null,
      transactions: [],

      identificar: (candidato) => set({ candidato }),

      sair: () => set({ candidato: null }),

      addTransaction: (t) =>
        set((s) => ({ transactions: [...s.transactions, { ...t, id: uid() }] })),

      updateTransaction: (id, t) =>
        set((s) => ({
          transactions: s.transactions.map((x) => (x.id === id ? { ...t, id } : x)),
        })),

      removeTransaction: (id) =>
        set((s) => ({ transactions: s.transactions.filter((x) => x.id !== id) })),
    }),
    { name: 'avaliacao-storage' }
  )
);
