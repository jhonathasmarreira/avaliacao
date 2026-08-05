// Espelha o essencial de org.junit.Assert, usado dentro dos métodos @Então
// pra validar o que o driver leu da tela (getText/isDisplayed/isEnabled).

export const Assert = {
  assertEquals(esperado: unknown, atual: unknown): void {
    if (esperado !== atual) {
      throw new Error(`Assert.assertEquals falhou: esperado "${esperado}", encontrado "${atual}"`);
    }
  },
  assertTrue(condicao: boolean): void {
    if (!condicao) throw new Error('Assert.assertTrue falhou: condição era falsa');
  },
  assertFalse(condicao: boolean): void {
    if (condicao) throw new Error('Assert.assertFalse falhou: condição era verdadeira');
  },
};
