import Locators from '../locators/locators';

class IdentificacaoPage {
  preencher(nomeCompleto, email) {
    cy.get(Locators.identificacao.inputNome).clear().type(nomeCompleto);
    cy.get(Locators.identificacao.inputEmail).clear().type(email);
  }

  confirmar() {
    cy.get(Locators.identificacao.btnIniciar).click();
  }

  identificar(nomeCompleto, email) {
    this.preencher(nomeCompleto, email);
    this.confirmar();
  }

  // Lê nome/e-mail do candidato em cypress/fixtures/candidato.json e
  // usa esses dados para preencher a tela de identificação. Esse é o
  // mesmo arquivo lido pelo GitHub Action para montar o e-mail final.
  identificarComFixture() {
    cy.fixture('candidato.json').then((candidato) => {
      this.identificar(candidato.nomeCompleto, candidato.email);
    });
  }
}

export default new IdentificacaoPage();
