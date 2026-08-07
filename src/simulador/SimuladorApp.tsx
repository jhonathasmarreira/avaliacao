import { useEffect, useRef, useState, type ReactNode } from 'react';
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

  // Além do beforeunload (que só pega fechar/recarregar), avisa também quando o
  // candidato troca de aba/janela ou minimiza o navegador durante a prova — não dá
  // pra bloquear isso, então o aviso aparece só quando ele volta pra essa aba.
  const [ausencias, setAusencias] = useState(0);
  const [avisoAusenciaVisivel, setAvisoAusenciaVisivel] = useState(false);
  const estavaOcultoRef = useRef(false);

  useEffect(() => {
    if (fase !== 'simulador') return;
    function handleVisibilityChange() {
      if (document.hidden) {
        estavaOcultoRef.current = true;
        return;
      }
      if (!estavaOcultoRef.current) return;
      estavaOcultoRef.current = false;
      setAusencias((n) => n + 1);
      setAvisoAusenciaVisivel(true);
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [fase]);

  return (
    <>
      {fase === 'simulador' && avisoAusenciaVisivel && (
        <div data-testid="aviso-ausencia" className="aviso-ausencia" role="alert">
          <span>
            ⚠ Você saiu da aba ou janela da avaliação{ausencias > 1 ? ` (${ausencias}x)` : ''}. Evite trocar de
            aba ou minimizar o navegador até terminar a prova.
          </span>
          <button
            data-testid="btn-fechar-aviso-ausencia"
            className="aviso-ausencia-fechar"
            onClick={() => setAvisoAusenciaVisivel(false)}
            aria-label="Fechar aviso"
          >
            ✕
          </button>
        </div>
      )}

      {fase === 'identificacao' && (
        <IdentificacaoAvaliacaoPage useStore={useStore} logo={logo} titulo={titulo} descricao={descricao} />
      )}
      {fase === 'finalizado' && <RelatorioFinal useStore={useStore} questoes={questoes} nomeProva={nomeProva} />}
      {fase === 'simulador' && children}
    </>
  );
}
