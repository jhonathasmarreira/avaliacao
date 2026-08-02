/// <reference types="cypress" />
import Locators from '../support/locators/locators';
import Identificacao from '../support/pages/IdentificacaoPage';
import DashboardPage from '../support/pages/DashboardPage';
import LancamentosPage from '../support/pages/LancamentosPage';
import TransacaoModal from '../support/pages/TransacaoModal';

// ─────────────────────────────────────────────────────────────────────────
// AVALIAÇÃO TÉCNICA — CYPRESS
//
// Este arquivo tem 20 questões (uma por "it"). Cada uma já tem o objetivo
// descrito nos comentários Dado/Quando/Então e indica quais Page Objects e
// Locators usar. O corpo de cada teste começa com cy.implementeAqui(), que
// SEMPRE falha — é o seu sinal de "questão pendente". Apague essa linha e
// escreva a implementação real por baixo.
//
// Infraestrutura já pronta (não faz parte das questões):
//   - Locators (cypress/support/locators/locators.js)
//   - Identificacao, DashboardPage, LancamentosPage, TransacaoModal
//     (cypress/support/pages/*.js)
//   - cy.Dado/cy.Quando/cy.Entao/cy.E — apenas logs, não fazem assert
//
// O resultado final (aprovados/reprovados) e os dados de
// cypress/fixtures/candidato.json são enviados por e-mail automaticamente
// pelo GitHub Action ao final da execução. Preencha esse fixture com seu
// nome e e-mail reais antes de rodar/enviar a avaliação.
// ─────────────────────────────────────────────────────────────────────────

describe('Avaliação Técnica - Cypress', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('[Questão 01] - Deve exibir a tela de identificação ao acessar a aplicação', () => {
    cy.Dado('que o candidato acessa a aplicação pela primeira vez, sem dados salvos');
    cy.Entao('o sistema deve exibir a tela de identificação com os campos Nome completo e E-mail');
    // Dica: Locators.identificacao.page / inputNome / inputEmail / btnIniciar
    cy.implementeAqui();
  });

  it('[Questão 02] - Deve exibir erro ao tentar avançar com o nome vazio', () => {
    cy.Dado('que o candidato está na tela de identificação');
    cy.Quando('preenche apenas o e-mail e clica em "Iniciar avaliação"');
    cy.Entao('o sistema deve exibir uma mensagem de erro no campo nome e não avançar');
    // Dica: Locators.identificacao.erroNome
    cy.implementeAqui();
  });

  it('[Questão 03] - Deve exibir erro ao tentar avançar com o e-mail vazio', () => {
    cy.Dado('que o candidato está na tela de identificação');
    cy.Quando('preenche apenas o nome e clica em "Iniciar avaliação"');
    cy.Entao('o sistema deve exibir uma mensagem de erro no campo e-mail e não avançar');
    // Dica: Locators.identificacao.erroEmail
    cy.implementeAqui();
  });

  it('[Questão 04] - Deve exibir erro ao informar um e-mail em formato inválido', () => {
    cy.Dado('que o candidato está na tela de identificação');
    cy.Quando('preenche o nome e digita um e-mail sem "@" (ex: "emailinvalido")');
    cy.E('clica em "Iniciar avaliação"');
    cy.Entao('o sistema deve exibir uma mensagem de erro de formato inválido e não avançar');
    cy.implementeAqui();
  });

  it('[Questão 05] - Deve avançar para o Dashboard ao preencher nome e e-mail válidos', () => {
    cy.Dado('que o candidato está na tela de identificação');
    cy.Quando('preenche nome completo e e-mail válidos e confirma');
    cy.Entao('o sistema deve exibir o Dashboard');
    // Dica: Identificacao.identificar('Fulano de Tal', 'fulano@exemplo.com')
    cy.implementeAqui();
  });

  it('[Questão 06] - Deve exibir os cards zerados no Dashboard quando não há lançamentos', () => {
    cy.Dado('que o candidato acabou de se identificar e não possui lançamentos');
    cy.Entao('os cards de Receitas, Despesas e Saldo devem exibir R$ 0,00');
    // Dica: Identificacao.identificarComFixture(); Locators.dashboard.card*
    cy.implementeAqui();
  });

  it('[Questão 07] - Deve exibir o nome do candidato no menu lateral após a identificação', () => {
    cy.Dado('que o candidato se identificou com um nome completo');
    cy.Entao('o menu lateral deve exibir esse nome');
    // Dica: Locators.layout.userNome
    cy.implementeAqui();
  });

  it('[Questão 08] - Deve navegar do Dashboard para Lançamentos pelo menu lateral', () => {
    cy.Dado('que o candidato está no Dashboard');
    cy.Quando('clica no item "Lançamentos" do menu lateral');
    cy.Entao('a aplicação deve exibir a tela de Lançamentos');
    // Dica: DashboardPage.irParaLancamentos()
    cy.implementeAqui();
  });

  it('[Questão 09] - Deve abrir o modal de novo lançamento a partir do Dashboard', () => {
    cy.Dado('que o candidato está no Dashboard');
    cy.Quando('clica no botão "+ Nova transação"');
    cy.Entao('o modal de nova transação deve ser exibido');
    // Dica: DashboardPage.abrirNovaTransacao() / Locators.modalTransacao.modal
    cy.implementeAqui();
  });

  it('[Questão 10] - Deve exibir erro ao salvar um lançamento sem descrição', () => {
    cy.Dado('que o modal de novo lançamento está aberto');
    cy.Quando('preenche apenas o valor e tenta salvar, deixando a descrição em branco');
    cy.Entao('o sistema deve exibir um erro no campo descrição e não fechar o modal');
    // Dica: TransacaoModal.preencher / Locators.modalTransacao.erroDescricao
    cy.implementeAqui();
  });

  it('[Questão 11] - Deve exibir erro ao salvar um lançamento com valor zero ou negativo', () => {
    cy.Dado('que o modal de novo lançamento está aberto');
    cy.Quando('preenche a descrição e informa um valor igual a 0');
    cy.E('tenta salvar');
    cy.Entao('o sistema deve exibir um erro no campo valor e não fechar o modal');
    cy.implementeAqui();
  });

  it('[Questão 12] - Deve cadastrar uma receita com sucesso', () => {
    cy.Dado('que o candidato preenche o modal de novo lançamento com tipo Receita');
    cy.Quando('informa descrição, valor, categoria e data válidos e salva');
    cy.Entao('o novo lançamento deve aparecer na lista de Lançamentos');
    // Dica: TransacaoModal.selecionarTipo('receita')
    cy.implementeAqui();
  });

  it('[Questão 13] - Deve cadastrar uma despesa com sucesso', () => {
    cy.Dado('que o candidato preenche o modal de novo lançamento com tipo Despesa');
    cy.Quando('informa descrição, valor, categoria e data válidos e salva');
    cy.Entao('o novo lançamento deve aparecer na lista de Lançamentos');
    cy.implementeAqui();
  });

  it('[Questão 14] - Deve atualizar o card de Saldo no Dashboard após um novo lançamento', () => {
    cy.Dado('que o candidato está no Dashboard sem lançamentos');
    cy.Quando('cadastra uma receita de R$ 100,00');
    cy.Entao('o card de Saldo deve passar a exibir R$ 100,00');
    cy.implementeAqui();
  });

  it('[Questão 15] - Deve editar um lançamento existente e refletir a alteração na lista', () => {
    cy.Dado('que existe um lançamento cadastrado');
    cy.Quando('o candidato clica em editar, altera a descrição e salva');
    cy.Entao('a lista de lançamentos deve exibir a descrição atualizada');
    // Dica: Locators.lancamentos.btnEditar
    cy.implementeAqui();
  });

  it('[Questão 16] - Deve excluir um lançamento após confirmação', () => {
    cy.Dado('que existe um lançamento cadastrado');
    cy.Quando('o candidato clica em excluir e confirma a exclusão');
    cy.Entao('o lançamento não deve mais aparecer na lista');
    // Dica: Locators.lancamentos.btnExcluir / Locators.modalExclusao.btnConfirmar
    cy.implementeAqui();
  });

  it('[Questão 17] - Deve cancelar a exclusão de um lançamento', () => {
    cy.Dado('que existe um lançamento cadastrado e o modal de exclusão está aberto');
    cy.Quando('o candidato clica em "Cancelar"');
    cy.Entao('o lançamento deve continuar aparecendo na lista');
    // Dica: Locators.modalExclusao.btnCancelar
    cy.implementeAqui();
  });

  it('[Questão 18] - Deve filtrar os lançamentos por tipo', () => {
    cy.Dado('que existem lançamentos de receita e de despesa cadastrados');
    cy.Quando('o candidato filtra a lista por tipo "Receita"');
    cy.Entao('somente lançamentos de receita devem ser exibidos');
    // Dica: LancamentosPage.filtrarPorTipo('income')
    cy.implementeAqui();
  });

  it('[Questão 19] - Deve exibir mensagem de lista vazia quando não houver lançamentos', () => {
    cy.Dado('que o candidato está na tela de Lançamentos sem nenhum lançamento cadastrado');
    cy.Entao('o sistema deve exibir uma mensagem informando que a lista está vazia');
    // Dica: Locators.lancamentos.listaVazia
    cy.implementeAqui();
  });

  it('[Questão 20] - Deve manter os lançamentos após recarregar a página', () => {
    cy.Dado('que o candidato cadastrou um lançamento');
    cy.Quando('a página é recarregada (cy.reload())');
    cy.Entao('o lançamento cadastrado deve continuar aparecendo na lista (persistência local)');
    cy.implementeAqui();
  });
});
