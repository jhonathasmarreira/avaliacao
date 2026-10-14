import { snippetCompletion, type Completion, type CompletionContext, type CompletionResult } from '@codemirror/autocomplete';

// Autocomplete "estilo IDE" pro subconjunto de Java aceito pelo compilador
// do simulador (mesma ideia dos editores Cypress e Cucumber): membros
// estáticos depois de uma classe conhecida (Collectors., Comparator., ...),
// métodos de instância (coleções, String, Stream, Lancamento) depois de
// qualquer outro ".", e palavras-chave, tipos, snippets e identificadores do
// próprio código no resto.

type Membro = [label: string, detail: string];

const ESTATICOS: Record<string, Membro[]> = {
  Collectors: [
    ['toList', 'Collectors.toList()'],
    ['toSet', 'Collectors.toSet()'],
    ['toMap', 'Collectors.toMap(chave, valor[, merge])'],
    ['groupingBy', 'Collectors.groupingBy(classificador[, downstream])'],
    ['summingDouble', 'Collectors.summingDouble(mapper)'],
    ['summingInt', 'Collectors.summingInt(mapper)'],
    ['averagingDouble', 'Collectors.averagingDouble(mapper)'],
    ['counting', 'Collectors.counting()'],
    ['joining', 'Collectors.joining([separador])'],
    ['mapping', 'Collectors.mapping(mapper, downstream)'],
    ['partitioningBy', 'Collectors.partitioningBy(predicado)'],
  ],
  Comparator: [
    ['comparing', 'Comparator.comparing(chave)'],
    ['comparingDouble', 'Comparator.comparingDouble(chave)'],
    ['comparingInt', 'Comparator.comparingInt(chave)'],
    ['naturalOrder', 'Comparator.naturalOrder()'],
    ['reverseOrder', 'Comparator.reverseOrder()'],
  ],
  Math: [
    ['abs', 'Math.abs(x)'],
    ['max', 'Math.max(a, b)'],
    ['min', 'Math.min(a, b)'],
    ['round', 'Math.round(x)'],
    ['floor', 'Math.floor(x)'],
    ['ceil', 'Math.ceil(x)'],
    ['pow', 'Math.pow(base, exp)'],
    ['sqrt', 'Math.sqrt(x)'],
  ],
  List: [['of', 'List.of(...)'], ['copyOf', 'List.copyOf(colecao)']],
  Set: [['of', 'Set.of(...)']],
  Map: [['of', 'Map.of(k1, v1, ...)'], ['entry', 'Map.entry(k, v)']],
  Arrays: [['asList', 'Arrays.asList(...)'], ['sort', 'Arrays.sort(array)'], ['stream', 'Arrays.stream(array)'], ['toString', 'Arrays.toString(array)']],
  Collections: [
    ['sort', 'Collections.sort(lista[, comparator])'],
    ['emptyList', 'Collections.emptyList()'],
    ['emptyMap', 'Collections.emptyMap()'],
    ['unmodifiableList', 'Collections.unmodifiableList(lista)'],
    ['reverse', 'Collections.reverse(lista)'],
    ['max', 'Collections.max(colecao)'],
    ['min', 'Collections.min(colecao)'],
  ],
  Objects: [['equals', 'Objects.equals(a, b)'], ['isNull', 'Objects.isNull(x)'], ['nonNull', 'Objects.nonNull(x)'], ['requireNonNull', 'Objects.requireNonNull(x[, msg])'], ['hash', 'Objects.hash(...)']],
  Optional: [['of', 'Optional.of(valor)'], ['ofNullable', 'Optional.ofNullable(valor)'], ['empty', 'Optional.empty()']],
  String: [['valueOf', 'String.valueOf(x)'], ['format', 'String.format(formato, ...)'], ['join', 'String.join(separador, ...)']],
  Integer: [['parseInt', 'Integer.parseInt(texto)'], ['valueOf', 'Integer.valueOf(x)'], ['compare', 'Integer.compare(a, b)'], ['sum', 'Integer::sum'], ['MAX_VALUE', 'Integer.MAX_VALUE'], ['MIN_VALUE', 'Integer.MIN_VALUE']],
  Double: [['parseDouble', 'Double.parseDouble(texto)'], ['valueOf', 'Double.valueOf(x)'], ['compare', 'Double.compare(a, b)'], ['sum', 'Double::sum']],
  TipoLancamento: [['RECEITA', 'TipoLancamento.RECEITA'], ['DESPESA', 'TipoLancamento.DESPESA'], ['values', 'TipoLancamento.values()'], ['valueOf', 'TipoLancamento.valueOf(nome)']],
  System: [['out', 'System.out']],
  'System.out': [['println', 'System.out.println(x)'], ['print', 'System.out.print(x)'], ['printf', 'System.out.printf(formato, ...)']],
};

const METODOS_INSTANCIA: Membro[] = [
  // Lancamento
  ['getDescricao', 'lancamento.getDescricao(): String'],
  ['getValor', 'lancamento.getValor(): double'],
  ['getTipo', 'lancamento.getTipo(): TipoLancamento'],
  ['getCategoria', 'lancamento.getCategoria(): String'],
  // Collection / List
  ['add', 'lista.add(elemento)'],
  ['addAll', 'lista.addAll(colecao)'],
  ['get', 'lista.get(indice) / map.get(chave)'],
  ['set', 'lista.set(indice, elemento)'],
  ['remove', 'lista.remove(elemento)'],
  ['removeIf', 'lista.removeIf(predicado)'],
  ['size', 'colecao.size()'],
  ['isEmpty', 'colecao.isEmpty()'],
  ['contains', 'colecao.contains(elemento)'],
  ['indexOf', 'lista.indexOf(elemento)'],
  ['subList', 'lista.subList(de, ate)'],
  ['sort', 'lista.sort(comparator)'],
  ['forEach', 'colecao.forEach(acao)'],
  ['stream', 'colecao.stream()'],
  ['clear', 'colecao.clear()'],
  // Map
  ['put', 'map.put(chave, valor)'],
  ['getOrDefault', 'map.getOrDefault(chave, padrao)'],
  ['merge', 'map.merge(chave, valor, Double::sum)'],
  ['putIfAbsent', 'map.putIfAbsent(chave, valor)'],
  ['computeIfAbsent', 'map.computeIfAbsent(chave, k -> novo)'],
  ['containsKey', 'map.containsKey(chave)'],
  ['keySet', 'map.keySet()'],
  ['values', 'map.values()'],
  ['entrySet', 'map.entrySet()'],
  ['getKey', 'entry.getKey()'],
  ['getValue', 'entry.getValue()'],
  // Stream
  ['filter', 'stream.filter(predicado)'],
  ['map', 'stream.map(funcao)'],
  ['mapToDouble', 'stream.mapToDouble(funcao)'],
  ['mapToInt', 'stream.mapToInt(funcao)'],
  ['sorted', 'stream.sorted([comparator])'],
  ['limit', 'stream.limit(n)'],
  ['skip', 'stream.skip(n)'],
  ['distinct', 'stream.distinct()'],
  ['collect', 'stream.collect(Collectors...)'],
  ['toList', 'stream.toList()'],
  ['sum', 'stream.sum()'],
  ['count', 'stream.count()'],
  ['average', 'stream.average()'],
  ['max', 'stream.max(comparator)'],
  ['min', 'stream.min(comparator)'],
  ['anyMatch', 'stream.anyMatch(predicado)'],
  ['allMatch', 'stream.allMatch(predicado)'],
  ['noneMatch', 'stream.noneMatch(predicado)'],
  ['findFirst', 'stream.findFirst()'],
  ['reduce', 'stream.reduce(identidade, operador)'],
  // Optional
  ['orElse', 'optional.orElse(padrao)'],
  ['orElseThrow', 'optional.orElseThrow([fornecedor])'],
  ['isPresent', 'optional.isPresent()'],
  ['ifPresent', 'optional.ifPresent(acao)'],
  // Comparator
  ['reversed', 'comparator.reversed()'],
  ['thenComparing', 'comparator.thenComparing(chave)'],
  // String / Object
  ['equals', 'objeto.equals(outro)'],
  ['equalsIgnoreCase', 'texto.equalsIgnoreCase(outro)'],
  ['compareTo', 'a.compareTo(b)'],
  ['length', 'texto.length()'],
  ['trim', 'texto.trim()'],
  ['toUpperCase', 'texto.toUpperCase()'],
  ['toLowerCase', 'texto.toLowerCase()'],
  ['startsWith', 'texto.startsWith(prefixo)'],
  ['endsWith', 'texto.endsWith(sufixo)'],
  ['substring', 'texto.substring(inicio[, fim])'],
  ['split', 'texto.split(regex)'],
  ['replace', 'texto.replace(alvo, novo)'],
  ['charAt', 'texto.charAt(indice)'],
  ['toString', 'objeto.toString()'],
  ['hashCode', 'objeto.hashCode()'],
  ['name', 'enum.name()'],
  ['ordinal', 'enum.ordinal()'],
  ['getMessage', 'excecao.getMessage()'],
  // StringBuilder
  ['append', 'sb.append(x)'],
];

const PALAVRAS_CHAVE = [
  'public', 'private', 'protected', 'static', 'final', 'class', 'enum', 'interface', 'extends', 'implements',
  'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'break', 'continue',
  'new', 'this', 'null', 'true', 'false', 'try', 'catch', 'finally', 'throw', 'throws', 'instanceof', 'import', 'var', 'void',
];

const TIPOS = [
  'int', 'long', 'double', 'boolean', 'char', 'String', 'Integer', 'Double', 'Long', 'Boolean', 'Object',
  'List', 'ArrayList', 'LinkedList', 'Map', 'HashMap', 'LinkedHashMap', 'TreeMap', 'Set', 'HashSet', 'TreeSet',
  'Optional', 'Comparator', 'Collectors', 'Collections', 'Arrays', 'Objects', 'Math', 'StringBuilder', 'System',
  'Lancamento', 'TipoLancamento',
  'RuntimeException', 'IllegalArgumentException', 'IllegalStateException', 'NullPointerException',
  'UnsupportedOperationException', 'Exception',
];

const SNIPPETS: Completion[] = [
  snippetCompletion('System.out.println(${});', { label: 'sout', detail: 'System.out.println(...)', type: 'keyword' }),
  snippetCompletion('for (int ${i} = 0; ${i} < ${n}; ${i}++) {\n\t${}\n}', { label: 'fori', detail: 'laço com índice', type: 'keyword' }),
  snippetCompletion('for (${Tipo} ${item} : ${colecao}) {\n\t${}\n}', { label: 'foreach', detail: 'for-each', type: 'keyword' }),
  snippetCompletion('if (${}) {\n\t\n}', { label: 'if', detail: 'bloco if', type: 'keyword' }),
  snippetCompletion('try {\n\t${}\n} catch (${Exception} e) {\n\t\n}', { label: 'try', detail: 'try/catch', type: 'keyword' }),
];

const opcoes = (membros: Membro[], type: string): Completion[] =>
  membros.map(([label, detail]) => ({ label, detail, type }));

const OPCOES_BASE: Completion[] = [
  ...SNIPPETS,
  ...PALAVRAS_CHAVE.map((label) => ({ label, type: 'keyword' })),
  ...TIPOS.map((label) => ({ label, type: 'class' })),
];

export function javaCompletionSource(context: CompletionContext): CompletionResult | null {
  const estatico = context.matchBefore(/\b(System\.out|[A-Z]\w*)(\.|::)\w*/);
  if (estatico) {
    const [, raiz, sep] = /^(System\.out|[A-Z]\w*)(\.|::)/.exec(estatico.text)!;
    const membros = ESTATICOS[raiz];
    if (membros) {
      return {
        from: estatico.from + raiz.length + sep.length,
        options: opcoes(membros, 'method'),
        validFor: /^\w*$/,
      };
    }
  }

  const encadeado = context.matchBefore(/(\.|::)\w*/);
  if (encadeado) {
    const sep = encadeado.text.startsWith('::') ? 2 : 1;
    return {
      from: encadeado.from + sep,
      options: opcoes(METODOS_INSTANCIA, 'method'),
      validFor: /^\w*$/,
    };
  }

  const palavra = context.matchBefore(/\w+/);
  if (!palavra && !context.explicit) return null;
  if (palavra && palavra.from === palavra.to && !context.explicit) return null;

  const conhecidos = new Set(OPCOES_BASE.map((o) => o.label));
  const doDocumento = new Set<string>();
  for (const m of context.state.doc.toString().matchAll(/\b[A-Za-z_]\w{2,}\b/g)) {
    const nome = m[0];
    if (!conhecidos.has(nome) && nome !== palavra?.text) doDocumento.add(nome);
  }

  return {
    from: palavra ? palavra.from : context.pos,
    options: [...OPCOES_BASE, ...[...doDocumento].map((label) => ({ label, type: 'variable' }))],
    validFor: /^\w*$/,
  };
}
