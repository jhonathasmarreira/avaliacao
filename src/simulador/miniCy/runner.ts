import type { LinhaLog, SandboxController, StatusQuestao } from '../types';
import { createCy } from './commands';

export interface RunnerContext {
  sandbox: SandboxController;
  queue: Array<() => Promise<void>>;
  onLog: (linha: LinhaLog) => void;
  /** Timeout de retry (get/should/ações) em ms. */
  timeoutMs: number;
}

export interface ExecutarResultado {
  status: Extract<StatusQuestao, 'aprovada' | 'reprovada'>;
  log: LinhaLog[];
  erro?: string;
}

const TIMEOUT_COMANDO = 4000;
const TIMEOUT_TOTAL = 20000;

export async function executarQuestao(sandbox: SandboxController, codigo: string): Promise<ExecutarResultado> {
  const log: LinhaLog[] = [];
  const onLog = (linha: LinhaLog) => log.push(linha);

  onLog({ tipo: 'info', texto: 'Reiniciando o app sob teste…' });
  try {
    await sandbox.reset();
  } catch {
    const msg = 'Não foi possível reiniciar o app sob teste. Tente executar novamente.';
    onLog({ tipo: 'erro', texto: msg });
    return { status: 'reprovada', log, erro: msg };
  }

  const ctx: RunnerContext = { sandbox, queue: [], onLog, timeoutMs: TIMEOUT_COMANDO };
  const cy = createCy(ctx);

  try {
    // eslint-disable-next-line no-new-func
    const executar = new Function('cy', `"use strict";\n${codigo}`);
    executar(cy);
  } catch (erroSincrono) {
    const msg = mensagemDeErro(erroSincrono);
    onLog({ tipo: 'erro', texto: msg });
    return { status: 'reprovada', log, erro: msg };
  }

  const inicio = Date.now();
  for (const tarefa of ctx.queue) {
    if (Date.now() - inicio > TIMEOUT_TOTAL) {
      const msg = 'Tempo total da questão excedido (20s).';
      onLog({ tipo: 'erro', texto: msg });
      return { status: 'reprovada', log, erro: msg };
    }
    try {
      await tarefa();
    } catch (erro) {
      const msg = mensagemDeErro(erro);
      onLog({ tipo: 'erro', texto: msg });
      return { status: 'reprovada', log, erro: msg };
    }
  }

  onLog({ tipo: 'sucesso', texto: 'Questão aprovada.' });
  return { status: 'aprovada', log };
}

function mensagemDeErro(erro: unknown): string {
  if (erro instanceof Error) return erro.message;
  return String(erro);
}
