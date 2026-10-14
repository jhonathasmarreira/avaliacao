import type { LinhaLog } from '../simulador/types';
import { compilarJava } from './compilador/compilar';
import { ErroCompilacao } from './compilador/lexer';
import type { PedidoExecucao, RespostaExecucao } from './runtime/executor';

const TIMEOUT_EXECUCAO = 5000;

// Mensagens de SyntaxError do V8/SpiderMonkey para o que sobrar de sintaxe
// inválida depois da compilação (o compilador não valida toda a gramática).
function traduzirSintaxe(msg: string): string {
  const inesperado = /Unexpected (?:identifier|token|string|number) '?([^']*)'?/.exec(msg);
  if (inesperado) return `símbolo inesperado: '${inesperado[1]}'`;
  if (/Unexpected end of input/.test(msg)) return 'fim de arquivo inesperado';
  if (/missing \) after argument list/.test(msg)) return "')' esperado";
  if (/Invalid left-hand side in assignment/.test(msg)) return 'lado esquerdo da atribuição inválido';
  if (/has already been declared/.test(msg)) {
    const nome = /Identifier '([^']+)'/.exec(msg)?.[1];
    return `variável '${nome}' já foi declarada neste escopo`;
  }
  return msg;
}

export async function executarQuestaoJavaPleno(numero: number, codigo: string): Promise<RespostaExecucao> {
  const log: LinhaLog[] = [{ tipo: 'info', texto: 'Compilando…' }];
  const reprovar = (erro: string): RespostaExecucao => {
    log.push({ tipo: 'erro', texto: erro });
    return { status: 'reprovada', log, erro };
  };

  let pedido: PedidoExecucao;
  try {
    const { js, classes } = compilarJava(codigo);
    // Só faz o parse (não executa): pega sintaxe inválida ainda como erro de compilação.
    // eslint-disable-next-line no-new-func
    new Function(js);
    pedido = { numero, js, classes };
  } catch (e) {
    if (e instanceof ErroCompilacao) return reprovar(`Erro de compilação na linha ${e.linha}: ${e.message}`);
    if (e instanceof SyntaxError) return reprovar(`Erro de compilação: ${traduzirSintaxe(e.message)}`);
    return reprovar(`Erro de compilação: ${e instanceof Error ? e.message : String(e)}`);
  }
  log.push({ tipo: 'info', texto: 'Compilação concluída. Executando os testes…' });

  return new Promise((resolve) => {
    const worker = new Worker(new URL('./runtime/worker.ts', import.meta.url), { type: 'module' });
    const finalizar = (r: RespostaExecucao) => {
      clearTimeout(limite);
      worker.terminate();
      resolve(r);
    };
    const limite = setTimeout(() => {
      finalizar(reprovar(`Tempo limite de ${TIMEOUT_EXECUCAO / 1000}s excedido: verifique se há um laço infinito ou uma recursão sem fim.`));
    }, TIMEOUT_EXECUCAO);
    worker.onmessage = (e: MessageEvent<RespostaExecucao>) => {
      finalizar({ ...e.data, log: [...log, ...e.data.log] });
    };
    worker.onerror = (e) => {
      e.preventDefault();
      finalizar(reprovar(`Falha ao iniciar o executor Java: ${e.message || 'erro desconhecido'}. Tente executar novamente.`));
    };
    worker.postMessage(pedido);
  });
}
