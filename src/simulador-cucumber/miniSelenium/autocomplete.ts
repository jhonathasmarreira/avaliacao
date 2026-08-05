import type { CompletionContext, CompletionResult } from '@codemirror/autocomplete';

// Autocomplete "estilo IDE" pra API driver/By/Assert, mesma ideia do
// autocomplete do editor cy.* do simulador Cypress: sugere os membros de
// driver/By/Assert depois de ".", e os métodos encadeáveis do Elemento
// (o que driver.findElement(...) devolve) depois de qualquer outro ".".

const MEMBROS_RAIZ: Record<string, { label: string; detail: string }[]> = {
  driver: [
    { label: 'get', detail: 'driver.get(caminho)' },
    { label: 'findElement', detail: 'driver.findElement(locator)' },
    { label: 'navigate', detail: 'driver.navigate().refresh()' },
  ],
  By: [{ label: 'cssSelector', detail: 'By.cssSelector(seletor)' }],
  Assert: [
    { label: 'assertEquals', detail: 'Assert.assertEquals(esperado, atual)' },
    { label: 'assertTrue', detail: 'Assert.assertTrue(condicao)' },
    { label: 'assertFalse', detail: 'Assert.assertFalse(condicao)' },
  ],
};

const METODOS_ELEMENTO = [
  { label: 'click', detail: 'elemento.click()' },
  { label: 'sendKeys', detail: 'elemento.sendKeys(texto)' },
  { label: 'clear', detail: 'elemento.clear()' },
  { label: 'selectByValue', detail: 'elemento.selectByValue(valor)' },
  { label: 'getText', detail: 'await elemento.getText()' },
  { label: 'isDisplayed', detail: 'await elemento.isDisplayed()' },
  { label: 'isEnabled', detail: 'await elemento.isEnabled()' },
];

export function seleniumCompletionSource(context: CompletionContext): CompletionResult | null {
  const raiz = context.matchBefore(/(driver|By|Assert)\.\w*/);
  if (raiz) {
    const nomeRaiz = raiz.text.split('.')[0];
    const opcoes = MEMBROS_RAIZ[nomeRaiz];
    if (opcoes) {
      return {
        from: raiz.from + nomeRaiz.length + 1,
        options: opcoes.map((o) => ({ label: o.label, type: 'method', detail: o.detail })),
        validFor: /^\w*$/,
      };
    }
  }

  const encadeado = context.matchBefore(/\.\w*/);
  if (encadeado) {
    return {
      from: encadeado.from + 1,
      options: METODOS_ELEMENTO.map((c) => ({ label: c.label, type: 'method', detail: c.detail })),
      validFor: /^\w*$/,
    };
  }

  return null;
}
