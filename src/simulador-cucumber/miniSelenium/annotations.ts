// Java/Cucumber de verdade descobre os steps via reflection nas anotações
// @Dado/@Quando/@Então. Como aqui é JS (sem anotações reais), o candidato
// escreve a "anotação" como comentário na linha de cima do método, e esse
// parser lê o texto-fonte pra achar essa ligação — mesma ideia de
// cucumber-expressions: {string} vira um grupo de captura entre aspas,
// {int} vira um grupo de captura numérico.

export interface StepAnotado {
  palavraChave: string;
  textoAnotacao: string;
  metodo: string;
  padrao: RegExp;
}

const REGEX_ANOTACAO = /\/\/\s*@(Dado|Quando|Ent[ãa]o|E)\("([^"]*)"\)\s*\r?\n\s*(?:async\s+)?(\w+)\s*\(/g;

function paraRegex(textoAnotacao: string): RegExp {
  const escapado = textoAnotacao.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const comPlaceholders = escapado.replace(/\\\{string\\\}/g, '"([^"]*)"').replace(/\\\{int\\\}/g, '(\\d+)');
  return new RegExp(`^${comPlaceholders}$`);
}

export function extrairStepsAnotados(codigoFonte: string): StepAnotado[] {
  const resultado: StepAnotado[] = [];
  REGEX_ANOTACAO.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = REGEX_ANOTACAO.exec(codigoFonte))) {
    const [, palavraChave, textoAnotacao, metodo] = match;
    resultado.push({ palavraChave, textoAnotacao, metodo, padrao: paraRegex(textoAnotacao) });
  }
  return resultado;
}
