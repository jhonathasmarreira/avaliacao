import Locators from '../locators/locators';

class LancamentosPage {
  abrirNovoLancamento() {
    cy.get(Locators.lancamentos.btnNovoLancamento).click();
  }

  buscar(texto) {
    cy.get(Locators.lancamentos.inputBusca).clear().type(texto);
  }

  filtrarPorTipo(tipo) {
    // tipo: '' | 'income' | 'expense'
    cy.get(Locators.lancamentos.filtroTipo).select(tipo);
  }

  linhaPorDescricao(descricao) {
    return cy.contains(Locators.lancamentos.linha, descricao);
  }
}

export default new LancamentosPage();
