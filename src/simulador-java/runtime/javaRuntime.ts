/* Runtime Java em JavaScript usado pelo código que o compilador gera
 * (../compilador/compilar.ts). Cobre a parte da biblioteca padrão que um dev
 * pleno usa no dia a dia: coleções, streams, Optional, Comparator, exceções,
 * String/StringBuilder, wrappers numéricos e System.out. Roda só dentro do
 * Web Worker de execução, que também recebe os patches de protótipo de
 * instalarPrototipos(). */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Qualquer = any;

// ── Exceções ─────────────────────────────────────────────────────────────
export class Throwable extends Error {
  __msg: string | null;
  __causa: Qualquer;
  constructor(mensagem: Qualquer = null, causa: Qualquer = null) {
    let msg = mensagem;
    let c = causa;
    if (msg instanceof Throwable && c == null) {
      c = msg;
      msg = msg.toString();
    }
    super(msg == null ? '' : String(msg));
    this.__msg = msg == null ? null : String(msg);
    this.__causa = c;
    this.name = new.target.name;
  }
  getMessage() {
    return this.__msg;
  }
  getLocalizedMessage() {
    return this.__msg;
  }
  getCause() {
    return this.__causa;
  }
  printStackTrace() {}
  toString() {
    return this.__msg == null ? this.name : `${this.name}: ${this.__msg}`;
  }
}
export class Exception extends Throwable {}
export class RuntimeException extends Exception {}
export class IllegalArgumentException extends RuntimeException {}
export class IllegalStateException extends RuntimeException {}
export class NullPointerException extends RuntimeException {}
export class ArithmeticException extends RuntimeException {}
export class UnsupportedOperationException extends RuntimeException {}
export class IndexOutOfBoundsException extends RuntimeException {}
export class ArrayIndexOutOfBoundsException extends IndexOutOfBoundsException {}
export class NoSuchElementException extends RuntimeException {}
export class NumberFormatException extends IllegalArgumentException {}
export class ClassCastException extends RuntimeException {}
export class StackOverflowError extends Throwable {}

/** Converte erros nativos do JS no equivalente Java (TypeError de null vira NullPointerException etc). */
export function __jex(e: Qualquer): Throwable {
  if (e instanceof Throwable) return e;
  let convertido: Throwable;
  if (e instanceof RangeError && /call stack/i.test(e.message)) {
    convertido = new StackOverflowError('recursão infinita: a pilha de chamadas estourou');
  } else if (e instanceof TypeError) {
    const ler = /Cannot read propert(?:y|ies) of (?:null|undefined)(?: \(reading '([^']+)'\))?/.exec(e.message);
    const naoFuncao = /([\w$.]+) is not a function/.exec(e.message);
    if (ler) {
      convertido = new NullPointerException(ler[1] ? `não é possível acessar '${ler[1]}' porque o valor é null` : 'valor null');
    } else if (naoFuncao) {
      const nome = naoFuncao[1].split('.').pop();
      convertido = new RuntimeException(`método '${nome}' não existe para esse objeto`);
    } else {
      convertido = new RuntimeException(e.message);
    }
  } else if (e instanceof ReferenceError) {
    const nome = /([\w$]+) is not defined/.exec(e.message)?.[1];
    convertido = new RuntimeException(nome ? `símbolo não encontrado: ${nome}` : e.message);
  } else {
    convertido = new RuntimeException(e?.message ?? String(e));
  }
  (convertido as Qualquer).__original = e;
  return convertido;
}

// ── Igualdade, texto e comparação ────────────────────────────────────────
export function jeq(a: Qualquer, b: Qualquer): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a === 'number' && typeof b === 'number') return Number.isNaN(a) && Number.isNaN(b);
  if (typeof a === 'object' && typeof a.equals === 'function') return !!a.equals(b);
  return false;
}

export function jstr(x: Qualquer): string {
  if (x === null || x === undefined) return 'null';
  if (Array.isArray(x)) return `[${x.map(jstr).join(', ')}]`;
  return String(x);
}

let proximoHash = 1;
const hashes = new WeakMap<object, number>();
function hashIdentidade(o: object): number {
  let h = hashes.get(o);
  if (h === undefined) {
    h = proximoHash++;
    hashes.set(o, h);
  }
  return h;
}

export function jhash(x: Qualquer): number {
  if (x == null) return 0;
  if (typeof x === 'object' || typeof x === 'string' || typeof x === 'number' || typeof x === 'boolean') {
    return x.hashCode();
  }
  return 0;
}

export function compararNatural(a: Qualquer, b: Qualquer): number {
  if (a == null || b == null) throw new NullPointerException('não é possível comparar null');
  if (typeof a === 'number' || typeof a === 'string' || typeof a === 'boolean') {
    return a < b ? -1 : a > b ? 1 : 0;
  }
  if (typeof a.compareTo === 'function') return a.compareTo(b);
  throw new ClassCastException(`${a.constructor?.name ?? typeof a} não implementa Comparable`);
}

function paraFuncaoComparacao(c: Qualquer): (a: Qualquer, b: Qualquer) => number {
  if (c == null) return compararNatural;
  if (typeof c === 'function') return (a, b) => Number(c(a, b));
  if (typeof c.compare === 'function') return (a, b) => Number(c.compare(a, b));
  throw new ClassCastException('o argumento não é um Comparator');
}

export function comparador(fn: (a: Qualquer, b: Qualquer) => number): Qualquer {
  const c: Qualquer = (a: Qualquer, b: Qualquer) => fn(a, b);
  c.__cmp = true;
  return c;
}

/** Aceita um Comparator ou uma função extratora de chave (como Comparator.comparing faz). */
function comparadorDe(x: Qualquer, cmpChave?: Qualquer): Qualquer {
  if (x == null) return comparador(compararNatural);
  if (x.__cmp || (typeof x === 'function' && x.length === 2) || typeof x === 'object') {
    return comparador(paraFuncaoComparacao(x));
  }
  const base = cmpChave == null ? compararNatural : paraFuncaoComparacao(cmpChave);
  return comparador((a, b) => base(x(a), x(b)));
}

export const Comparator = {
  comparing: (chave: Qualquer, cmp?: Qualquer) => {
    const base = cmp == null ? compararNatural : paraFuncaoComparacao(cmp);
    return comparador((a, b) => base(chave(a), chave(b)));
  },
  comparingDouble: (chave: Qualquer) => comparador((a, b) => compararNatural(chave(a), chave(b))),
  comparingInt: (chave: Qualquer) => comparador((a, b) => compararNatural(chave(a), chave(b))),
  comparingLong: (chave: Qualquer) => comparador((a, b) => compararNatural(chave(a), chave(b))),
  naturalOrder: () => comparador(compararNatural),
  reverseOrder: () => comparador((a, b) => compararNatural(b, a)),
  nullsFirst: (c: Qualquer) => {
    const f = paraFuncaoComparacao(c);
    return comparador((a, b) => (a == null ? (b == null ? 0 : -1) : b == null ? 1 : f(a, b)));
  },
  nullsLast: (c: Qualquer) => {
    const f = paraFuncaoComparacao(c);
    return comparador((a, b) => (a == null ? (b == null ? 0 : 1) : b == null ? -1 : f(a, b)));
  },
};

function iteravel(x: Qualquer): Qualquer[] {
  if (x == null) throw new NullPointerException('coleção null');
  if (Array.isArray(x)) return x;
  if (typeof x[Symbol.iterator] === 'function') return Array.from(x);
  throw new ClassCastException('o valor não é uma coleção');
}

function indiceValido(i: Qualquer, tamanho: number) {
  if (typeof i !== 'number' || !Number.isInteger(i) || i < 0 || i >= tamanho) {
    throw new IndexOutOfBoundsException(`Index ${jstr(i)} out of bounds for length ${tamanho}`);
  }
}

// ── List ─────────────────────────────────────────────────────────────────
export class JList {
  a: Qualquer[];
  __imutavel = false;
  constructor(origem?: Qualquer) {
    this.a = origem == null || typeof origem === 'number' ? [] : iteravel(origem).slice();
  }
  static of(...xs: Qualquer[]) {
    if (xs.some((x) => x == null)) throw new NullPointerException('List.of não aceita null');
    const l = new JList(xs);
    l.__imutavel = true;
    return l;
  }
  static copyOf(c: Qualquer) {
    return JList.of(...iteravel(c));
  }
  protected mutavel() {
    if (this.__imutavel) throw new UnsupportedOperationException('lista imutável não pode ser alterada');
  }
  add(...args: Qualquer[]) {
    this.mutavel();
    if (args.length === 2) {
      if (args[0] !== this.a.length) indiceValido(args[0], this.a.length);
      this.a.splice(args[0], 0, args[1]);
      return;
    }
    this.a.push(args[0]);
    return true;
  }
  addAll(...args: Qualquer[]) {
    this.mutavel();
    const itens = iteravel(args[args.length - 1]);
    if (args.length === 2) this.a.splice(args[0], 0, ...itens);
    else this.a.push(...itens);
    return itens.length > 0;
  }
  addFirst(x: Qualquer) {
    this.mutavel();
    this.a.unshift(x);
  }
  addLast(x: Qualquer) {
    this.add(x);
  }
  get(i: Qualquer) {
    indiceValido(i, this.a.length);
    return this.a[i];
  }
  getFirst() {
    if (this.a.length === 0) throw new NoSuchElementException(null);
    return this.a[0];
  }
  getLast() {
    if (this.a.length === 0) throw new NoSuchElementException(null);
    return this.a[this.a.length - 1];
  }
  set(i: Qualquer, v: Qualquer) {
    this.mutavel();
    indiceValido(i, this.a.length);
    const antigo = this.a[i];
    this.a[i] = v;
    return antigo;
  }
  remove(x: Qualquer) {
    this.mutavel();
    if (typeof x === 'number' && Number.isInteger(x)) {
      indiceValido(x, this.a.length);
      return this.a.splice(x, 1)[0];
    }
    const i = this.indexOf(x);
    if (i < 0) return false;
    this.a.splice(i, 1);
    return true;
  }
  removeFirst() {
    const x = this.getFirst();
    this.a.shift();
    return x;
  }
  removeLast() {
    const x = this.getLast();
    this.a.pop();
    return x;
  }
  removeIf(p: Qualquer) {
    this.mutavel();
    const antes = this.a.length;
    this.a = this.a.filter((x) => !p(x));
    return this.a.length !== antes;
  }
  removeAll(c: Qualquer) {
    const outros = iteravel(c);
    return this.removeIf((x: Qualquer) => outros.some((o) => jeq(o, x)));
  }
  retainAll(c: Qualquer) {
    const outros = iteravel(c);
    return this.removeIf((x: Qualquer) => !outros.some((o) => jeq(o, x)));
  }
  size() {
    return this.a.length;
  }
  isEmpty() {
    return this.a.length === 0;
  }
  contains(x: Qualquer) {
    return this.indexOf(x) >= 0;
  }
  containsAll(c: Qualquer) {
    return iteravel(c).every((x) => this.contains(x));
  }
  indexOf(x: Qualquer) {
    return this.a.findIndex((y) => jeq(x, y));
  }
  lastIndexOf(x: Qualquer) {
    for (let i = this.a.length - 1; i >= 0; i--) if (jeq(x, this.a[i])) return i;
    return -1;
  }
  clear() {
    this.mutavel();
    this.a = [];
  }
  sort(c: Qualquer) {
    this.mutavel();
    this.a.sort(paraFuncaoComparacao(c));
  }
  forEach(f: Qualquer) {
    for (const x of this.a.slice()) f(x);
  }
  __jreplaceAll(f: Qualquer) {
    this.mutavel();
    this.a = this.a.map((x) => f(x));
  }
  stream() {
    return new JStream(this.a.slice());
  }
  parallelStream() {
    return this.stream();
  }
  iterator() {
    let i = 0;
    return {
      hasNext: () => i < this.a.length,
      next: () => {
        if (i >= this.a.length) throw new NoSuchElementException(null);
        return this.a[i++];
      },
      remove: () => {
        this.mutavel();
        this.a.splice(--i, 1);
      },
    };
  }
  [Symbol.iterator]() {
    return this.a.slice()[Symbol.iterator]();
  }
  toArray() {
    return this.a.slice();
  }
  subList(i: number, j: number) {
    if (i < 0 || j > this.a.length || i > j) throw new IndexOutOfBoundsException(`fromIndex ${i}, toIndex ${j}, size ${this.a.length}`);
    return new JList(this.a.slice(i, j));
  }
  reversed() {
    return new JList(this.a.slice().reverse());
  }
  // Queue / Deque / Stack
  offer(x: Qualquer) {
    return this.add(x);
  }
  push(x: Qualquer) {
    this.addFirst(x);
  }
  poll() {
    return this.a.length === 0 ? null : this.removeFirst();
  }
  pop() {
    return this.removeFirst();
  }
  peek() {
    return this.a.length === 0 ? null : this.a[0];
  }
  equals(o: Qualquer) {
    return o instanceof JList && o.a.length === this.a.length && this.a.every((x, i) => jeq(x, o.a[i]));
  }
  hashCode() {
    return this.a.reduce((h, x) => (31 * h + jhash(x)) | 0, 1);
  }
  toString() {
    return `[${this.a.map(jstr).join(', ')}]`;
  }
}
export class ArrayList extends JList {}
export class LinkedList extends JList {}

// ── Map ──────────────────────────────────────────────────────────────────
export class JEntry {
  private k: Qualquer;
  private v: Qualquer;
  private mapa: JMap | null;
  constructor(k: Qualquer, v: Qualquer, mapa: JMap | null = null) {
    this.k = k;
    this.v = v;
    this.mapa = mapa;
  }
  getKey() {
    return this.k;
  }
  getValue() {
    return this.v;
  }
  setValue(v: Qualquer) {
    const antigo = this.v;
    this.v = v;
    this.mapa?.put(this.k, v);
    return antigo;
  }
  equals(o: Qualquer) {
    return o instanceof JEntry && jeq(this.k, o.getKey()) && jeq(this.v, o.getValue());
  }
  hashCode() {
    return jhash(this.k) ^ jhash(this.v);
  }
  toString() {
    return `${jstr(this.k)}=${jstr(this.v)}`;
  }
}

export class JMap {
  m = new Map<Qualquer, Qualquer>();
  __imutavel = false;
  protected __ordenado = false;
  protected __cmp: ((a: Qualquer, b: Qualquer) => number) | null = null;
  constructor(origem?: Qualquer) {
    if (origem instanceof JMap) for (const k of origem.chaves()) this.m.set(k, origem.m.get(k));
  }
  static of(...kv: Qualquer[]) {
    const r = new JMap();
    for (let i = 0; i < kv.length; i += 2) {
      if (r.m.has(kv[i])) throw new IllegalArgumentException(`chave duplicada: ${jstr(kv[i])}`);
      r.m.set(kv[i], kv[i + 1]);
    }
    r.__imutavel = true;
    return r;
  }
  static entry(k: Qualquer, v: Qualquer) {
    return new JEntry(k, v);
  }
  static copyOf(o: JMap) {
    const r = new JMap(o);
    r.__imutavel = true;
    return r;
  }
  static Entry = {
    comparingByKey: (c?: Qualquer) => {
      const f = paraFuncaoComparacao(c);
      return comparador((a, b) => f(a.getKey(), b.getKey()));
    },
    comparingByValue: (c?: Qualquer) => {
      const f = paraFuncaoComparacao(c);
      return comparador((a, b) => f(a.getValue(), b.getValue()));
    },
  };
  protected mutavel() {
    if (this.__imutavel) throw new UnsupportedOperationException('mapa imutável não pode ser alterado');
  }
  protected chaves(): Qualquer[] {
    const ks = [...this.m.keys()];
    return this.__ordenado ? ks.sort(this.__cmp ?? compararNatural) : ks;
  }
  put(k: Qualquer, v: Qualquer) {
    this.mutavel();
    if (this.__ordenado && k == null) throw new NullPointerException('TreeMap não aceita chave null');
    const antigo = this.m.has(k) ? this.m.get(k) : null;
    this.m.set(k, v);
    return antigo;
  }
  putAll(o: JMap) {
    for (const k of o.chaves()) this.put(k, o.m.get(k));
  }
  putIfAbsent(k: Qualquer, v: Qualquer) {
    const atual = this.get(k);
    if (atual == null) this.put(k, v);
    return atual;
  }
  get(k: Qualquer) {
    return this.m.has(k) ? this.m.get(k) : null;
  }
  getOrDefault(k: Qualquer, padrao: Qualquer) {
    return this.m.has(k) ? this.m.get(k) : padrao;
  }
  containsKey(k: Qualquer) {
    return this.m.has(k);
  }
  containsValue(v: Qualquer) {
    return [...this.m.values()].some((x) => jeq(x, v));
  }
  remove(k: Qualquer) {
    this.mutavel();
    const antigo = this.get(k);
    this.m.delete(k);
    return antigo;
  }
  __jreplace(k: Qualquer, v: Qualquer) {
    return this.m.has(k) ? this.put(k, v) : null;
  }
  merge(k: Qualquer, v: Qualquer, f: Qualquer) {
    this.mutavel();
    const atual = this.get(k);
    const novo = atual == null ? v : f(atual, v);
    if (novo == null) this.m.delete(k);
    else this.m.set(k, novo);
    return novo;
  }
  compute(k: Qualquer, f: Qualquer) {
    this.mutavel();
    const novo = f(k, this.get(k));
    if (novo == null) this.m.delete(k);
    else this.m.set(k, novo);
    return novo;
  }
  computeIfAbsent(k: Qualquer, f: Qualquer) {
    let atual = this.get(k);
    if (atual == null) {
      atual = f(k);
      if (atual != null) this.put(k, atual);
    }
    return atual;
  }
  computeIfPresent(k: Qualquer, f: Qualquer) {
    const atual = this.get(k);
    if (atual == null) return null;
    return this.compute(k, () => f(k, atual));
  }
  size() {
    return this.m.size;
  }
  isEmpty() {
    return this.m.size === 0;
  }
  clear() {
    this.mutavel();
    this.m.clear();
  }
  keySet() {
    return new JSet(this.chaves());
  }
  values() {
    return new JList(this.chaves().map((k) => this.m.get(k)));
  }
  entrySet() {
    return new JSet(this.chaves().map((k) => new JEntry(k, this.m.get(k), this)));
  }
  forEach(f: Qualquer) {
    for (const k of this.chaves()) f(k, this.m.get(k));
  }
  firstKey() {
    const ks = this.chaves();
    if (ks.length === 0) throw new NoSuchElementException(null);
    return ks[0];
  }
  lastKey() {
    const ks = this.chaves();
    if (ks.length === 0) throw new NoSuchElementException(null);
    return ks[ks.length - 1];
  }
  equals(o: Qualquer) {
    if (!(o instanceof JMap) || o.size() !== this.size()) return false;
    for (const [k, v] of this.m) if (!o.containsKey(k) || !jeq(v, o.get(k))) return false;
    return true;
  }
  hashCode() {
    let h = 0;
    for (const [k, v] of this.m) h = (h + (jhash(k) ^ jhash(v))) | 0;
    return h;
  }
  toString() {
    return `{${this.chaves().map((k) => `${jstr(k)}=${jstr(this.m.get(k))}`).join(', ')}}`;
  }
}
export class HashMap extends JMap {}
export class LinkedHashMap extends JMap {}
export class TreeMap extends JMap {
  constructor(origem?: Qualquer) {
    super(origem instanceof JMap ? origem : undefined);
    this.__ordenado = true;
    if (origem != null && !(origem instanceof JMap)) this.__cmp = paraFuncaoComparacao(origem);
  }
}

// ── Set ──────────────────────────────────────────────────────────────────
export class JSet {
  s = new Set<Qualquer>();
  __imutavel = false;
  protected __ordenado = false;
  protected __cmp: ((a: Qualquer, b: Qualquer) => number) | null = null;
  constructor(origem?: Qualquer) {
    if (origem != null && typeof origem !== 'number' && typeof origem !== 'function') {
      for (const x of iteravel(origem)) this.adicionar(x);
    }
  }
  static of(...xs: Qualquer[]) {
    const r = new JSet(xs);
    if (r.size() !== xs.length) throw new IllegalArgumentException('elemento duplicado em Set.of');
    r.__imutavel = true;
    return r;
  }
  static copyOf(c: Qualquer) {
    const r = new JSet(c);
    r.__imutavel = true;
    return r;
  }
  protected mutavel() {
    if (this.__imutavel) throw new UnsupportedOperationException('conjunto imutável não pode ser alterado');
  }
  private buscar(x: Qualquer): Qualquer {
    if (this.s.has(x)) return x;
    if (x !== null && typeof x === 'object') for (const y of this.s) if (jeq(x, y)) return y;
    return undefined;
  }
  private adicionar(x: Qualquer) {
    if (this.buscar(x) !== undefined || (x === undefined && this.s.has(x))) return false;
    this.s.add(x);
    return true;
  }
  protected itens(): Qualquer[] {
    const xs = [...this.s];
    return this.__ordenado ? xs.sort(this.__cmp ?? compararNatural) : xs;
  }
  add(x: Qualquer) {
    this.mutavel();
    return this.adicionar(x);
  }
  addAll(c: Qualquer) {
    this.mutavel();
    let mudou = false;
    for (const x of iteravel(c)) mudou = this.adicionar(x) || mudou;
    return mudou;
  }
  remove(x: Qualquer) {
    this.mutavel();
    const y = this.buscar(x);
    if (y === undefined) return false;
    this.s.delete(y);
    return true;
  }
  removeIf(p: Qualquer) {
    this.mutavel();
    let mudou = false;
    for (const x of [...this.s]) if (p(x)) mudou = this.s.delete(x) || mudou;
    return mudou;
  }
  retainAll(c: Qualquer) {
    const outros = iteravel(c);
    return this.removeIf((x: Qualquer) => !outros.some((o) => jeq(o, x)));
  }
  removeAll(c: Qualquer) {
    const outros = iteravel(c);
    return this.removeIf((x: Qualquer) => outros.some((o) => jeq(o, x)));
  }
  contains(x: Qualquer) {
    return this.buscar(x) !== undefined;
  }
  containsAll(c: Qualquer) {
    return iteravel(c).every((x) => this.contains(x));
  }
  size() {
    return this.s.size;
  }
  isEmpty() {
    return this.s.size === 0;
  }
  clear() {
    this.mutavel();
    this.s.clear();
  }
  first() {
    const xs = this.itens();
    if (xs.length === 0) throw new NoSuchElementException(null);
    return xs[0];
  }
  last() {
    const xs = this.itens();
    if (xs.length === 0) throw new NoSuchElementException(null);
    return xs[xs.length - 1];
  }
  stream() {
    return new JStream(this.itens());
  }
  forEach(f: Qualquer) {
    for (const x of this.itens()) f(x);
  }
  iterator() {
    return new JList(this.itens()).iterator();
  }
  [Symbol.iterator]() {
    return this.itens()[Symbol.iterator]();
  }
  toArray() {
    return this.itens();
  }
  equals(o: Qualquer) {
    return o instanceof JSet && o.size() === this.size() && this.itens().every((x) => o.contains(x));
  }
  hashCode() {
    return this.itens().reduce((h, x) => (h + jhash(x)) | 0, 0);
  }
  toString() {
    return `[${this.itens().map(jstr).join(', ')}]`;
  }
}
export class HashSet extends JSet {}
export class LinkedHashSet extends JSet {}
export class TreeSet extends JSet {
  constructor(origem?: Qualquer) {
    const ehComparador = typeof origem === 'function' || (origem != null && typeof origem.compare === 'function' && !(origem instanceof JList));
    super(ehComparador ? undefined : origem);
    this.__ordenado = true;
    if (ehComparador) this.__cmp = paraFuncaoComparacao(origem);
  }
}

// ── Optional ─────────────────────────────────────────────────────────────
export class JOptional {
  private v: Qualquer;
  private presente: boolean;
  private constructor(v: Qualquer, presente: boolean) {
    this.v = v;
    this.presente = presente;
  }
  static of(v: Qualquer) {
    if (v == null) throw new NullPointerException('Optional.of recebeu null');
    return new JOptional(v, true);
  }
  static ofNullable(v: Qualquer) {
    return v == null ? JOptional.empty() : new JOptional(v, true);
  }
  static empty() {
    return new JOptional(null, false);
  }
  isPresent() {
    return this.presente;
  }
  isEmpty() {
    return !this.presente;
  }
  get() {
    if (!this.presente) throw new NoSuchElementException('No value present');
    return this.v;
  }
  getAsDouble() {
    return this.get();
  }
  getAsInt() {
    return this.get();
  }
  getAsLong() {
    return this.get();
  }
  orElse(padrao: Qualquer) {
    return this.presente ? this.v : padrao;
  }
  orElseGet(f: Qualquer) {
    return this.presente ? this.v : f();
  }
  orElseThrow(f?: Qualquer) {
    if (this.presente) return this.v;
    throw f ? f() : new NoSuchElementException('No value present');
  }
  ifPresent(f: Qualquer) {
    if (this.presente) f(this.v);
  }
  ifPresentOrElse(f: Qualquer, senao: Qualquer) {
    if (this.presente) f(this.v);
    else senao();
  }
  map(f: Qualquer) {
    return this.presente ? JOptional.ofNullable(f(this.v)) : this;
  }
  flatMap(f: Qualquer) {
    return this.presente ? f(this.v) : this;
  }
  filter(p: Qualquer) {
    return this.presente && p(this.v) ? this : JOptional.empty();
  }
  equals(o: Qualquer) {
    return o instanceof JOptional && o.presente === this.presente && jeq(o.v, this.v);
  }
  toString() {
    return this.presente ? `Optional[${jstr(this.v)}]` : 'Optional.empty';
  }
}

// ── Stream ───────────────────────────────────────────────────────────────
function estatisticas(xs: number[]) {
  const soma = xs.reduce((s, x) => s + x, 0);
  return {
    getSum: () => soma,
    getCount: () => xs.length,
    getAverage: () => (xs.length ? soma / xs.length : 0),
    getMax: () => (xs.length ? Math.max(...xs) : Number.NEGATIVE_INFINITY),
    getMin: () => (xs.length ? Math.min(...xs) : Number.POSITIVE_INFINITY),
  };
}

export class JStream {
  private a: Qualquer[];
  constructor(a: Qualquer[]) {
    this.a = a;
  }
  static of(...xs: Qualquer[]) {
    return new JStream(xs);
  }
  static empty() {
    return new JStream([]);
  }
  static concat(x: JStream, y: JStream) {
    return new JStream([...x.a, ...y.a]);
  }
  static range(a: number, b: number) {
    const r: number[] = [];
    for (let i = a; i < b; i++) r.push(i);
    return new JStream(r);
  }
  static rangeClosed(a: number, b: number) {
    return JStream.range(a, b + 1);
  }
  filter(p: Qualquer) {
    return new JStream(this.a.filter((x) => p(x)));
  }
  map(f: Qualquer) {
    return new JStream(this.a.map((x) => f(x)));
  }
  mapToDouble(f: Qualquer) {
    return this.map(f);
  }
  mapToInt(f: Qualquer) {
    return this.map(f);
  }
  mapToLong(f: Qualquer) {
    return this.map(f);
  }
  mapToObj(f: Qualquer) {
    return this.map(f);
  }
  asDoubleStream() {
    return this;
  }
  boxed() {
    return this;
  }
  flatMap(f: Qualquer) {
    return new JStream(this.a.flatMap((x) => {
      const r = f(x);
      return r instanceof JStream ? r.a : iteravel(r);
    }));
  }
  distinct() {
    const r: Qualquer[] = [];
    for (const x of this.a) if (!r.some((y) => jeq(x, y))) r.push(x);
    return new JStream(r);
  }
  sorted(c?: Qualquer) {
    return new JStream(this.a.slice().sort(paraFuncaoComparacao(c)));
  }
  limit(n: number) {
    if (n < 0) throw new IllegalArgumentException(String(n));
    return new JStream(this.a.slice(0, n));
  }
  skip(n: number) {
    return new JStream(this.a.slice(n));
  }
  peek(f: Qualquer) {
    this.a.forEach((x) => f(x));
    return this;
  }
  forEach(f: Qualquer) {
    this.a.forEach((x) => f(x));
  }
  forEachOrdered(f: Qualquer) {
    this.forEach(f);
  }
  collect(coletor: Qualquer) {
    if (typeof coletor !== 'function') throw new IllegalArgumentException('collect espera um Collector (ex: Collectors.toList())');
    return coletor(this.a);
  }
  toList() {
    return JList.of(...this.a);
  }
  toArray() {
    return this.a.slice();
  }
  reduce(...args: Qualquer[]) {
    if (args.length === 1) {
      if (this.a.length === 0) return JOptional.empty();
      return JOptional.of(this.a.reduce((x, y) => args[0](x, y)));
    }
    return this.a.reduce((x, y) => args[1](x, y), args[0]);
  }
  count() {
    return this.a.length;
  }
  sum() {
    return this.a.reduce((s, x) => s + x, 0);
  }
  average() {
    return this.a.length === 0 ? JOptional.empty() : JOptional.of(this.sum() / this.a.length);
  }
  max(c?: Qualquer) {
    const f = paraFuncaoComparacao(c);
    if (this.a.length === 0) return JOptional.empty();
    return JOptional.of(this.a.reduce((m, x) => (f(m, x) >= 0 ? m : x)));
  }
  min(c?: Qualquer) {
    const f = paraFuncaoComparacao(c);
    if (this.a.length === 0) return JOptional.empty();
    return JOptional.of(this.a.reduce((m, x) => (f(m, x) <= 0 ? m : x)));
  }
  anyMatch(p: Qualquer) {
    return this.a.some((x) => p(x));
  }
  allMatch(p: Qualquer) {
    return this.a.every((x) => p(x));
  }
  noneMatch(p: Qualquer) {
    return !this.anyMatch(p);
  }
  findFirst() {
    return this.a.length === 0 ? JOptional.empty() : JOptional.ofNullable(this.a[0]);
  }
  findAny() {
    return this.findFirst();
  }
  summaryStatistics() {
    return estatisticas(this.a);
  }
  iterator() {
    return new JList(this.a).iterator();
  }
}

// ── Collectors ───────────────────────────────────────────────────────────
const paraLista = (xs: Qualquer[]) => new ArrayList(xs);
const soma = (f: Qualquer) => (xs: Qualquer[]) => xs.reduce((s, x) => s + f(x), 0);
const media = (f: Qualquer) => (xs: Qualquer[]) => (xs.length ? soma(f)(xs) / xs.length : 0);

export const Collectors = {
  toList: () => paraLista,
  toUnmodifiableList: () => (xs: Qualquer[]) => JList.of(...xs),
  toSet: () => (xs: Qualquer[]) => new HashSet(xs),
  toUnmodifiableSet: () => (xs: Qualquer[]) => JSet.copyOf(xs),
  toCollection: (fabrica: Qualquer) => (xs: Qualquer[]) => {
    const c = fabrica();
    for (const x of xs) c.add(x);
    return c;
  },
  joining: (sep: Qualquer = '', prefixo: Qualquer = '', sufixo: Qualquer = '') => (xs: Qualquer[]) =>
    String(prefixo) + xs.map(jstr).join(String(sep)) + String(sufixo),
  counting: () => (xs: Qualquer[]) => xs.length,
  summingDouble: soma,
  summingInt: soma,
  summingLong: soma,
  averagingDouble: media,
  averagingInt: media,
  averagingLong: media,
  summarizingDouble: (f: Qualquer) => (xs: Qualquer[]) => estatisticas(xs.map((x) => f(x))),
  summarizingInt: (f: Qualquer) => (xs: Qualquer[]) => estatisticas(xs.map((x) => f(x))),
  mapping: (f: Qualquer, depois: Qualquer) => (xs: Qualquer[]) => depois(xs.map((x) => f(x))),
  filtering: (p: Qualquer, depois: Qualquer) => (xs: Qualquer[]) => depois(xs.filter((x) => p(x))),
  reducing: (identidade: Qualquer, op: Qualquer) => (xs: Qualquer[]) => xs.reduce((a, b) => op(a, b), identidade),
  maxBy: (c: Qualquer) => (xs: Qualquer[]) => new JStream(xs).max(c),
  minBy: (c: Qualquer) => (xs: Qualquer[]) => new JStream(xs).min(c),
  groupingBy: (...args: Qualquer[]) => (xs: Qualquer[]) => {
    const chave = args[0];
    const fabrica = args.length === 3 ? args[1] : null;
    const depois = args.length === 3 ? args[2] : args.length === 2 ? args[1] : paraLista;
    const grupos = new Map<Qualquer, Qualquer[]>();
    for (const x of xs) {
      const k = chave(x);
      if (k == null) throw new NullPointerException('groupingBy: a função de agrupamento devolveu null');
      if (!grupos.has(k)) grupos.set(k, []);
      grupos.get(k)!.push(x);
    }
    const r = fabrica ? fabrica() : new HashMap();
    for (const [k, itens] of grupos) r.put(k, depois(itens));
    return r;
  },
  partitioningBy: (p: Qualquer, depois: Qualquer = paraLista) => (xs: Qualquer[]) => {
    const r = new HashMap();
    r.put(false, depois(xs.filter((x) => !p(x))));
    r.put(true, depois(xs.filter((x) => p(x))));
    return r;
  },
  toMap: (fk: Qualquer, fv: Qualquer, juntar?: Qualquer, fabrica?: Qualquer) => (xs: Qualquer[]) => {
    const r = fabrica ? fabrica() : new HashMap();
    for (const x of xs) {
      const k = fk(x);
      const v = fv(x);
      if (r.containsKey(k)) {
        if (!juntar) {
          throw new IllegalStateException(`Duplicate key ${jstr(k)} (attempted merging values ${jstr(r.get(k))} and ${jstr(v)})`);
        }
        r.put(k, juntar(r.get(k), v));
      } else r.put(k, v);
    }
    return r;
  },
};

// ── String, StringBuilder e wrappers ─────────────────────────────────────
export function formatar(fmt: string, args: Qualquer[]): string {
  let i = 0;
  return String(fmt).replace(/%([-#+ 0,(]*)(\d+)?(?:\.(\d+))?([sSdfnbcx%])/g, (_m, flags: string, largura?: string, precisao?: string, conv?: string) => {
    if (conv === '%') return '%';
    if (conv === 'n') return '\n';
    const arg = args[i++];
    let s: string;
    const agrupar = (txt: string) => {
      const [inteiro, dec] = txt.split('.');
      const comPontos = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return dec !== undefined ? `${comPontos}.${dec}` : comPontos;
    };
    switch (conv) {
      case 'd':
        s = String(Math.trunc(Number(arg)));
        if (flags.includes(',')) s = agrupar(s);
        break;
      case 'f':
        s = Number(arg).toFixed(precisao ? Number(precisao) : 6);
        if (flags.includes(',')) s = agrupar(s);
        break;
      case 'x':
        s = Math.trunc(Number(arg)).toString(16);
        break;
      case 'b':
        s = String(arg != null && arg !== false);
        break;
      case 'S':
        s = jstr(arg).toUpperCase();
        break;
      default:
        s = jstr(arg);
        if (precisao) s = s.slice(0, Number(precisao));
    }
    if (flags.includes('+') && (conv === 'd' || conv === 'f') && Number(arg) >= 0) s = `+${s}`;
    if (largura) {
      const n = Number(largura);
      s = flags.includes('-') ? s.padEnd(n) : s.padStart(n, flags.includes('0') ? '0' : ' ');
    }
    return s;
  });
}

export const JString = {
  valueOf: (x: Qualquer) => (Array.isArray(x) ? x.join('') : jstr(x)),
  copyValueOf: (x: Qualquer[]) => x.join(''),
  format: (fmt: string, ...args: Qualquer[]) => formatar(fmt, args),
  join: (sep: Qualquer, ...itens: Qualquer[]) => {
    const lista = itens.length === 1 && itens[0] != null && typeof itens[0] === 'object' ? iteravel(itens[0]) : itens;
    return lista.map(jstr).join(String(sep));
  },
};

export class StringBuilder {
  private s: string;
  constructor(x?: Qualquer) {
    this.s = x == null || typeof x === 'number' ? '' : String(x);
  }
  append(x: Qualquer) {
    this.s += Array.isArray(x) ? x.join('') : jstr(x);
    return this;
  }
  insert(i: number, x: Qualquer) {
    this.s = this.s.slice(0, i) + jstr(x) + this.s.slice(i);
    return this;
  }
  reverse() {
    this.s = [...this.s].reverse().join('');
    return this;
  }
  delete(a: number, b: number) {
    this.s = this.s.slice(0, a) + this.s.slice(b);
    return this;
  }
  deleteCharAt(i: number) {
    indiceValido(i, this.s.length);
    return this.delete(i, i + 1);
  }
  __jreplace(a: number, b: number, txt: string) {
    this.s = this.s.slice(0, a) + txt + this.s.slice(b);
    return this;
  }
  setCharAt(i: number, c: string) {
    indiceValido(i, this.s.length);
    this.s = this.s.slice(0, i) + c + this.s.slice(i + 1);
  }
  setLength(n: number) {
    this.s = n <= this.s.length ? this.s.slice(0, n) : this.s.padEnd(n, '\0');
  }
  get length() {
    return this.s.length;
  }
  charAt(i: number) {
    indiceValido(i, this.s.length);
    return this.s[i];
  }
  indexOf(x: string) {
    return this.s.indexOf(x);
  }
  substring(a: number, b?: number) {
    return this.s.substring(a, b);
  }
  isEmpty() {
    return this.s.length === 0;
  }
  toString() {
    return this.s;
  }
}

function inteiroEstrito(s: Qualquer, min: number, max: number): number {
  const txt = s == null ? 'null' : String(s);
  if (!/^[+-]?\d+$/.test(txt)) throw new NumberFormatException(`For input string: "${txt}"`);
  const n = Number(txt);
  if (n < min || n > max) throw new NumberFormatException(`For input string: "${txt}"`);
  return n;
}

const estaticosInteiros = (min: number, max: number) => ({
  MAX_VALUE: max,
  MIN_VALUE: min,
  parseInt: (s: Qualquer) => inteiroEstrito(s, min, max),
  parseLong: (s: Qualquer) => inteiroEstrito(s, min, max),
  valueOf: (x: Qualquer) => (typeof x === 'string' ? inteiroEstrito(x, min, max) : Math.trunc(x)),
  compare: (a: number, b: number) => compararNatural(a, b),
  sum: (a: number, b: number) => a + b,
  max: (a: number, b: number) => Math.max(a, b),
  min: (a: number, b: number) => Math.min(a, b),
  signum: (a: number) => Math.sign(a),
  abs: (a: number) => Math.abs(a),
  toString: (x: number) => String(x),
});
export const Integer = estaticosInteiros(-2147483648, 2147483647);
export const Long = estaticosInteiros(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
export const Short = estaticosInteiros(-32768, 32767);
export const Byte = estaticosInteiros(-128, 127);

function decimalEstrito(s: Qualquer): number {
  const txt = s == null ? '' : String(s).trim();
  if (s == null) throw new NullPointerException('parseDouble recebeu null');
  if (txt === 'NaN') return NaN;
  if (/^[+-]?Infinity$/.test(txt)) return Number(txt);
  if (!/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?[dDfF]?$/.test(txt)) throw new NumberFormatException(`For input string: "${s}"`);
  return Number(txt.replace(/[dDfF]$/, ''));
}
export const Double = {
  MAX_VALUE: Number.MAX_VALUE,
  MIN_VALUE: Number.MIN_VALUE,
  POSITIVE_INFINITY: Number.POSITIVE_INFINITY,
  NEGATIVE_INFINITY: Number.NEGATIVE_INFINITY,
  NaN: Number.NaN,
  parseDouble: decimalEstrito,
  valueOf: (x: Qualquer) => (typeof x === 'string' ? decimalEstrito(x) : Number(x)),
  compare: (a: number, b: number) => compararNatural(a, b),
  sum: (a: number, b: number) => a + b,
  max: (a: number, b: number) => Math.max(a, b),
  min: (a: number, b: number) => Math.min(a, b),
  isNaN: (a: number) => Number.isNaN(a),
  isInfinite: (a: number) => a === Infinity || a === -Infinity,
  isFinite: (a: number) => Number.isFinite(a),
  toString: (x: number) => String(x),
};
export const Float = { ...Double, parseFloat: decimalEstrito };

export const JBoolean = {
  TRUE: true,
  FALSE: false,
  parseBoolean: (s: Qualquer) => s != null && String(s).toLowerCase() === 'true',
  valueOf: (x: Qualquer) => (typeof x === 'string' ? x.toLowerCase() === 'true' : !!x),
  compare: (a: boolean, b: boolean) => compararNatural(a, b),
  logicalAnd: (a: boolean, b: boolean) => a && b,
  logicalOr: (a: boolean, b: boolean) => a || b,
  toString: (b: boolean) => String(b),
};

export const Character = {
  isDigit: (c: string) => /^\p{Nd}$/u.test(c),
  isLetter: (c: string) => /^\p{L}$/u.test(c),
  isLetterOrDigit: (c: string) => /^[\p{L}\p{Nd}]$/u.test(c),
  isAlphabetic: (c: string) => /^\p{L}$/u.test(c),
  isUpperCase: (c: string) => c !== c.toLowerCase() && c === c.toUpperCase(),
  isLowerCase: (c: string) => c !== c.toUpperCase() && c === c.toLowerCase(),
  isWhitespace: (c: string) => /^\s$/.test(c),
  toUpperCase: (c: string) => c.toUpperCase(),
  toLowerCase: (c: string) => c.toLowerCase(),
  getNumericValue: (c: string) => (/^\d$/.test(c) ? Number(c) : -1),
  valueOf: (c: string) => c,
  toString: (c: string) => c,
};

export const JMath = {
  PI: Math.PI,
  E: Math.E,
  abs: Math.abs,
  max: Math.max,
  min: Math.min,
  pow: Math.pow,
  sqrt: Math.sqrt,
  cbrt: Math.cbrt,
  ceil: Math.ceil,
  floor: Math.floor,
  round: (x: number) => Math.floor(x + 0.5),
  rint: (x: number) => Math.round(x),
  random: Math.random,
  signum: Math.sign,
  hypot: Math.hypot,
  log: Math.log,
  log10: Math.log10,
  exp: Math.exp,
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  floorDiv: (a: number, b: number) => {
    if (b === 0) throw new ArithmeticException('/ by zero');
    return Math.floor(a / b);
  },
  floorMod: (a: number, b: number) => {
    if (b === 0) throw new ArithmeticException('/ by zero');
    return ((a % b) + b) % b;
  },
};

export const Objects = {
  equals: jeq,
  hash: (...xs: Qualquer[]) => xs.reduce((h, x) => (31 * h + jhash(x)) | 0, 1),
  hashCode: (x: Qualquer) => jhash(x),
  isNull: (x: Qualquer) => x == null,
  nonNull: (x: Qualquer) => x != null,
  toString: (x: Qualquer, padrao?: Qualquer) => (x == null && padrao !== undefined ? padrao : jstr(x)),
  requireNonNull: (x: Qualquer, msg?: Qualquer) => {
    if (x == null) throw new NullPointerException(typeof msg === 'function' ? msg() : (msg ?? null));
    return x;
  },
  requireNonNullElse: (x: Qualquer, padrao: Qualquer) => (x == null ? padrao : x),
};

export const Arrays = {
  asList: (...xs: Qualquer[]) => new ArrayList(xs.length === 1 && Array.isArray(xs[0]) ? xs[0] : xs),
  stream: (arr: Qualquer[]) => new JStream(iteravel(arr).slice()),
  sort: (arr: Qualquer[], c?: Qualquer) => {
    arr.sort(paraFuncaoComparacao(c));
  },
  toString: (arr: Qualquer[]) => (arr == null ? 'null' : `[${arr.map(jstr).join(', ')}]`),
  fill: (arr: Qualquer[], v: Qualquer) => {
    arr.fill(v);
  },
  copyOf: (arr: Qualquer[], n: number) => {
    const padrao = arr.length > 0 && typeof arr[0] === 'number' ? 0 : null;
    return Array.from({ length: n }, (_, i) => (i < arr.length ? arr[i] : padrao));
  },
  copyOfRange: (arr: Qualquer[], a: number, b: number) => arr.slice(a, b),
  equals: (a: Qualquer[], b: Qualquer[]) => a === b || (a != null && b != null && a.length === b.length && a.every((x, i) => jeq(x, b[i]))),
};

export const Collections = {
  sort: (l: JList, c?: Qualquer) => l.sort(c),
  reverse: (l: JList) => {
    l.a.reverse();
  },
  shuffle: (l: JList) => {
    l.a.sort(() => Math.random() - 0.5);
  },
  max: (c: Qualquer, cmp?: Qualquer) => new JStream(iteravel(c)).max(cmp).orElseThrow(),
  min: (c: Qualquer, cmp?: Qualquer) => new JStream(iteravel(c)).min(cmp).orElseThrow(),
  frequency: (c: Qualquer, x: Qualquer) => iteravel(c).filter((y) => jeq(x, y)).length,
  unmodifiableList: (l: Qualquer) => JList.copyOf(l),
  unmodifiableSet: (s: Qualquer) => JSet.copyOf(s),
  unmodifiableMap: (m: JMap) => JMap.copyOf(m),
  emptyList: () => JList.of(),
  emptySet: () => JSet.of(),
  emptyMap: () => JMap.of(),
  singletonList: (x: Qualquer) => JList.of(x),
  nCopies: (n: number, x: Qualquer) => JList.of(...Array.from({ length: n }, () => x)),
  addAll: (c: Qualquer, ...xs: Qualquer[]) => c.addAll(xs),
};

export const JFunction = { identity: () => (x: Qualquer) => x };

// Marcadores de interfaces usados só em "instanceof" (o compilador apaga tipos em declarações).
export const Interfaces = {
  Collection: { __interface: (v: Qualquer) => v instanceof JList || v instanceof JSet },
  Iterable: { __interface: (v: Qualquer) => v != null && typeof v[Symbol.iterator] === 'function' },
  Comparable: { __interface: (v: Qualquer) => typeof v === 'string' || typeof v === 'number' || typeof v?.compareTo === 'function' },
  CharSequence: { __interface: (v: Qualquer) => typeof v === 'string' || v instanceof StringBuilder },
  Queue: { __interface: (v: Qualquer) => v instanceof JList },
  Deque: { __interface: (v: Qualquer) => v instanceof JList },
};

// ── Saída padrão ─────────────────────────────────────────────────────────
export class Saida {
  linhas: string[] = [];
  private atual: string | null = null;
  escrever(txt: string) {
    const partes = (String(this.atual ?? '') + txt).split('\n');
    this.atual = partes.pop() ?? '';
    this.linhas.push(...partes);
  }
  descarregar(): string[] {
    if (this.atual !== null && this.atual !== '') this.linhas.push(this.atual);
    this.atual = null;
    const r = this.linhas;
    this.linhas = [];
    return r;
  }
}

function criarSystem(saida: Saida) {
  const fluxo = {
    println: (...x: Qualquer[]) => saida.escrever(`${x.length ? jstr(x[0]) : ''}\n`),
    print: (x: Qualquer) => saida.escrever(jstr(x)),
    printf: (fmt: string, ...args: Qualquer[]) => {
      saida.escrever(formatar(fmt, args));
      return fluxo;
    },
    format: (fmt: string, ...args: Qualquer[]) => {
      saida.escrever(formatar(fmt, args));
      return fluxo;
    },
  };
  return {
    out: fluxo,
    err: fluxo,
    currentTimeMillis: () => Date.now(),
    nanoTime: () => Math.round(performance.now() * 1e6),
    lineSeparator: () => '\n',
  };
}

// ── Helpers chamados pelo código compilado ───────────────────────────────
export function __int(x: Qualquer) {
  if (x == null) return x;
  if (typeof x === 'string') return x.charCodeAt(0);
  if (typeof x !== 'number') return x;
  if (Number.isNaN(x)) return 0;
  return Math.trunc(x);
}

export function __idiv(a: number, b: number) {
  if (b === 0) throw new ArithmeticException('/ by zero');
  return Math.trunc(a / b);
}

export function __char(x: Qualquer) {
  return typeof x === 'number' ? String.fromCharCode(x) : x;
}

export function __newArray(dims: number[], padrao: Qualquer): Qualquer[] {
  const [n, ...resto] = dims;
  if (n < 0) throw new RuntimeException(`NegativeArraySizeException: ${n}`);
  return Array.from({ length: n }, () => (resto.length ? __newArray(resto, padrao) : padrao));
}

// Objetos que fazem papel de classe só com membros estáticos (Integer, Collectors...).
// Em "Integer::compareTo" o alvo é a classe, então o método é chamado no primeiro argumento.
const ESTATICOS = new WeakSet<object>();

export function __ref(alvo: Qualquer, nome: string) {
  return (...args: Qualquer[]) => {
    if (alvo != null && Object.prototype.hasOwnProperty.call(alvo, nome) && typeof alvo[nome] === 'function') {
      return alvo[nome](...args);
    }
    if (alvo != null && typeof alvo === 'object' && !ESTATICOS.has(alvo) && typeof alvo[nome] === 'function') {
      return alvo[nome](...args);
    }
    const [receptor, ...resto] = args;
    if (receptor == null) throw new NullPointerException(`não é possível chamar '${nome}' porque o valor é null`);
    if (nome === 'length' && typeof receptor === 'string') return receptor.length;
    if (typeof receptor[nome] !== 'function') throw new RuntimeException(`método '${nome}' não existe para esse objeto`);
    return receptor[nome](...resto);
  };
}

export function __ctor(C: Qualquer) {
  return (...args: Qualquer[]) => new C(...args);
}

const NUMERICOS = new Set<unknown>([Integer, Long, Short, Byte, Double, Float, Number]);
export function __tipo(T: Qualquer): Qualquer {
  if (T === JString) return { [Symbol.hasInstance]: (v: Qualquer) => typeof v === 'string' };
  if (NUMERICOS.has(T)) return { [Symbol.hasInstance]: (v: Qualquer) => typeof v === 'number' };
  if (T === JBoolean) return { [Symbol.hasInstance]: (v: Qualquer) => typeof v === 'boolean' };
  if (T === Character) return { [Symbol.hasInstance]: (v: Qualquer) => typeof v === 'string' && v.length === 1 };
  if (T === Object) return { [Symbol.hasInstance]: (v: Qualquer) => v != null };
  if (T === JList) return { [Symbol.hasInstance]: (v: Qualquer) => v instanceof JList };
  if (T === JMap) return { [Symbol.hasInstance]: (v: Qualquer) => v instanceof JMap };
  if (T === JSet) return { [Symbol.hasInstance]: (v: Qualquer) => v instanceof JSet };
  if (T != null && typeof T.__interface === 'function') return { [Symbol.hasInstance]: T.__interface };
  if (T != null && T.__enumNome) return { [Symbol.hasInstance]: (v: Qualquer) => v != null && v.__enumTipo === T };
  return T;
}

export function __iter(x: Qualquer) {
  if (x == null) throw new NullPointerException('não é possível percorrer com for-each: o valor é null');
  if (x instanceof JMap) throw new RuntimeException('um Map não é iterável: use entrySet(), keySet() ou values()');
  return x;
}

export function __sw(x: Qualquer) {
  return x != null && typeof x === 'object' && x.__enumTipo ? x.name() : x;
}

export function __enum(nomeTipo: string, nomes: string[]) {
  const tipo: Qualquer = { __enumNome: nomeTipo };
  const valores = nomes.map((n, i) => {
    const constante: Qualquer = {
      __enumTipo: tipo,
      name: () => n,
      ordinal: () => i,
      toString: () => n,
      hashCode: () => i,
      compareTo: (o: Qualquer) => i - o.ordinal(),
    };
    constante.equals = (o: Qualquer) => o === constante;
    return Object.freeze(constante);
  });
  nomes.forEach((n, i) => {
    tipo[n] = valores[i];
  });
  tipo.values = () => valores.slice();
  tipo.valueOf = (s: Qualquer) => {
    const i = nomes.indexOf(s);
    if (i < 0) throw new IllegalArgumentException(`No enum constant ${nomeTipo}.${jstr(s)}`);
    return valores[i];
  };
  ESTATICOS.add(tipo);
  return Object.freeze(tipo);
}

// ── Classes de apoio das questões (Lancamento / TipoLancamento) ─────────
export const TipoLancamento = __enum('TipoLancamento', ['RECEITA', 'DESPESA']);

const privado = (campo: string, getter: string) => () => {
  throw new RuntimeException(`${campo} tem acesso privado em Lancamento: use ${getter}()`);
};

export class Lancamento {
  #descricao: Qualquer;
  #valor: Qualquer;
  #tipo: Qualquer;
  #categoria: Qualquer;
  constructor(descricao: Qualquer, valor: Qualquer, tipo: Qualquer, categoria: Qualquer) {
    this.#descricao = descricao;
    this.#valor = valor;
    this.#tipo = tipo;
    this.#categoria = categoria;
  }
  getDescricao() {
    return this.#descricao;
  }
  getValor() {
    return this.#valor;
  }
  getTipo() {
    return this.#tipo;
  }
  getCategoria() {
    return this.#categoria;
  }
  toString() {
    return `Lancamento{descricao='${this.#descricao}', valor=${this.#valor}, tipo=${jstr(this.#tipo)}, categoria='${this.#categoria}'}`;
  }
}
for (const [campo, getter] of [['descricao', 'getDescricao'], ['valor', 'getValor'], ['tipo', 'getTipo'], ['categoria', 'getCategoria']]) {
  Object.defineProperty(Lancamento.prototype, campo, { get: privado(campo, getter), configurable: true });
}

// ── Patches de protótipo (String.equals, Number.compareTo, lambda.test...) ─
let instalado = false;
export function instalarPrototipos() {
  if (instalado) return;
  instalado = true;
  const definir = (proto: object, metodos: Record<string, Qualquer>) => {
    for (const [nome, fn] of Object.entries(metodos)) {
      Object.defineProperty(proto, nome, { value: fn, writable: true, configurable: true, enumerable: false });
    }
  };

  definir(Object.prototype, {
    equals(this: object, o: Qualquer) {
      return this === o;
    },
    hashCode(this: object) {
      return hashIdentidade(this);
    },
    getClass(this: object) {
      const nome = (this as Qualquer).constructor?.name ?? 'Object';
      return { getSimpleName: () => nome, getName: () => nome };
    },
  });

  definir(String.prototype, {
    equals(this: string, o: Qualquer) {
      return typeof o === 'string' && o === this;
    },
    equalsIgnoreCase(this: string, o: Qualquer) {
      return typeof o === 'string' && o.toLowerCase() === this.toLowerCase();
    },
    isEmpty(this: string) {
      return this.length === 0;
    },
    isBlank(this: string) {
      return this.trim().length === 0;
    },
    contains(this: string, s: Qualquer) {
      if (s == null) throw new NullPointerException('contains recebeu null');
      return this.includes(String(s));
    },
    compareTo(this: string, o: string) {
      return this < o ? -1 : this > o ? 1 : 0;
    },
    compareToIgnoreCase(this: string, o: string) {
      const a = this.toLowerCase();
      const b = o.toLowerCase();
      return a < b ? -1 : a > b ? 1 : 0;
    },
    strip(this: string) {
      return this.trim();
    },
    stripLeading(this: string) {
      return this.trimStart();
    },
    stripTrailing(this: string) {
      return this.trimEnd();
    },
    matches(this: string, re: string) {
      return new RegExp(`^(?:${re})$`).test(this);
    },
    __jreplace(this: string, a: Qualquer, b: Qualquer) {
      return this.split(String(a)).join(String(b));
    },
    __jreplaceAll(this: string, re: string, rep: string) {
      return this.replace(new RegExp(re, 'g'), rep);
    },
    __jsplit(this: string, re: string, limite = 0) {
      if (this.length === 0) return [''];
      const regex = new RegExp(re, 'g');
      const partes: string[] = [];
      let ultimo = 0;
      let achou = false;
      let m: RegExpExecArray | null;
      while ((m = regex.exec(this)) !== null) {
        if (m[0].length === 0) {
          regex.lastIndex++;
          if (m.index === 0 || m.index >= this.length) continue;
        }
        if (limite > 0 && partes.length === limite - 1) break;
        achou = true;
        partes.push(this.slice(ultimo, m.index));
        ultimo = m.index + m[0].length;
      }
      partes.push(this.slice(ultimo));
      if (achou && limite === 0) while (partes.length > 0 && partes[partes.length - 1] === '') partes.pop();
      return partes;
    },
    toCharArray(this: string) {
      return [...this];
    },
    chars(this: string) {
      return new JStream([...this].map((c) => c.charCodeAt(0)));
    },
    formatted(this: string, ...args: Qualquer[]) {
      return formatar(this, args);
    },
    hashCode(this: string) {
      let h = 0;
      for (let i = 0; i < this.length; i++) h = (31 * h + this.charCodeAt(i)) | 0;
      return h;
    },
  });

  definir(Number.prototype, {
    equals(this: number, o: Qualquer) {
      return typeof o === 'number' && (o === this || (Number.isNaN(o) && Number.isNaN(this)));
    },
    compareTo(this: number, o: number) {
      return compararNatural(this, o);
    },
    intValue(this: number) {
      return Math.trunc(this);
    },
    longValue(this: number) {
      return Math.trunc(this);
    },
    doubleValue(this: number) {
      return this;
    },
    floatValue(this: number) {
      return this;
    },
    hashCode(this: number) {
      return Math.trunc(this) | 0;
    },
  });

  definir(Boolean.prototype, {
    equals(this: boolean, o: Qualquer) {
      return o === this;
    },
    booleanValue(this: boolean) {
      return this;
    },
    compareTo(this: boolean, o: boolean) {
      return compararNatural(this, o);
    },
    hashCode(this: boolean) {
      return this ? 1231 : 1237;
    },
  });

  definir(Array.prototype, {
    clone(this: Qualquer[]) {
      return this.slice();
    },
  });

  // Interfaces funcionais do Java: uma lambda vira função JS, então os
  // métodos dessas interfaces (test, accept, get, compare...) chamam a própria
  // função. "apply" é renomeado para __japply pelo compilador, porque
  // Function.prototype.apply já existe no JS com outro significado.
  definir(Function.prototype, {
    __japply(this: Qualquer, ...a: Qualquer[]) {
      return this(...a);
    },
    applyAsDouble(this: Qualquer, ...a: Qualquer[]) {
      return this(...a);
    },
    applyAsInt(this: Qualquer, ...a: Qualquer[]) {
      return this(...a);
    },
    applyAsLong(this: Qualquer, ...a: Qualquer[]) {
      return this(...a);
    },
    test(this: Qualquer, ...a: Qualquer[]) {
      return this(...a);
    },
    accept(this: Qualquer, ...a: Qualquer[]) {
      this(...a);
    },
    get(this: Qualquer) {
      return this();
    },
    run(this: Qualquer) {
      this();
    },
    compare(this: Qualquer, a: Qualquer, b: Qualquer) {
      return this(a, b);
    },
    negate(this: Qualquer) {
      return (...a: Qualquer[]) => !this(...a);
    },
    and(this: Qualquer, outro: Qualquer) {
      return (...a: Qualquer[]) => this(...a) && outro(...a);
    },
    or(this: Qualquer, outro: Qualquer) {
      return (...a: Qualquer[]) => this(...a) || outro(...a);
    },
    andThen(this: Qualquer, depois: Qualquer) {
      return (...a: Qualquer[]) => {
        const r = this(...a);
        return r === undefined ? depois(...a) : depois(r);
      };
    },
    compose(this: Qualquer, antes: Qualquer) {
      return (...a: Qualquer[]) => this(antes(...a));
    },
    reversed(this: Qualquer) {
      const f = paraFuncaoComparacao(this);
      return comparador((a, b) => f(b, a));
    },
    thenComparing(this: Qualquer, outro: Qualquer, cmpChave?: Qualquer) {
      const f = paraFuncaoComparacao(this);
      const g = comparadorDe(outro, cmpChave);
      return comparador((a, b) => f(a, b) || g(a, b));
    },
    thenComparingDouble(this: Qualquer, chave: Qualquer) {
      return (this as Qualquer).thenComparing(chave);
    },
    thenComparingInt(this: Qualquer, chave: Qualquer) {
      return (this as Qualquer).thenComparing(chave);
    },
    thenComparingLong(this: Qualquer, chave: Qualquer) {
      return (this as Qualquer).thenComparing(chave);
    },
  });
}

/** Nomes visíveis para o código compilado, como se fossem os imports do Java. */
export function criarAmbiente(saida: Saida): Record<string, Qualquer> {
  const estaticosStream = { of: JStream.of, empty: JStream.empty, concat: JStream.concat, range: JStream.range, rangeClosed: JStream.rangeClosed };
  for (const o of [JString, Integer, Long, Short, Byte, Double, Float, JBoolean, Character, JMath, Objects, Arrays, Collections, Collectors, Comparator, JFunction, estaticosStream]) {
    ESTATICOS.add(o);
  }
  return {
    String: JString,
    Integer,
    Long,
    Short,
    Byte,
    Double,
    Float,
    Boolean: JBoolean,
    Character,
    Math: JMath,
    System: criarSystem(saida),
    Objects,
    Arrays,
    Collections,
    Collectors,
    Comparator,
    Optional: JOptional,
    OptionalDouble: JOptional,
    OptionalInt: JOptional,
    OptionalLong: JOptional,
    Stream: estaticosStream,
    IntStream: estaticosStream,
    DoubleStream: estaticosStream,
    LongStream: estaticosStream,
    List: JList,
    ArrayList,
    LinkedList,
    ArrayDeque: LinkedList,
    Stack: LinkedList,
    Map: JMap,
    HashMap,
    LinkedHashMap,
    TreeMap,
    Set: JSet,
    HashSet,
    LinkedHashSet,
    TreeSet,
    StringBuilder,
    StringBuffer: StringBuilder,
    Function: JFunction,
    UnaryOperator: JFunction,
    ...Interfaces,
    Throwable,
    Exception,
    RuntimeException,
    IllegalArgumentException,
    IllegalStateException,
    NullPointerException,
    ArithmeticException,
    UnsupportedOperationException,
    IndexOutOfBoundsException,
    ArrayIndexOutOfBoundsException,
    NoSuchElementException,
    NumberFormatException,
    ClassCastException,
    StackOverflowError,
    Lancamento,
    TipoLancamento,
    __int,
    __idiv,
    __char,
    __newArray,
    __ref,
    __ctor,
    __tipo,
    __jex,
    __sw,
    __iter,
    __enum,
  };
}
