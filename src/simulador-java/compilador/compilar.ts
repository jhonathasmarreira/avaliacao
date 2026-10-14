import { ErroCompilacao, tokenizar, type Token } from './lexer';

// Compilador de um subconjunto de Java para JavaScript. Não faz checagem de
// tipos: o objetivo é aceitar o Java que um dev pleno escreve no dia a dia
// (classes, coleções, streams, lambdas, exceções) e transformá-lo em JS que
// roda contra o runtime de ../runtime/javaRuntime.ts. Recursos fora do
// subconjunto viram erro de compilação explícito, em vez de um erro confuso
// de JavaScript na hora de executar.
//
// A saída preserva as quebras de linha do fonte, para que erros de execução
// apontem a mesma linha que o candidato vê no editor.

export interface ResultadoCompilacao {
  js: string;
  classes: string[];
}

const MODIFICADORES = new Set([
  'public', 'private', 'protected', 'static', 'final', 'abstract', 'synchronized',
  'native', 'transient', 'volatile', 'strictfp', 'default', 'sealed',
]);
const PRIMITIVOS = new Set(['int', 'long', 'short', 'byte', 'double', 'float', 'boolean', 'char', 'void']);
const INTEIROS = new Set(['int', 'long', 'short', 'byte', 'Integer', 'Long', 'Short', 'Byte']);
const PALAVRAS_RESERVADAS = new Set([
  'return', 'throw', 'new', 'case', 'default', 'else', 'break', 'continue', 'this', 'super',
  'if', 'for', 'while', 'do', 'switch', 'try', 'catch', 'finally', 'assert', 'instanceof',
  'null', 'true', 'false', 'class', 'interface', 'enum', 'import', 'package', 'throws',
  'extends', 'implements', 'goto', 'const',
  ...MODIFICADORES,
]);
const VALORES = new Set(['this', 'super', 'null', 'true', 'false']);
// Válidos como nome de variável em Java, mas reservados em JavaScript.
const RESERVADOS_JS = new Set([
  'function', 'delete', 'in', 'typeof', 'with', 'let', 'await', 'export', 'debugger',
  'arguments', 'eval', 'undefined', 'NaN', 'Infinity', 'yield',
]);
const METODOS_INTEIROS = new Set(['size', 'length', 'indexOf', 'lastIndexOf', 'intValue', 'longValue', 'compareTo', 'ordinal', 'count']);
const CABECALHOS = new Set(['if', 'for', 'while', 'switch', 'catch', 'synchronized']);
// Métodos Java cujo nome já existe no JS com outro comportamento (String.replace
// do JS troca só a primeira ocorrência; Function.apply recebe thisArg). As
// chamadas e as declarações usam o nome renomeado, implementado no runtime.
const RENOMEAR_METODOS: Record<string, string> = {
  replace: '__jreplace',
  replaceAll: '__jreplaceAll',
  split: '__jsplit',
  apply: '__japply',
};
const renomeado = (nome: string) => Object.hasOwn(RENOMEAR_METODOS, nome);
const nomeMetodo = (nome: string) => (renomeado(nome) ? RENOMEAR_METODOS[nome] : nome);

interface Membro {
  estatico: boolean;
  tipo: string;
}

interface Classe {
  nome: string;
  pai?: string;
  campos: Map<string, Membro>;
  metodos: Map<string, Membro>;
  temConstrutor: boolean;
}

interface Corpo {
  ini: number;
  fim: number;
  classe: Classe;
  locais: Map<string, string>;
  retorno?: string;
  /** true quando o trecho é uma expressão solta (inicializador de campo), não um bloco. */
  expressao: boolean;
}

interface Abertura {
  txt: string;
  fim: number;
  seq: number;
}

export function compilarJava(fonte: string): ResultadoCompilacao {
  return new Compilador(fonte).compilar();
}

class Compilador {
  private toks: Token[];
  private S: number[] = [];
  private out: string[];
  private aberturas: Abertura[][];
  private pre: string[];
  private suf: string[];
  private par: number[] = [];
  private seq = 0;
  private classes = new Map<string, Classe>();
  private ordemClasses: string[] = [];
  private corpos: Corpo[] = [];

  constructor(fonte: string) {
    this.toks = tokenizar(fonte);
    this.toks.forEach((t, i) => {
      if (t.tipo !== 'ws' && t.tipo !== 'comentario') this.S.push(i);
    });
    this.out = this.toks.map((t) => t.v);
    this.aberturas = this.toks.map(() => []);
    this.pre = this.toks.map(() => '');
    this.suf = this.toks.map(() => '');
  }

  compilar(): ResultadoCompilacao {
    this.casarDelimitadores();
    this.normalizarLiterais();
    this.lerNivelSuperior();
    if (this.ordemClasses.length === 0) {
      throw new ErroCompilacao(1, 'nenhuma classe encontrada: declare ao menos uma classe (ex: public class Exemplo { ... })');
    }
    this.resolverHeranca();
    for (const corpo of this.corpos) {
      if (!corpo.expressao) this.verificarPontoEVirgula(corpo);
      this.transformarCorpo(corpo);
    }
    const js = this.toks
      .map((_, i) => {
        // Quem fecha mais longe fica por fora; no empate, quem abriu antes fica por fora.
        const abre = [...this.aberturas[i]]
          .sort((a, b) => b.fim - a.fim || a.seq - b.seq)
          .map((a) => a.txt)
          .join('');
        return abre + this.pre[i] + this.out[i] + this.suf[i];
      })
      .join('');
    return { js, classes: [...this.ordemClasses] };
  }

  // ── Acesso aos tokens significativos ─────────────────────────────────
  private V(k: number): string {
    const i = this.S[k];
    return i === undefined ? '' : this.toks[i].v;
  }
  private T(k: number): Token | undefined {
    const i = this.S[k];
    return i === undefined ? undefined : this.toks[i];
  }
  private saida(k: number): string {
    return this.out[this.S[k]];
  }
  private linha(k: number): number {
    return this.T(k)?.linha ?? this.toks[this.toks.length - 1]?.linha ?? 1;
  }
  private ehIdent(k: number): boolean {
    return this.T(k)?.tipo === 'ident';
  }
  private erro(k: number, msg: string): never {
    throw new ErroCompilacao(this.linha(k), msg);
  }
  private texto(k1: number, k2: number): string {
    let s = '';
    for (let k = k1; k <= k2; k++) s += this.V(k);
    return s;
  }
  private set(k: number, txt: string) {
    this.out[this.S[k]] = txt;
  }
  /** Apaga os tokens significativos k1..k2, preservando as quebras de linha. */
  private apagar(k1: number, k2: number) {
    if (k2 < k1) return;
    for (let i = this.S[k1]; i <= this.S[k2]; i++) {
      const t = this.toks[i];
      this.out[i] = t.tipo === 'ws' || t.tipo === 'comentario' ? t.v.replace(/[^\n]/g, '') : '';
    }
  }
  /** Envolve os tokens k..fim: `txt` antes de k e `fecha` depois de fim. */
  private envolver(k: number, fim: number, txt: string, fecha = ')') {
    this.aberturas[this.S[k]].push({ txt, fim, seq: this.seq++ });
    this.suf[this.S[fim]] += fecha;
  }
  private prefixar(k: number, txt: string) {
    this.aberturas[this.S[k]].push({ txt, fim: Number.MAX_SAFE_INTEGER, seq: -1 });
  }
  private quebraEntre(k1: number, k2: number): boolean {
    for (let i = this.S[k1] + 1; i < this.S[k2]; i++) if (this.toks[i].v.includes('\n')) return true;
    return false;
  }

  // ── Pré-processamento ────────────────────────────────────────────────
  private casarDelimitadores() {
    const pilha: number[] = [];
    const abertura: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
    const fechamento: Record<string, string> = { '(': ')', '[': ']', '{': '}' };
    for (let k = 0; k < this.S.length; k++) {
      const v = this.V(k);
      if (this.T(k)!.tipo !== 'op') continue;
      if (v in fechamento) pilha.push(k);
      else if (v in abertura) {
        const topo = pilha.pop();
        if (topo === undefined) this.erro(k, `'${v}' sem a abertura correspondente`);
        if (this.V(topo) !== abertura[v]) this.erro(k, `'${fechamento[this.V(topo)]}' esperado antes de '${v}'`);
        this.par[k] = topo;
        this.par[topo] = k;
      }
    }
    if (pilha.length > 0) {
      const k = pilha[pilha.length - 1];
      throw new ErroCompilacao(
        this.linha(this.S.length - 1),
        `fim de arquivo inesperado: falta '${fechamento[this.V(k)]}' (aberto na linha ${this.linha(k)})`
      );
    }
  }

  private normalizarLiterais() {
    for (let k = 0; k < this.S.length; k++) {
      const t = this.T(k)!;
      if (t.tipo === 'numero') {
        let v = t.v.replace(/_/g, '');
        v = /^0[xX]/.test(v) ? v.replace(/[lL]$/, '') : v.replace(/[fFdDlL]$/, '');
        if (v.endsWith('.')) v += '0';
        this.set(k, v);
      } else if (t.tipo === 'ident' && RESERVADOS_JS.has(t.v) && this.V(k - 1) !== '.') {
        this.set(k, `$${t.v}`);
      }
    }
  }

  // ── Estrutura: classes, enums e membros ──────────────────────────────
  private lerNivelSuperior() {
    let k = 0;
    while (k < this.S.length) {
      const v = this.V(k);
      if (v === 'package' || v === 'import') {
        const fim = this.procurar(k, ';');
        this.apagar(k, fim);
        k = fim + 1;
      } else if (v === '@') {
        k = this.pularAnotacao(k);
      } else if (MODIFICADORES.has(v)) {
        this.apagar(k, k);
        k++;
      } else if (v === 'class' || v === 'interface') {
        k = this.lerClasse(k);
      } else if (v === 'enum') {
        k = this.lerEnum(k);
      } else if (v === 'record') {
        this.erro(k, 'records não são suportados neste simulador: use uma classe com campos e getters');
      } else if (v === ';') {
        k++;
      } else {
        this.erro(k, `declaração de classe esperada, encontrado '${v}'`);
      }
    }
  }

  private procurar(k: number, alvo: string): number {
    for (let j = k; j < this.S.length; j++) if (this.V(j) === alvo) return j;
    this.erro(k, `'${alvo}' esperado`);
  }

  private pularAnotacao(k: number): number {
    let j = k + 1;
    if (!this.ehIdent(j)) this.erro(k, 'nome de anotação esperado depois de @');
    j++;
    while (this.V(j) === '.' && this.ehIdent(j + 1)) j += 2;
    if (this.V(j) === '(') j = this.par[j] + 1;
    this.apagar(k, j - 1);
    return j;
  }

  /** Índice logo depois de '<...>' começando em k, ou -1 se não for um genérico. */
  private fimAngulo(k: number): number {
    let prof = 0;
    for (let j = k; j < this.S.length; j++) {
      const v = this.V(j);
      if (v === '<') prof++;
      else if (v === '>') {
        prof--;
        if (prof === 0) return j + 1;
      } else if (!(this.ehIdent(j) || v === ',' || v === '.' || v === '?' || v === '[' || v === ']' || v === '&')) {
        return -1;
      }
    }
    return -1;
  }

  private fimNomeTipo(k: number): number {
    let j = k;
    while (this.V(j + 1) === '.' && this.ehIdent(j + 2)) j += 2;
    return j;
  }

  /** Índice logo depois de um tipo começando em k (ex: Map<String, List<X>>[]), ou -1. */
  private fimTipo(k: number): number {
    const v = this.V(k);
    if (!this.ehIdent(k)) return -1;
    if (PALAVRAS_RESERVADAS.has(v) && !PRIMITIVOS.has(v)) return -1;
    let j = this.fimNomeTipo(k) + 1;
    if (this.V(j) === '<') {
      const f = this.fimAngulo(j);
      if (f < 0) return -1;
      j = f;
    }
    while (this.V(j) === '[' && this.V(j + 1) === ']') j += 2;
    return j;
  }

  private lerClasse(k: number): number {
    const ehInterface = this.V(k) === 'interface';
    if (!this.ehIdent(k + 1)) this.erro(k, 'nome da classe esperado');
    const nome = this.V(k + 1);
    if (this.classes.has(nome)) this.erro(k + 1, `classe '${nome}' declarada mais de uma vez`);
    this.set(k, 'class');
    let j = k + 2;
    let pai: string | undefined;
    while (this.V(j) !== '{') {
      if (j >= this.S.length || this.V(j) === ';') this.erro(k, `'{' esperado na declaração da classe '${nome}'`);
      if (this.V(j) === 'extends' && !ehInterface) pai = this.V(j + 1);
      j++;
    }
    this.apagar(k + 2, j - 1);
    if (pai) this.suf[this.S[k + 1]] += ` extends ${pai}`;

    const classe: Classe = { nome, pai, campos: new Map(), metodos: new Map(), temConstrutor: false };
    this.classes.set(nome, classe);
    this.ordemClasses.push(nome);
    this.lerCorpoClasse(j, this.par[j], classe, ehInterface);
    return this.par[j] + 1;
  }

  private lerEnum(k: number): number {
    if (!this.ehIdent(k + 1)) this.erro(k, 'nome do enum esperado');
    const nome = this.V(k + 1);
    let a = k + 2;
    while (this.V(a) !== '{') {
      if (a >= this.S.length || this.V(a) === ';') this.erro(k, `'{' esperado na declaração do enum '${nome}'`);
      a++;
    }
    const f = this.par[a];
    const constantes: string[] = [];
    let j = a + 1;
    while (j < f) {
      const v = this.V(j);
      if (this.ehIdent(j)) {
        constantes.push(v);
        j++;
        if (this.V(j) === '(' || this.V(j) === '{') {
          this.erro(j, 'enum com construtor ou corpo nas constantes não é suportado: use só a lista de constantes');
        }
      } else if (v === ',') {
        j++;
      } else if (v === ';') {
        if (j + 1 < f) this.erro(j + 1, 'enum com campos ou métodos não é suportado: use só a lista de constantes');
        j++;
      } else {
        this.erro(j, `constante do enum esperada, encontrado '${v}'`);
      }
    }
    this.apagar(k, f);
    this.set(k, `const ${nome} = __enum('${nome}', [${constantes.map((c) => `'${c}'`).join(', ')}]);`);
    this.ordemClasses.push(nome);
    return f + 1;
  }

  private lerCorpoClasse(a: number, f: number, classe: Classe, ehInterface: boolean) {
    let k = a + 1;
    while (k < f) {
      if (this.V(k) === ';') {
        k++;
        continue;
      }
      const ini = k;
      let estatico = false;
      let ehDefault = false;
      let abstrato = false;
      for (;;) {
        const v = this.V(k);
        if (v === '@') {
          k = this.pularAnotacao(k);
        } else if (MODIFICADORES.has(v)) {
          if (v === 'static') estatico = true;
          if (v === 'default') ehDefault = true;
          if (v === 'abstract') abstrato = true;
          k++;
        } else break;
      }

      if (this.V(k) === '{') {
        if (!estatico) this.erro(k, 'blocos de inicialização de instância não são suportados: inicialize no construtor');
        this.apagar(ini, k - 1);
        this.prefixar(k, 'static ');
        this.corpos.push({ ini: k + 1, fim: this.par[k], classe, locais: new Map(), expressao: false });
        k = this.par[k] + 1;
        continue;
      }
      if (['class', 'interface', 'enum', 'record'].includes(this.V(k))) {
        this.erro(k, 'classes internas não são suportadas: declare a classe fora, no nível superior do arquivo');
      }
      if (this.V(k) === '<') {
        const fa = this.fimAngulo(k);
        if (fa < 0) this.erro(k, 'declaração de tipo genérico inválida');
        k = fa;
      }

      let kNome: number;
      let tipo = '';
      const construtor = this.ehIdent(k) && this.V(k) === classe.nome && this.V(k + 1) === '(';
      if (construtor) {
        kNome = k;
      } else {
        const ft = this.fimTipo(k);
        if (ft < 0) this.erro(k, `declaração de campo ou método esperada, encontrado '${this.V(k)}'`);
        if (this.V(ft) === '(') {
          this.erro(k, `tipo de retorno do método '${this.V(k)}' esperado (ou o construtor deveria se chamar '${classe.nome}')`);
        }
        if (!this.ehIdent(ft) || PALAVRAS_RESERVADAS.has(this.V(ft))) {
          this.erro(ft, `nome do campo ou método esperado, encontrado '${this.V(ft)}'`);
        }
        tipo = this.texto(k, ft - 1);
        kNome = ft;
      }

      if (this.V(kNome + 1) === '(') {
        const semCorpoPermitido = abstrato || (ehInterface && !ehDefault && !estatico);
        k = this.lerMetodo(ini, kNome, construtor, tipo, estatico, classe, semCorpoPermitido);
      } else {
        k = this.lerCampo(ini, kNome, tipo, estatico || ehInterface, classe);
      }
    }
  }

  private lerParametros(pa: number, pf: number): { nome: string; tipo: string; varargs: boolean }[] {
    const params: { nome: string; tipo: string; varargs: boolean }[] = [];
    let grupo: number[] = [];
    let angulo = 0;
    const fecharGrupo = () => {
      if (grupo.length === 0) return;
      const ultimo = grupo[grupo.length - 1];
      if (!this.ehIdent(ultimo)) this.erro(ultimo, 'nome do parâmetro esperado');
      const varargs = grupo.some((g) => this.V(g) === '...');
      const tipo = grupo.slice(0, -1).filter((g) => this.V(g) !== '...').map((g) => this.V(g)).join('');
      if (!tipo) this.erro(ultimo, `tipo do parâmetro '${this.V(ultimo)}' esperado`);
      params.push({ nome: this.saida(ultimo), tipo, varargs });
    };
    for (let j = pa + 1; j < pf; j++) {
      const v = this.V(j);
      if (v === '@') {
        j = this.pularAnotacao(j) - 1;
        continue;
      }
      if (v === 'final') continue;
      if (v === '<') angulo++;
      if (v === '>') angulo--;
      if (v === ',' && angulo === 0) {
        fecharGrupo();
        grupo = [];
      } else grupo.push(j);
    }
    fecharGrupo();
    return params;
  }

  private lerMetodo(
    ini: number, kNome: number, construtor: boolean, retorno: string, estatico: boolean,
    classe: Classe, semCorpoPermitido: boolean
  ): number {
    const nome = this.V(kNome);
    const pa = kNome + 1;
    const pf = this.par[pa];
    const params = this.lerParametros(pa, pf);
    let j = pf + 1;
    if (this.V(j) === 'throws') {
      while (j < this.S.length && this.V(j) !== '{' && this.V(j) !== ';') j++;
    }
    if (this.V(j) === ';') {
      if (!semCorpoPermitido) this.erro(j, `corpo do método '${nome}' esperado: '{' em vez de ';'`);
      this.apagar(ini, j);
      return j + 1;
    }
    if (this.V(j) !== '{') this.erro(j, `'{' esperado no método '${nome}'`);

    if (construtor) {
      if (classe.temConstrutor) this.erro(kNome, `mais de um construtor em '${classe.nome}': sobrecarga não é suportada neste simulador`);
      classe.temConstrutor = true;
    } else {
      if (classe.metodos.has(nome)) {
        this.erro(kNome, `método '${nome}' declarado mais de uma vez: sobrecarga não é suportada neste simulador`);
      }
      classe.metodos.set(nome, { estatico, tipo: retorno });
    }

    this.apagar(ini, j - 1);
    const lista = params.map((p) => (p.varargs ? '...' : '') + p.nome).join(', ');
    this.set(ini, `${estatico ? 'static ' : ''}${construtor ? 'constructor' : nomeMetodo(nome)}(${lista}) `);
    const locais = new Map<string, string>();
    for (const p of params) locais.set(p.nome, p.tipo + (p.varargs ? '[]' : ''));
    this.corpos.push({ ini: j + 1, fim: this.par[j], classe, locais, retorno: construtor ? undefined : retorno, expressao: false });
    return this.par[j] + 1;
  }

  private lerCampo(ini: number, kNome: number, tipo: string, estatico: boolean, classe: Classe): number {
    this.apagar(ini, kNome - 1);
    let j = kNome;
    for (;;) {
      if (!this.ehIdent(j)) this.erro(j, 'nome do campo esperado');
      const nome = this.V(j);
      const kN = j;
      this.set(kN, nome);
      if (estatico) this.prefixar(kN, 'static ');
      j++;
      let tipoCampo = tipo;
      while (this.V(j) === '[' && this.V(j + 1) === ']') {
        this.apagar(j, j + 1);
        tipoCampo += '[]';
        j += 2;
      }
      classe.campos.set(nome, { estatico, tipo: tipoCampo });
      if (this.V(j) === '=') {
        const iniExpr = j + 1;
        const fimExpr = this.fimExpressao(iniExpr, [',', ';']);
        if (fimExpr === iniExpr) this.erro(j, `valor esperado depois de '=' no campo '${nome}'`);
        if (this.V(iniExpr) === '{') this.converterInicializadorArray(iniExpr);
        this.corpos.push({ ini: iniExpr, fim: fimExpr, classe, locais: new Map(), expressao: true });
        j = fimExpr;
      } else {
        this.suf[this.S[kN]] += ` = ${valorPadrao(tipoCampo)}`;
      }
      const v = this.V(j);
      if (v === ';') return j + 1;
      if (v !== ',') this.erro(j - 1, "';' esperado");
      this.set(j, ';');
      j++;
    }
  }

  /** Índice do primeiro token em `terminadores` no nível 0, a partir de k. */
  private fimExpressao(k: number, terminadores: string[]): number {
    let j = k;
    while (j < this.S.length) {
      const v = this.V(j);
      if (terminadores.includes(v)) return j;
      if (v === '(' || v === '[' || v === '{') j = this.par[j] + 1;
      else if (v === ')' || v === ']' || v === '}') return j;
      else if (v === 'new' && this.ehIdent(j + 1)) {
        j = this.fimNomeTipo(j + 1) + 1;
        if (this.V(j) === '<') {
          const fa = this.fimAngulo(j);
          if (fa > 0) j = fa;
        }
      } else j++;
    }
    return j;
  }

  private resolverHeranca() {
    const resolvidas = new Set<string>();
    const resolver = (c: Classe, caminho: Set<string>) => {
      if (resolvidas.has(c.nome) || caminho.has(c.nome)) return;
      caminho.add(c.nome);
      const pai = c.pai ? this.classes.get(c.pai) : undefined;
      if (pai) {
        resolver(pai, caminho);
        for (const [n, m] of pai.campos) if (!c.campos.has(n)) c.campos.set(n, m);
        for (const [n, m] of pai.metodos) if (!c.metodos.has(n)) c.metodos.set(n, m);
      }
      resolvidas.add(c.nome);
    };
    for (const c of this.classes.values()) resolver(c, new Set());
  }

  // ── Checagem de ';' (o JS aceitaria sem, o Java não) ──────────────────
  private verificarPontoEVirgula(corpo: Corpo) {
    const chavesArray = new Set<number>();
    const cabecalhos = new Set<number>();
    const abertasArray: number[] = [];
    let prof = 0;
    for (let k = corpo.ini; k < corpo.fim; k++) {
      const v = this.V(k);
      if (v === '(' && CABECALHOS.has(this.V(k - 1))) cabecalhos.add(this.par[k]);
      if (v === '{') {
        const ant = this.V(k - 1);
        const dentroDeArray = abertasArray.some((a) => a < k && this.par[a] > k);
        if (ant === '=' || ant === ']' || ((ant === ',' || ant === '{') && dentroDeArray)) {
          chavesArray.add(k);
          chavesArray.add(this.par[k]);
          abertasArray.push(k);
        }
      }
      if (v === '(' || v === '[') prof++;
      if (v === ')' || v === ']') prof--;
      if (prof !== 0 || chavesArray.has(k)) continue;

      const t = this.T(k)!;
      const terminaExpressao =
        (t.tipo === 'ident' && (!PALAVRAS_RESERVADAS.has(v) || VALORES.has(v))) ||
        t.tipo === 'numero' || t.tipo === 'string' || t.tipo === 'char' ||
        v === ']' || v === '++' || v === '--' ||
        (v === ')' && !cabecalhos.has(k));
      if (!terminaExpressao) continue;

      const prox = k + 1;
      const tp = this.T(prox);
      if (!tp) continue;
      const fechaBloco = tp.v === '}' && !chavesArray.has(prox);
      const comecaComando =
        this.quebraEntre(k, prox) &&
        (tp.tipo === 'ident' || tp.tipo === 'numero' || tp.tipo === 'string' || tp.tipo === 'char') &&
        !['instanceof', 'extends', 'implements', 'throws'].includes(tp.v);
      if (fechaBloco || comecaComando) this.erro(k, "';' esperado");
    }
  }

  // ── Corpo de métodos ──────────────────────────────────────────────────
  private transformarCorpo(corpo: Corpo) {
    const { ini, fim, classe } = corpo;
    const locais = new Map(corpo.locais);
    const paramsLambda = new Set<number>();
    const blocosLambda: [number, number][] = [];
    const inicioCastInteiro = new Map<number, boolean>();
    const forCabecalhos = new Map<number, number>();
    const cabecalhos = new Set<number>();
    const pularIdent = new Set<number>();

    this.marcarParametrosLambda(ini, fim, locais, paramsLambda, blocosLambda);
    const emLambda = (k: number) => blocosLambda.some(([a, b]) => k > a && k < b);

    for (let k = ini; k < fim; k++) {
      const v = this.V(k);
      const t = this.T(k)!;
      const ant = k > ini ? this.V(k - 1) : corpo.expressao ? '=' : '{';

      if (v === '(' && CABECALHOS.has(this.V(k - 1))) cabecalhos.add(this.par[k]);
      if (v === '(' && this.V(k - 1) === 'for') forCabecalhos.set(k, this.par[k]);

      const inicioComando =
        !corpo.expressao &&
        (k === ini || ant === '{' || ant === ';' || ant === '}' || ant === 'else' || ant === 'do' ||
          (ant === '(' && forCabecalhos.has(k - 1)) ||
          (ant === ')' && cabecalhos.has(k - 1)) ||
          (ant === ':' && this.ehRotuloCase(k - 1, ini)));
      if (inicioComando) {
        const decl = this.tentarDeclaracao(k, forCabecalhos, locais);
        if (decl >= 0) {
          k = decl;
          continue;
        }
      }

      if (t.tipo === 'ident') {
        if (pularIdent.has(k)) continue;
        switch (v) {
          case 'new':
            this.transformarNew(k);
            continue;
          case 'instanceof':
            this.transformarInstanceof(k, pularIdent);
            continue;
          case 'catch':
            this.transformarCatch(k, locais);
            continue;
          case 'case':
          case 'default':
            this.transformarCase(k, locais, classe);
            continue;
          case 'switch':
            if (this.V(k + 1) === '(') this.envolver(k + 2, this.par[k + 1] - 1, '__sw(');
            continue;
          case 'return':
            if (corpo.retorno && INTEIROS.has(corpo.retorno) && !emLambda(k)) {
              const fe = this.fimExpressao(k + 1, [';']);
              if (fe > k + 1) this.envolver(k + 1, fe - 1, '__int(');
            }
            continue;
          case 'final':
            this.apagar(k, k);
            continue;
          case 'assert':
            this.erro(k, 'assert não é suportado neste simulador: use if + throw');
        }
        if (PALAVRAS_RESERVADAS.has(v)) continue;
        this.qualificarIdent(k, classe, locais, paramsLambda);
        continue;
      }

      switch (v) {
        case '@':
          k = this.pularAnotacao(k) - 1;
          break;
        case '->':
          this.set(k, '=>');
          break;
        case '::':
          this.transformarReferencia(k, ini);
          pularIdent.add(k + 1);
          break;
        case '=':
          if (this.V(k + 1) === '{') this.converterInicializadorArray(k + 1);
          break;
        case '.': {
          const nome = this.V(k + 1);
          if (nome === 'length' && this.V(k + 2) === '(' && this.V(k + 3) === ')') {
            this.apagar(k + 2, k + 3);
          } else if (renomeado(nome) && this.V(k + 2) === '(') {
            this.set(k + 1, nomeMetodo(nome));
          } else if (nome === '<') {
            const fa = this.fimAngulo(k + 1);
            if (fa > 0) this.apagar(k + 1, fa - 1);
          }
          if (this.ehIdent(k + 1)) pularIdent.add(k + 1);
          break;
        }
        case '(': {
          const fimCast = this.tentarCast(k, inicioCastInteiro);
          if (fimCast >= 0) k = fimCast;
          break;
        }
        case '/':
          this.transformarDivisao(k, ini, locais, classe, inicioCastInteiro);
          break;
      }
    }
  }

  private marcarParametrosLambda(
    ini: number, fim: number, locais: Map<string, string>, paramsLambda: Set<number>, blocosLambda: [number, number][]
  ) {
    for (let k = ini; k < fim; k++) {
      if (this.V(k) !== '->') continue;
      const ant = k - 1;
      if (this.ehIdent(ant)) {
        paramsLambda.add(ant);
        locais.set(this.saida(ant), '');
      } else if (this.V(ant) === ')') {
        let grupo: number[] = [];
        const fecharGrupo = () => {
          if (grupo.length === 0) return;
          const nomeK = grupo[grupo.length - 1];
          paramsLambda.add(nomeK);
          locais.set(this.saida(nomeK), grupo.length > 1 ? this.texto(grupo[0], nomeK - 1) : '');
          if (grupo.length > 1) this.apagar(grupo[0], nomeK - 1);
        };
        let angulo = 0;
        for (let j = this.par[ant] + 1; j < ant; j++) {
          const v = this.V(j);
          if (v === '<') angulo++;
          if (v === '>') angulo--;
          if (v === ',' && angulo === 0) {
            fecharGrupo();
            grupo = [];
          } else if (v !== 'final') grupo.push(j);
        }
        fecharGrupo();
      }
      if (this.V(k + 1) === '{') blocosLambda.push([k + 1, this.par[k + 1]]);
    }
  }

  private ehRotuloCase(kDoisPontos: number, ini: number): boolean {
    for (let j = kDoisPontos - 1; j >= ini; j--) {
      const v = this.V(j);
      if (v === 'case' || v === 'default') return true;
      if (v === ';' || v === '{' || v === '}' || v === '?') return false;
    }
    return false;
  }

  /** Se k começa uma declaração de variável local, transforma e devolve o índice do primeiro nome; senão -1. */
  private tentarDeclaracao(k: number, forCabecalhos: Map<number, number>, locais: Map<string, string>): number {
    let j = k;
    while (this.V(j) === 'final' || this.V(j) === '@') {
      j = this.V(j) === '@' ? this.pularAnotacao(j) : j + 1;
    }
    const ft = this.fimTipo(j);
    if (ft < 0 || !this.ehIdent(ft) || PALAVRAS_RESERVADAS.has(this.V(ft))) return -1;
    const depois = this.V(ft + 1);
    const noFor = [...forCabecalhos.entries()].some(([a, b]) => k > a && k < b);
    if (!['=', ';', ',', '['].includes(depois) && !(depois === ':' && noFor)) return -1;

    const tipo = this.texto(j, ft - 1);
    this.apagar(k, ft - 1);
    this.set(k, 'let ');

    let n = ft;
    for (;;) {
      if (!this.ehIdent(n)) this.erro(n, 'nome da variável esperado');
      const nome = this.saida(n);
      let tipoVar = tipo;
      let m = n + 1;
      while (this.V(m) === '[' && this.V(m + 1) === ']') {
        this.apagar(m, m + 1);
        tipoVar += '[]';
        m += 2;
      }
      locais.set(nome, tipoVar);
      if (this.V(m) === ':') {
        this.set(m, ' of ');
        const fechaFor = [...forCabecalhos.entries()].find(([a, b]) => k > a && k < b)![1];
        if (fechaFor - 1 > m) this.envolver(m + 1, fechaFor - 1, '__iter(');
        break;
      }
      if (this.V(m) === '=') {
        const iniExpr = m + 1;
        const fe = this.fimExpressao(iniExpr, [',', ';']);
        if (fe === iniExpr) this.erro(m, `valor esperado depois de '=' na variável '${nome}'`);
        if (this.V(iniExpr) === '{') this.converterInicializadorArray(iniExpr);
        else if (INTEIROS.has(tipoVar)) this.envolver(iniExpr, fe - 1, '__int(');
        m = fe;
      }
      if (this.V(m) === ',') {
        n = m + 1;
        continue;
      }
      break;
    }
    return ft;
  }

  private qualificarIdent(k: number, classe: Classe, locais: Map<string, string>, paramsLambda: Set<number>) {
    if (paramsLambda.has(k) || this.saida(k) === '' || locais.has(this.saida(k))) return;
    const nome = this.V(k);
    const chamada = this.V(k + 1) === '(';
    const membro = chamada ? classe.metodos.get(nome) : classe.campos.get(nome);
    if (!membro) return;
    this.set(k, chamada ? nomeMetodo(nome) : nome);
    this.pre[this.S[k]] += membro.estatico ? `${classe.nome}.` : 'this.';
  }

  private transformarNew(k: number) {
    const ini = k + 1;
    if (!this.ehIdent(ini)) this.erro(k, 'tipo esperado depois de new');
    let j = this.fimNomeTipo(ini) + 1;
    if (this.V(j) === '<') {
      const fa = this.fimAngulo(j);
      if (fa < 0) this.erro(j, 'argumentos de tipo genérico inválidos');
      this.apagar(j, fa - 1);
      j = fa;
    }
    if (this.V(j) === '[') {
      const dims: [number, number][] = [];
      let vazias = 0;
      while (this.V(j) === '[') {
        if (this.V(j + 1) === ']') {
          vazias++;
          j += 2;
        } else {
          dims.push([j, this.par[j]]);
          j = this.par[j] + 1;
        }
      }
      if (this.V(j) === '{') {
        this.apagar(k, j - 1);
        this.converterInicializadorArray(j);
        return;
      }
      if (dims.length === 0) this.erro(j, 'tamanho do array ou inicializador { ... } esperado');
      const padrao = vazias > 0 ? 'null' : valorPadrao(this.V(ini));
      this.apagar(k, dims[0][0] - 1);
      this.set(k, '__newArray(');
      dims.forEach(([a, f], i) => {
        if (i > 0) this.set(a, ', ');
        this.set(f, i < dims.length - 1 ? '' : `], ${padrao})`);
      });
      const ultimo = dims[dims.length - 1][1];
      if (j - 1 > ultimo) this.apagar(ultimo + 1, j - 1);
      return;
    }
    if (this.V(j) === '(') {
      if (this.V(this.par[j] + 1) === '{') {
        this.erro(this.par[j] + 1, 'classes anônimas não são suportadas: use uma lambda ou declare uma classe');
      }
      return;
    }
    this.erro(j, "'(' ou '[' esperado depois do tipo em new");
  }

  private converterInicializadorArray(a: number) {
    const f = this.par[a];
    this.set(a, '[');
    this.set(f, ']');
    for (let j = a + 1; j < f; j++) {
      if (this.V(j) === '{' && (this.V(j - 1) === ',' || j === a + 1)) {
        this.converterInicializadorArray(j);
        j = this.par[j];
      }
    }
  }

  private transformarInstanceof(k: number, pularIdent: Set<number>) {
    const ft = this.fimTipo(k + 1);
    if (ft < 0) this.erro(k, 'tipo esperado depois de instanceof');
    if (this.ehIdent(ft) && !PALAVRAS_RESERVADAS.has(this.V(ft))) {
      this.erro(ft, 'pattern matching em instanceof não é suportado: teste com instanceof e depois faça o cast');
    }
    const fimNome = this.fimNomeTipo(k + 1);
    this.apagar(fimNome + 1, ft - 1);
    this.envolver(k + 1, fimNome, '__tipo(');
    for (let j = k + 1; j <= fimNome; j++) pularIdent.add(j);
  }

  private transformarCatch(k: number, locais: Map<string, string>) {
    const pa = k + 1;
    if (this.V(pa) !== '(') this.erro(k, "'(' esperado depois de catch");
    const pf = this.par[pa];
    const nomeK = pf - 1;
    if (!this.ehIdent(nomeK)) this.erro(nomeK, 'nome da variável da exceção esperado');
    const tipos: string[] = [];
    let atual = '';
    for (let j = pa + 1; j < nomeK; j++) {
      const v = this.V(j);
      if (v === 'final') continue;
      if (v === '|') {
        tipos.push(atual);
        atual = '';
      } else atual += v;
    }
    if (atual) tipos.push(atual);
    if (tipos.length === 0) this.erro(nomeK, 'tipo da exceção esperado no catch');
    this.apagar(pa + 1, nomeK - 1);
    const nome = this.saida(nomeK);
    locais.set(nome, tipos[0]);
    const chave = pf + 1;
    if (this.V(chave) !== '{') this.erro(chave, "'{' esperado depois do catch");
    const condicao = tipos.map((t) => `${nome} instanceof __tipo(${t})`).join(' || ');
    this.suf[this.S[chave]] += ` ${nome} = __jex(${nome}); if (!(${condicao})) throw ${nome};`;
  }

  private transformarCase(k: number, locais: Map<string, string>, classe: Classe) {
    const erroSeta = "switch com '->' não é suportado: use o switch clássico com 'case X:' e 'break'";
    if (this.V(k) === 'default') {
      if (this.V(k + 1) === '->') this.erro(k + 1, erroSeta);
      return;
    }
    let j = k + 1;
    while (j < this.S.length && this.V(j) !== ':' && this.V(j) !== '->') {
      if (this.V(j) === '(' || this.V(j) === '[' || this.V(j) === '{') j = this.par[j];
      j++;
    }
    if (this.V(j) === '->') this.erro(j, erroSeta);
    // "case RECEITA:" num switch de enum: vira a string do nome, comparada com __sw(valor).
    if (j === k + 2 && this.ehIdent(k + 1)) {
      const nome = this.V(k + 1);
      if (!locais.has(nome) && !classe.campos.has(nome) && !VALORES.has(nome)) this.set(k + 1, `'${nome}'`);
    } else if (j > k + 2 && this.ehIdent(k + 1) && this.V(k + 2) === '.') {
      // "case TipoLancamento.RECEITA:" (Java 21): normalizado do mesmo jeito que o valor do switch.
      this.envolver(k + 1, j - 1, '__sw(');
    }
  }

  private transformarReferencia(k: number, ini: number) {
    const nome = this.V(k + 1);
    let s = k - 1;
    while (s - 2 >= ini && this.V(s - 1) === '.' && this.ehIdent(s - 2)) s -= 2;
    if (nome === 'new') {
      this.envolver(s, k - 1, '__ctor(');
      this.set(k, '');
      this.set(k + 1, '');
      return;
    }
    this.envolver(s, k + 1, '__ref(', '');
    this.set(k, ", '");
    this.set(k + 1, `${nome}')`);
  }

  /** Se o '(' em k abre um cast, remove-o e devolve o índice do ')'; senão -1. */
  private tentarCast(k: number, inicioCastInteiro: Map<number, boolean>): number {
    const antes = this.V(k - 1);
    if (this.ehIdent(k - 1) && !['return', 'throw', 'case', 'else'].includes(antes)) return -1;
    if (antes === ')' || antes === ']') return -1;
    const f = this.par[k];
    if (this.fimTipo(k + 1) !== f) return -1;
    const base = this.V(k + 1);
    const tipo = this.texto(k + 1, f - 1);
    const primitivo = PRIMITIVOS.has(base) && !tipo.includes('[');
    const prox = this.T(f + 1);
    if (!prox) return -1;
    if (!primitivo && !/^[A-Z]/.test(base)) return -1;
    const operando =
      (prox.tipo === 'ident' && (!PALAVRAS_RESERVADAS.has(prox.v) || ['this', 'new', 'super', 'null'].includes(prox.v))) ||
      prox.tipo === 'numero' || prox.tipo === 'string' || prox.tipo === 'char' || prox.v === '(';
    const unario = primitivo && ['-', '+', '!', '~'].includes(prox.v);
    if (!operando && !unario) return -1;

    this.apagar(k, f);
    if (primitivo && (INTEIROS.has(base) || base === 'char')) {
      const fimOp = this.fimOperando(f + 1);
      this.envolver(f + 1, fimOp, base === 'char' ? '__char(' : '__int(');
      if (base !== 'char') inicioCastInteiro.set(f + 1, true);
    } else if (primitivo && base !== 'boolean') {
      inicioCastInteiro.set(f + 1, false);
    }
    return f;
  }

  /** Último índice do operando que começa em k (sem operadores binários). */
  private fimOperando(k: number): number {
    let j = k;
    while (['-', '+', '!', '~', '++', '--'].includes(this.V(j))) j++;
    const v = this.V(j);
    if (v === '(') {
      const f = this.par[j];
      const ehCast = this.fimTipo(j + 1) === f && (PRIMITIVOS.has(this.V(j + 1)) || /^[A-Z]/.test(this.V(j + 1)));
      const prox = this.T(f + 1);
      if (ehCast && prox && prox.tipo !== 'op') return this.fimOperando(f + 1);
      j = f;
    } else if (v === 'new') {
      j = this.fimNomeTipo(j + 1) + 1;
      if (this.V(j) === '<') j = Math.max(this.fimAngulo(j), j + 1);
      if (this.V(j) === '(') j = this.par[j];
      else {
        while (this.V(j) === '[') j = this.par[j] + 1;
        if (this.V(j) === '{') j = this.par[j];
        else j--;
      }
    }
    for (;;) {
      const p = this.V(j + 1);
      if (p === '.' && this.ehIdent(j + 2)) j += 2;
      else if (p === '(' || p === '[') j = this.par[j + 1];
      else if (p === '++' || p === '--') j++;
      else break;
    }
    return j;
  }

  /** Primeiro índice do operando que termina em k. */
  private inicioOperandoAnterior(k: number, ini: number): number {
    let j = k;
    for (;;) {
      const v = this.V(j);
      if (v === ')' || v === ']') {
        const a = this.par[j];
        const chamada = v === ']' || (this.ehIdent(a - 1) && !PALAVRAS_RESERVADAS.has(this.V(a - 1)));
        if (!chamada) return a;
        j = a - 1;
        continue;
      }
      if (j - 2 >= ini && this.V(j - 1) === '.') {
        j -= 2;
        continue;
      }
      return j;
    }
  }

  private ehExpressaoInteira(a: number, b: number, locais: Map<string, string>, classe: Classe, inicioCastInteiro: Map<number, boolean>): boolean {
    if (inicioCastInteiro.has(a)) return inicioCastInteiro.get(a)!;
    const t = this.T(b)!;
    if (a === b) {
      if (t.tipo === 'numero') return !/[.eE]/.test(t.v) || /^0[xX]/.test(t.v);
      if (t.tipo === 'ident') {
        const tipo = locais.get(this.saida(b)) ?? classe.campos.get(t.v)?.tipo;
        return tipo !== undefined && INTEIROS.has(tipo);
      }
      return false;
    }
    if (t.v === ')') return METODOS_INTEIROS.has(this.V(this.par[b] - 1));
    if (t.tipo === 'ident' && this.V(b - 1) === '.') {
      if (t.v === 'length') return true;
      if (a === b - 2 && this.V(a) === 'this') {
        const tipo = classe.campos.get(t.v)?.tipo;
        return tipo !== undefined && INTEIROS.has(tipo);
      }
    }
    return false;
  }

  // Divisão entre inteiros trunca em Java. Só dá para saber quando os dois
  // lados são inteiros conhecidos (variáveis/campos declarados como int,
  // literais, size(), length...); nos demais casos fica a divisão do JS.
  private transformarDivisao(k: number, ini: number, locais: Map<string, string>, classe: Classe, inicioCastInteiro: Map<number, boolean>) {
    const a = this.inicioOperandoAnterior(k - 1, ini);
    if (['*', '/', '%'].includes(this.V(a - 1))) return;
    if (!this.ehExpressaoInteira(a, k - 1, locais, classe, inicioCastInteiro)) return;
    let iniDireita = k + 1;
    while (['-', '+'].includes(this.V(iniDireita))) iniDireita++;
    const b = this.fimOperando(k + 1);
    if (!this.ehExpressaoInteira(iniDireita, b, locais, classe, inicioCastInteiro)) return;
    this.envolver(a, b, '__idiv(');
    this.set(k, ',');
  }
}

function valorPadrao(tipo: string): string {
  if (tipo.endsWith('[]')) return 'null';
  if (tipo === 'boolean') return 'false';
  if (tipo === 'char') return "'\\0'";
  if (PRIMITIVOS.has(tipo)) return '0';
  return 'null';
}
