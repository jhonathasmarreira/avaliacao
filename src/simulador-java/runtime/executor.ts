import type { LinhaLog } from '../../simulador/types';
import { Saida, Throwable, __jex, criarAmbiente, instalarPrototipos } from './javaRuntime';
import { FalhaTeste, SUITES, type Contexto } from './testes';

export interface PedidoExecucao {
  numero: number;
  js: string;
  classes: string[];
}

export interface RespostaExecucao {
  status: 'aprovada' | 'reprovada';
  log: LinhaLog[];
  erro?: string;
}

const MAX_LINHAS_SAIDA = 30;
const PREFIXO = '"use strict";';

// Diferença entre a linha que o motor JS reporta no stack trace e a linha do
// fonte (new Function acrescenta um cabeçalho antes do corpo). Medido uma vez,
// com o mesmo prefixo usado no código do candidato.
const DESLOCAMENTO_LINHA = (() => {
  try {
    const pilha: string = new Function(`${PREFIXO}return new Error().stack;`)();
    const linha = linhaDaPilha(pilha, 0);
    return linha === null ? null : linha - 1;
  } catch {
    return null;
  }
})();

function linhaDaPilha(pilha: string | undefined, deslocamento: number): number | null {
  if (!pilha) return null;
  const m = /(?:<anonymous>|> Function):(\d+):\d+/.exec(pilha);
  return m ? Number(m[1]) - deslocamento : null;
}

function linhaDoErro(bruto: unknown): number | null {
  if (DESLOCAMENTO_LINHA === null) return null;
  const original = (bruto as { __original?: Error }).__original ?? bruto;
  return linhaDaPilha((original as Error)?.stack, DESLOCAMENTO_LINHA);
}

export function descreverErro(bruto: unknown): string {
  if (bruto instanceof FalhaTeste) return bruto.message;
  const e: Throwable = __jex(bruto);
  const linha = linhaDoErro(bruto);
  const naLinha = linha !== null && linha > 0 ? ` (linha ${linha})` : '';
  const original = (e as { __original?: unknown }).__original;
  // Erros de símbolo/método vêm de erros nativos do JS: só a mensagem já explica.
  const texto = original instanceof ReferenceError || (original instanceof TypeError && e.name === 'RuntimeException')
    ? (e.getMessage() ?? '')
    : `exceção lançada: ${e.toString()}`;
  return `${texto}${naLinha}`;
}

export function executarJava(pedido: PedidoExecucao): RespostaExecucao {
  instalarPrototipos();
  const log: LinhaLog[] = [];
  const saida = new Saida();
  let linhasSaida = 0;

  const descarregarSaida = () => {
    for (const linha of saida.descarregar()) {
      if (linhasSaida === MAX_LINHAS_SAIDA) log.push({ tipo: 'info', texto: 'saída: (demais linhas omitidas)' });
      if (linhasSaida++ >= MAX_LINHAS_SAIDA) continue;
      log.push({ tipo: 'info', texto: `saída: ${linha}` });
    }
  };
  const reprovar = (erro: string): RespostaExecucao => {
    descarregarSaida();
    log.push({ tipo: 'erro', texto: erro });
    return { status: 'reprovada', log, erro };
  };

  const suite = SUITES[pedido.numero];
  if (!suite) return reprovar(`Questão ${pedido.numero} sem testes configurados.`);

  const ambiente = criarAmbiente(saida);
  const nomes = Object.keys(ambiente).filter((n) => !pedido.classes.includes(n));
  const retorno = `\nreturn { ${pedido.classes.map((c) => `${JSON.stringify(c)}: ${c}`).join(', ')} };`;

  let classes: Record<string, unknown>;
  try {
    const fabrica = new Function(...nomes, PREFIXO + pedido.js + retorno);
    classes = fabrica(...nomes.map((n) => ambiente[n]));
  } catch (e) {
    return reprovar(`Erro ao carregar as classes: ${descreverErro(e)}`);
  }

  const Classe = classes[suite.classe] as (new () => Record<string, unknown>) | undefined;
  if (typeof Classe !== 'function') {
    return reprovar(`Classe '${suite.classe}' não encontrada: mantenha o nome da classe que veio no código inicial.`);
  }
  if (typeof Classe.prototype[suite.metodo] !== 'function') {
    return reprovar(`Método '${suite.metodo}' não encontrado na classe '${suite.classe}': mantenha o nome e a assinatura do código inicial.`);
  }

  const ctx: Contexto = { novo: () => new Classe() };
  for (const caso of suite.casos) {
    log.push({ tipo: 'comando', texto: caso.nome });
    try {
      caso.rodar(ctx);
    } catch (e) {
      return reprovar(descreverErro(e));
    }
    descarregarSaida();
  }

  log.push({ tipo: 'info', texto: 'Execução concluída.' });
  return { status: 'aprovada', log };
}
