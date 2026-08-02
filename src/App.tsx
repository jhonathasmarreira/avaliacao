import { useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { IdentificacaoPage } from './pages/IdentificacaoPage';
import { AppLayout } from './components/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Lancamentos } from './pages/Lancamentos';
import type { Page } from './types';

const PAGE_TITLES: Record<Page, string> = {
  dashboard: 'Dashboard',
  lancamentos: 'Lançamentos',
};

export default function App() {
  const candidato = useAppStore((s) => s.candidato);
  const [page, setPage] = useState<Page>('dashboard');

  if (!candidato) return <IdentificacaoPage />;

  return (
    <AppLayout page={page} onNavigate={setPage} title={PAGE_TITLES[page]}>
      {page === 'dashboard' && <Dashboard onNavigate={setPage} />}
      {page === 'lancamentos' && <Lancamentos />}
    </AppLayout>
  );
}
