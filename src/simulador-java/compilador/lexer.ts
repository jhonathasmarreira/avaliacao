export type TipoToken = 'ws' | 'comentario' | 'ident' | 'numero' | 'string' | 'char' | 'op';

export interface Token {
  tipo: TipoToken;
  v: string;
  linha: number;
}

export class ErroCompilacao extends Error {
  linha: number;
  constructor(linha: number, mensagem: string) {
    super(mensagem);
    this.linha = linha;
  }
}

// '>' fica sempre sozinho (nunca '>>' ou '>>>'): assim o fechamento de
// genéricos aninhados (List<List<String>>) não vira um operador de shift. O
// texto emitido continua o mesmo, então '>' '>' volta a ser '>>' no JS.
const OPERADORES = [
  '<<=', '...', '->', '::', '++', '--', '&&', '||', '==', '!=', '<=', '>=',
  '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<',
];
const PONTUACAO = new Set('{}()[];,.=<>!~?:+-*/&|^%@'.split(''));

const RE_IDENT = /[\p{L}_$][\p{L}\p{N}_$]*/uy;
const RE_HEX = /0[xX][0-9a-fA-F_]+[lL]?/y;
const RE_NUMERO = /(?:\d[\d_]*(?:\.[\d_]*)?|\.\d[\d_]*)(?:[eE][+-]?\d+)?[fFdDlL]?/y;

export function tokenizar(fonte: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  let linha = 1;
  const n = fonte.length;

  function empilhar(tipo: TipoToken, inicio: number, linhaInicio: number) {
    tokens.push({ tipo, v: fonte.slice(inicio, i), linha: linhaInicio });
  }

  function casar(re: RegExp): string | null {
    re.lastIndex = i;
    const m = re.exec(fonte);
    return m ? m[0] : null;
  }

  while (i < n) {
    const c = fonte[i];
    const inicio = i;
    const linhaInicio = linha;

    if (/\s/.test(c)) {
      while (i < n && /\s/.test(fonte[i])) {
        if (fonte[i] === '\n') linha++;
        i++;
      }
      empilhar('ws', inicio, linhaInicio);
      continue;
    }

    if (c === '/' && fonte[i + 1] === '/') {
      while (i < n && fonte[i] !== '\n') i++;
      empilhar('comentario', inicio, linhaInicio);
      continue;
    }

    if (c === '/' && fonte[i + 1] === '*') {
      const fim = fonte.indexOf('*/', i + 2);
      if (fim < 0) throw new ErroCompilacao(linha, 'comentário /* não foi fechado com */');
      for (let k = i; k < fim; k++) if (fonte[k] === '\n') linha++;
      i = fim + 2;
      empilhar('comentario', inicio, linhaInicio);
      continue;
    }

    if (c === '"') {
      if (fonte.startsWith('"""', i)) {
        throw new ErroCompilacao(linha, 'text blocks (""") não são suportados neste simulador');
      }
      i++;
      while (i < n && fonte[i] !== '"') {
        if (fonte[i] === '\\') i++;
        if (i >= n || fonte[i] === '\n') {
          throw new ErroCompilacao(linhaInicio, 'string não foi fechada: falta o " de fechamento');
        }
        i++;
      }
      if (i >= n) throw new ErroCompilacao(linhaInicio, 'string não foi fechada: falta o " de fechamento');
      i++;
      empilhar('string', inicio, linhaInicio);
      continue;
    }

    if (c === "'") {
      i++;
      if (fonte[i] === '\\') i += 2;
      else i++;
      if (fonte[i] !== "'") throw new ErroCompilacao(linha, "literal de caractere inválido: use aspas simples só para um caractere, ex: 'a'");
      i++;
      empilhar('char', inicio, linhaInicio);
      continue;
    }

    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(fonte[i + 1] ?? ''))) {
      const texto = casar(RE_HEX) ?? casar(RE_NUMERO);
      i += texto ? texto.length : 1;
      empilhar('numero', inicio, linhaInicio);
      continue;
    }

    const ident = casar(RE_IDENT);
    if (ident) {
      i += ident.length;
      empilhar('ident', inicio, linhaInicio);
      continue;
    }

    const op = OPERADORES.find((o) => fonte.startsWith(o, i));
    if (op) {
      i += op.length;
      empilhar('op', inicio, linhaInicio);
      continue;
    }

    if (PONTUACAO.has(c)) {
      i++;
      empilhar('op', inicio, linhaInicio);
      continue;
    }

    throw new ErroCompilacao(linha, `caractere inesperado: '${c}'`);
  }

  return tokens;
}
