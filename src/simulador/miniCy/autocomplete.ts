import type { CompletionContext, CompletionResult } from '@codemirror/autocomplete';

// Autocomplete "estilo IDE" para a API cy.* do simulador. Como esses comandos
// não existem em nenhuma lib real, o TypeScript/CodeMirror não tem como
// sugeri-los sozinho — por isso a lista é mantida à mão aqui, espelhando o
// que existe em ./commands.ts e ./chainable.ts.

const COMANDOS_RAIZ = [
  { label: 'get', detail: "cy.get(seletor)" },
  { label: 'contains', detail: "cy.contains(texto)" },
  { label: 'visit', detail: "cy.visit(caminho)" },
  { label: 'reload', detail: "cy.reload()" },
  { label: 'wait', detail: "cy.wait(ms)" },
  { label: 'clearLocalStorage', detail: "cy.clearLocalStorage()" },
  { label: 'Dado', detail: "cy.Dado(texto)" },
  { label: 'Quando', detail: "cy.Quando(texto)" },
  { label: 'Entao', detail: "cy.Entao(texto)" },
  { label: 'E', detail: "cy.E(texto)" },
];

const METODOS_ENCADEADOS = [
  { label: 'click', detail: "elemento.click()" },
  { label: 'type', detail: "elemento.type(texto)" },
  { label: 'clear', detail: "elemento.clear()" },
  { label: 'select', detail: "elemento.select(valor)" },
  { label: 'should', detail: "elemento.should(assertion, ...args)" },
  { label: 'contains', detail: "elemento.contains(texto)" },
  { label: 'first', detail: "elemento.first()" },
  { label: 'eq', detail: "elemento.eq(indice)" },
];

export function cyCompletionSource(context: CompletionContext): CompletionResult | null {
  const raiz = context.matchBefore(/cy\.\w*/);
  if (raiz) {
    return {
      from: raiz.from + 3,
      options: COMANDOS_RAIZ.map((c) => ({ label: c.label, type: 'method', detail: c.detail })),
      validFor: /^\w*$/,
    };
  }

  const encadeado = context.matchBefore(/\.\w*/);
  if (encadeado) {
    return {
      from: encadeado.from + 1,
      options: METODOS_ENCADEADOS.map((c) => ({ label: c.label, type: 'method', detail: c.detail })),
      validFor: /^\w*$/,
    };
  }

  return null;
}
