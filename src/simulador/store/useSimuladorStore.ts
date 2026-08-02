import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Candidato, Fase, Resposta, StatusQuestao, LinhaLog } from '../types';
import { QUESTOES } from '../questoes';

export type EnvioStatus = 'idle' | 'enviando' | 'enviado' | 'erro';

function respostasIniciais(): Record<number, Resposta> {
  const mapa: Record<number, Resposta> = {};
  for (const q of QUESTOES) {
    mapa[q.numero] = { codigo: q.codigoInicial, status: 'pendente', log: [] };
  }
  return mapa;
}

interface SimuladorState {
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

export const useSimuladorStore = create<SimuladorState>()(
  persist(
    (set) => ({
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
    }),
    { name: 'simulador-avaliacao-v1' }
  )
);
