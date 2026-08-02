import { useEffect } from 'react';
import { useSimuladorStore } from './store/useSimuladorStore';
import { IdentificacaoAvaliacaoPage } from './pages/IdentificacaoAvaliacaoPage';
import { SimuladorPage } from './pages/SimuladorPage';
import { RelatorioFinal } from './components/RelatorioFinal';

export function SimuladorApp() {
  const fase = useSimuladorStore((s) => s.fase);

  // A avaliação não é persistida (de propósito, ver useSimuladorStore): recarregar
  // ou fechar a aba no meio da prova apaga o progresso. Como não há como recuperar
  // isso depois, avisamos o navegador para pedir confirmação antes de sair.
  useEffect(() => {
    if (fase !== 'simulador') return;
    function handler(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = '';
    }
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [fase]);

  if (fase === 'identificacao') return <IdentificacaoAvaliacaoPage />;
  if (fase === 'finalizado') return <RelatorioFinal />;
  return <SimuladorPage />;
}
