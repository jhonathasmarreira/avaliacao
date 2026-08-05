import { create, type UseBoundStore, type StoreApi } from 'zustand';
import type { Candidato, Fase, Resposta, StatusQuestao, LinhaLog, Questao } from '../types';

export type EnvioStatus = 'idle' | 'enviando' | 'enviado' | 'erro';

export interface SimuladorState {
  candidato: Candidato | null;
  fase: Fase;
  questaoAtual: number;
  respostas: Record<number, Resposta>;
  envioStatus: EnvioStatus;
  envioMotivo?: string;

  identificar: (candidato: Candidato) => void;
  irPara: (numero: number) => void;
  atualizarCodigo: (numero: number, codigo: string) => void;
  marcarExecutando: (numero: number) => void;
  registrarResultado: (
    numero: number,
    resultado: { status: Extract<StatusQuestao, 'aprovada' | 'reprovada'>; log: LinhaLog[]; erro?: string }
  ) => void;
  finalizarAvaliacao: () => void;
  setEnvioStatus: (status: EnvioStatus, motivo?: string) => void;
}

// Fábrica de store usada tanto pelo simulador Cypress quanto pelo Cucumber —
// cada um chama isso com seu próprio conjunto de questões, gerando uma store
// independente (sem compartilhar estado entre os dois fluxos, que rodam em
// bundles/entry points separados). Deliberadamente sem persist: cada
// carregamento de página (link novo ou F5) deve começar a avaliação do zero,
// nunca retomar de onde parou.
export function criarSimuladorStore(questoes: Questao[]): UseBoundStore<StoreApi<SimuladorState>> {
  function respostasIniciais(): Record<number, Resposta> {
    const mapa: Record<number, Resposta> = {};
    for (const q of questoes) {
      mapa[q.numero] = { codigo: q.codigoInicial, status: 'pendente', log: [] };
    }
    return mapa;
  }

  return create<SimuladorState>()((set) => ({
    candidato: null,
    fase: 'identificacao',
    questaoAtual: 1,
    respostas: respostasIniciais(),
    envioStatus: 'idle',

    identificar: (candidato) => set({ candidato, fase: 'simulador' }),

    irPara: (numero) => set({ questaoAtual: numero }),

    atualizarCodigo: (numero, codigo) =>
      set((s) => ({ respostas: { ...s.respostas, [numero]: { ...s.respostas[numero], codigo } } })),

    marcarExecutando: (numero) =>
      set((s) => ({
        respostas: { ...s.respostas, [numero]: { ...s.respostas[numero], status: 'executando' } },
      })),

    registrarResultado: (numero, resultado) =>
      set((s) => ({
        respostas: {
          ...s.respostas,
          [numero]: {
            ...s.respostas[numero],
            status: resultado.status,
            log: resultado.log,
            erro: resultado.erro,
          },
        },
      })),

    finalizarAvaliacao: () => set({ fase: 'finalizado' }),

    setEnvioStatus: (envioStatus, envioMotivo) => set({ envioStatus, envioMotivo }),
  }));
}
