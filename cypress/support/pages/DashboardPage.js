import Locators from '../locators/locators';

class DashboardPage {
  irParaLancamentos() {
    cy.get(Locators.layout.navLancamentos).click();
  }

  abrirNovaTransacao() {
    cy.get(Locators.dashboard.btnNovaTransacao).click();
  }
}

export default new DashboardPage();
