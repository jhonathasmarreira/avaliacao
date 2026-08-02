import { useSimuladorStore } from './store/useSimuladorStore';
import { IdentificacaoAvaliacaoPage } from './pages/IdentificacaoAvaliacaoPage';
import { SimuladorPage } from './pages/SimuladorPage';
import { RelatorioFinal } from './components/RelatorioFinal';

export function SimuladorApp() {
  const fase = useSimuladorStore((s) => s.fase);

  if (fase === 'identificacao') return <IdentificacaoAvaliacaoPage />;
  if (fase === 'finalizado') return <RelatorioFinal />;
  return <SimuladorPage />;
}
