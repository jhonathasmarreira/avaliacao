import type { LinhaLog, SandboxController } from '../../simulador/types';
import { criarDriver, By } from './driver';
import { Assert } from './assert';
import { extrairStepsAnotados } from './annotations';

// Motor que executa o par Page+Steps (estilo Java/Cucumber/Selenium) escrito
// pelo candidato contra o texto da feature (Dado/Quando/Então/E, já dado na
// questão). Diferente do simulador Cypress (que roda tudo de uma vez e só
// drena a fila no final), aqui cada linha da feature é despachada e drenada
// por completo antes de ir pra próxima — necessário porque um método pode
// ser `async` e usar `await` pra ler um valor real da tela no meio do
// caminho (getText/isDisplayed), o que exige que as ações anteriores já
// tenham realmente acontecido no DOM nesse ponto.

export interface RunnerContext {
  sandbox: SandboxController;
  queue: Array<() => Promise<void>>;
  onLog: (linha: LinhaLog) => void;
  timeoutMs: number;
}

export interface ExecutarResultado {
  status: 'aprovada' | 'reprovada';
  log: LinhaLog[];
  erro?: string;
}

const TIMEOUT_COMANDO = 4000;
const TIMEOUT_TOTAL = 20000;

const PALAVRA_CHAVE_FEATURE = /^(dado|quando|ent[ãa]o|e|mas)\s+/i;

function mensagemDeErro(erro: unknown): string {
  return erro instanceof Error ? erro.message : String(erro);
}

export async function executarQuestaoJava(
  sandbox: SandboxController,
  featureLinhas: string[],
  codigoFonte: string
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
  const driver = criarDriver(ctx);

  let stepsInstancia: Record<string, (...args: string[]) => unknown>;
  try {
    // eslint-disable-next-line no-new-func
    const construir = new Function(
      'driver',
      'By',
      'Assert',
      `"use strict";\n${codigoFonte}\nreturn new Steps(driver);`
    );
    stepsInstancia = construir(driver, By, Assert);
  } catch (erroSincrono) {
    const msg = mensagemDeErro(erroSincrono);
    onLog({ tipo: 'erro', texto: msg });
    return { status: 'reprovada', log, erro: msg };
  }

  const stepsAnotados = extrairStepsAnotados(codigoFonte);
  const inicio = Date.now();

  async function drenar(): Promise<string | null> {
    while (ctx.queue.length > 0) {
      if (Date.now() - inicio > TIMEOUT_TOTAL) return 'Tempo total da questão excedido (20s).';
      const tarefa = ctx.queue.shift()!;
      try {
        await tarefa();
      } catch (erro) {
        return mensagemDeErro(erro);
      }
    }
    return null;
  }

  for (const linhaFeature of featureLinhas) {
    const corpo = linhaFeature.replace(PALAVRA_CHAVE_FEATURE, '');
    const definicao = stepsAnotados.find((s) => s.padrao.test(corpo));

    ctx.queue.push(async () => {
      ctx.onLog({ tipo: 'info', texto: linhaFeature });
    });

    if (!definicao) {
      const msg = `Nenhum método @Dado/@Quando/@Então/@E encontrado para: "${linhaFeature}".`;
      ctx.queue.push(async () => {
        throw new Error(msg);
      });
      const erro = (await drenar()) ?? msg;
      onLog({ tipo: 'erro', texto: erro });
      return { status: 'reprovada', log, erro };
    }

    const match = definicao.padrao.exec(corpo)!;
    const args = match.slice(1);
    const metodo = stepsInstancia[definicao.metodo];
    if (typeof metodo !== 'function') {
      const msg = `Método "${definicao.metodo}" não existe na classe Steps.`;
      ctx.queue.push(async () => {
        throw new Error(msg);
      });
      const erro = (await drenar()) ?? msg;
      onLog({ tipo: 'erro', texto: erro });
      return { status: 'reprovada', log, erro };
    }

    ctx.queue.push(async () => {
      await metodo.apply(stepsInstancia, args);
    });

    const erro = await drenar();
    if (erro) {
      onLog({ tipo: 'erro', texto: erro });
      return { status: 'reprovada', log, erro };
    }
  }

  // Não loga o veredito aqui de propósito, mesma regra dos outros motores:
  // o candidato não deve ver se passou ou não durante a prova.
  onLog({ tipo: 'info', texto: 'Execução concluída.' });
  return { status: 'aprovada', log };
}
