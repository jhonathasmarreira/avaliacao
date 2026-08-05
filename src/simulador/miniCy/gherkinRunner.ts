import type { LinhaLog, SandboxController } from '../types';
import { createCy, type CyRoot } from './commands';
import type { RunnerContext, ExecutarResultado } from './runner';

// Motor genérico que executa um texto em Gherkin (Dado/Quando/Então/E) contra
// um catálogo de steps conhecidos, reusando o mesmo mini-Cypress (createCy)
// usado pelo simulador de código — cada step do catálogo só chama cy.get/
// .click/.type/.should etc. por baixo dos panos. Diferente do runner.ts (que
// roda JS arbitrário), aqui o candidato não escreve código: escolhe entre um
// vocabulário fechado de frases, como um projeto real de Cucumber.

export interface StepDefinicao {
  padrao: RegExp;
  executar: (cy: CyRoot, grupos: string[]) => void;
}

const TIMEOUT_COMANDO = 4000;
const TIMEOUT_TOTAL = 20000;

const PALAVRA_CHAVE = /^(dado|quando|ent[ãa]o|e|mas)\s+/i;

export function criarExecutorGherkin(catalogo: StepDefinicao[]) {
  return async function executarQuestaoGherkin(
    sandbox: SandboxController,
    texto: string
  ): Promise<ExecutarResultado> {
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

    const linhas = texto
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith('#'));

    if (linhas.length === 0) {
      const msg = 'Nenhum passo foi escrito. Implemente o cenário com Dado/Quando/Então.';
      onLog({ tipo: 'erro', texto: msg });
      return { status: 'reprovada', log, erro: msg };
    }

    for (const linhaOriginal of linhas) {
      const corpo = linhaOriginal.replace(PALAVRA_CHAVE, '');
      const definicao = catalogo.find((s) => s.padrao.test(corpo));

      ctx.queue.push(async () => {
        ctx.onLog({ tipo: 'info', texto: linhaOriginal });
      });

      if (!definicao) {
        const msg = `Step não reconhecido: "${linhaOriginal}". Confira os steps disponíveis.`;
        ctx.queue.push(async () => {
          throw new Error(msg);
        });
        break;
      }

      const match = definicao.padrao.exec(corpo)!;
      try {
        definicao.executar(cy, match.slice(1));
      } catch (erroSincrono) {
        const msg = erroSincrono instanceof Error ? erroSincrono.message : String(erroSincrono);
        ctx.queue.push(async () => {
          throw new Error(msg);
        });
        break;
      }
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
        const msg = erro instanceof Error ? erro.message : String(erro);
        onLog({ tipo: 'erro', texto: msg });
        return { status: 'reprovada', log, erro: msg };
      }
    }

    // Não loga o veredito aqui de propósito, mesma regra do runner.ts:
    // o candidato não deve ver se passou ou não durante a prova.
    onLog({ tipo: 'info', texto: 'Execução concluída.' });
    return { status: 'aprovada', log };
  };
}
