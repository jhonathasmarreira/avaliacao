import { useEffect, type ReactNode } from 'react';
import type { UseBoundStore, StoreApi } from 'zustand';
import type { SimuladorState } from './store/criarSimuladorStore';
import type { Questao } from './types';
import { IdentificacaoAvaliacaoPage } from './pages/IdentificacaoAvaliacaoPage';
import { RelatorioFinal } from './components/RelatorioFinal';

interface Props {
  useStore: UseBoundStore<StoreApi<SimuladorState>>;
  questoes: Questao[];
  nomeProva: string;
  logo: string;
  titulo: string;
  descricao: string;
  /** Página do meio (fase "simulador"), diferente para cada motor (Cypress vs Cucumber). */
  children: ReactNode;
}

// Casca compartilhada entre o simulador Cypress e o Cucumber: cuida das 3
// fases (identificação -> simulador -> relatório final) e do aviso de
// beforeunload. A fase "simulador" em si é passada via children porque cada
// motor tem uma tela bem diferente (editor de código vs editor de Gherkin).
export function SimuladorApp({ useStore, questoes, nomeProva, logo, titulo, descricao, children }: Props) {
  const fase = useStore((s) => s.fase);

  // A avaliação não é persistida (de propósito, ver criarSimuladorStore): recarregar
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

  if (fase === 'identificacao') {
    return <IdentificacaoAvaliacaoPage useStore={useStore} logo={logo} titulo={titulo} descricao={descricao} />;
  }
  if (fase === 'finalizado') {
    return <RelatorioFinal useStore={useStore} questoes={questoes} nomeProva={nomeProva} />;
  }
  return <>{children}</>;
}
