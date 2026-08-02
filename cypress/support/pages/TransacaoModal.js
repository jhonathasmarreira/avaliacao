import Locators from '../locators/locators';

class TransacaoModal {
  selecionarTipo(tipo) {
    // tipo: 'receita' | 'despesa'
    const el = tipo === 'receita' ? Locators.modalTransacao.tipoReceita : Locators.modalTransacao.tipoDespesa;
    cy.get(el).click();
  }

  preencher({ descricao, valor, categoria, data } = {}) {
    if (descricao !== undefined) cy.get(Locators.modalTransacao.inputDescricao).clear().type(descricao);
    if (valor !== undefined) cy.get(Locators.modalTransacao.inputValor).clear().type(String(valor));
    if (categoria !== undefined) cy.get(Locators.modalTransacao.selectCategoria).select(categoria);
    if (data !== undefined) cy.get(Locators.modalTransacao.inputData).clear().type(data);
  }

  salvar() {
    cy.get(Locators.modalTransacao.btnSalvar).click();
  }
}

export default new TransacaoModal();
