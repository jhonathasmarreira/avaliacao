import type { CompletionContext, CompletionResult } from '@codemirror/autocomplete';
import { ELEMENTOS_DISPONIVEIS } from './gherkinCatalogo';

// Autocomplete "estilo IDE" para o editor Gherkin: sugere a palavra-chave no
// início da linha (Dado/Quando/Então/E) e os nomes de elementos do
// dicionário quando o cursor está dentro de aspas — mesma ideia do
// autocomplete do editor de código do simulador Cypress, só que aqui o
// vocabulário é o catálogo de steps em vez de uma API JS.

const PALAVRAS_CHAVE = ['Dado', 'Quando', 'Então', 'E', 'Mas'];

export function gherkinCompletionSource(context: CompletionContext): CompletionResult | null {
  const aspas = context.matchBefore(/"[^"]*$/);
  if (aspas) {
    return {
      from: aspas.from + 1,
      options: ELEMENTOS_DISPONIVEIS.map((nome) => ({ label: nome, type: 'text' })),
      validFor: /^[^"]*$/,
    };
  }

  const linha = context.state.doc.lineAt(context.pos);
  const textoAteCursor = linha.text.slice(0, context.pos - linha.from);
  if (/^[A-Za-zÀ-ÿ]*$/.test(textoAteCursor)) {
    const palavra = context.matchBefore(/[A-Za-zÀ-ÿ]*$/);
    if (palavra) {
      return {
        from: palavra.from,
        options: PALAVRAS_CHAVE.map((p) => ({ label: p, type: 'keyword' })),
        validFor: /^[A-Za-zÀ-ÿ]*$/,
      };
    }
  }

  return null;
}
