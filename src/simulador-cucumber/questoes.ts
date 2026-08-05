import type { Questao } from '../simulador/types';

// As 3 questões ativas do simulador Cucumber, no modelo Java/Selenium/Page
// Object: a feature (Gherkin) já vem pronta e é só leitura (featureLinhas); o
// candidato recebe duas classes pré-montadas — Page (localizadores +
// construtor prontos) e Steps (@Dado/@Quando/@Então/@E já anotados, Page já
// instanciada no construtor) — e só precisa preencher o CORPO dos métodos,
// que vêm com um throw de "pendente" (por isso um envio sem alterações
// sempre falha, igual aos outros dois simuladores). O WebDriver (`driver`)
// e os utilitários `By`/`Assert` já vêm prontos, injetados pelo motor —
// o candidato nunca instancia nada disso.
//
// Convenção fixa em toda questão: as classes sempre se chamam `Page` e
// `Steps` (o motor sempre faz `new Steps(driver)` no final). O texto de
// cada anotação (`// @Dado("...")` etc.) precisa bater exatamente com a
// linha correspondente da feature — é assim que o motor liga uma coisa à
// outra, igual à reflection real do Cucumber-JVM.
//
// Existem mais 5 questões fora deste conjunto ativo, guardadas em
// ./questoes-arquivadas.ts para uso futuro (ex: montar uma prova mais longa,
// ou trocar alguma questão daqui por outra do arquivo).

function pendente(metodo: string): string {
  return `// TODO: apague a linha abaixo e escreva sua implementação aqui\n    throw new Error('Implemente o método ${metodo}().');`;
}

export const QUESTOES: Questao[] = [
  {
    numero: 1,
    titulo: 'Deve exibir a tela de identificação ao acessar a aplicação',
    contexto:
      'Antes de cada execução, o simulador já limpa os dados salvos do app sob teste e recarrega a página sozinho. Você não precisa (nem deve) fazer isso no seu código — comece direto pelo cenário abaixo.',
    dado: 'que acesso a aplicação',
    entao: 'devo ver a tela de identificação',
    dica: 'driver já vem pronto no construtor — não instancie nada, só use this.driver.',
    localizadores: '[data-testid="identificacao-page"] / [data-testid="input-nome"] / [data-testid="input-email"]',
    comandos: ['driver.get', 'driver.findElement', '.isDisplayed()', 'Assert.assertTrue'],
    passos: [
      'Acesse a aplicação.',
      'Confirme que a tela de identificação fica visível.',
      'Confirme que os campos de nome completo e e-mail aparecem na tela.',
    ],
    featureLinhas: [
      'Dado que acesso a aplicação',
      'Então devo ver a tela de identificação',
      'E devo ver o campo de nome completo',
      'E devo ver o campo de e-mail',
    ],
    codigoInicial: `class Page {
  constructor(driver) {
    this.driver = driver;
    // TODO: monte aqui os localizadores (this.campo = By.cssSelector('...')) — veja "Localizadores sugeridos" acima.
  }

  acessarPagina() {
    ${pendente('acessarPagina')}
  }

  telaIdentificacaoEstaVisivel() {
    ${pendente('telaIdentificacaoEstaVisivel')}
  }

  campoNomeEstaVisivel() {
    ${pendente('campoNomeEstaVisivel')}
  }

  campoEmailEstaVisivel() {
    ${pendente('campoEmailEstaVisivel')}
  }
}

class Steps {
  constructor(driver) {
    this.page = new Page(driver);
  }

  // @Dado("que acesso a aplicação")
  queAcessoAAplicacao() {
    ${pendente('queAcessoAAplicacao')}
  }

  // @Então("devo ver a tela de identificação")
  async devoVerATelaDeIdentificacao() {
    ${pendente('devoVerATelaDeIdentificacao')}
  }

  // @E("devo ver o campo de nome completo")
  async devoVerOCampoDeNomeCompleto() {
    ${pendente('devoVerOCampoDeNomeCompleto')}
  }

  // @E("devo ver o campo de e-mail")
  async devoVerOCampoDeEmail() {
    ${pendente('devoVerOCampoDeEmail')}
  }
}`,
  },
  {
    numero: 2,
    titulo: 'Deve avançar para o Dashboard ao preencher nome e e-mail válidos',
    contexto: 'O caminho feliz da identificação.',
    dado: 'que acesso a aplicação',
    entao: 'devo ver o card de saldo',
    dica: '[data-testid="card-saldo"] só existe depois da identificação.',
    localizadores:
      '[data-testid="input-nome"] / [data-testid="input-email"] / [data-testid="btn-iniciar"] / [data-testid="card-saldo"]',
    comandos: ['driver.findElement', '.sendKeys()', '.click()', '.isDisplayed()', 'Assert.assertTrue'],
    passos: [
      'Acesse a aplicação.',
      'Preencha nome e e-mail válidos.',
      'Clique no botão de iniciar avaliação.',
      'Confirme que o card de saldo (já no Dashboard) fica visível.',
    ],
    featureLinhas: [
      'Dado que acesso a aplicação',
      'Quando preencho o nome com "Fulano de Tal"',
      'E preencho o e-mail com "fulano@exemplo.com"',
      'E clico em iniciar avaliação',
      'Então devo ver o card de saldo',
    ],
    codigoInicial: `class Page {
  constructor(driver) {
    this.driver = driver;
    // TODO: monte aqui os localizadores (this.campo = By.cssSelector('...')) — veja "Localizadores sugeridos" acima.
  }

  acessarPagina() {
    ${pendente('acessarPagina')}
  }

  preencherNome(nome) {
    ${pendente('preencherNome')}
  }

  preencherEmail(email) {
    ${pendente('preencherEmail')}
  }

  clicarIniciar() {
    ${pendente('clicarIniciar')}
  }

  cardSaldoEstaVisivel() {
    ${pendente('cardSaldoEstaVisivel')}
  }
}

class Steps {
  constructor(driver) {
    this.page = new Page(driver);
  }

  // @Dado("que acesso a aplicação")
  queAcessoAAplicacao() {
    ${pendente('queAcessoAAplicacao')}
  }

  // @Quando("preencho o nome com {string}")
  preenchoONomeCom(nome) {
    ${pendente('preenchoONomeCom')}
  }

  // @E("preencho o e-mail com {string}")
  preenchoOEmailCom(email) {
    ${pendente('preenchoOEmailCom')}
  }

  // @E("clico em iniciar avaliação")
  clicoEmIniciarAvaliacao() {
    ${pendente('clicoEmIniciarAvaliacao')}
  }

  // @Então("devo ver o card de saldo")
  async devoVerOCardDeSaldo() {
    ${pendente('devoVerOCardDeSaldo')}
  }
}`,
  },
  {
    numero: 3,
    titulo: 'Deve cadastrar uma receita com sucesso',
    contexto: 'Fluxo completo de cadastro, do zero, incluindo a identificação.',
    dado: 'que acesso a aplicação',
    entao: 'devo ver o lançamento "Salario" na lista',
    dica: '[data-testid="input-data"] já vem com uma data padrão — dê .clear() antes de preencher com sendKeys(), senão o valor novo fica colado no antigo.',
    localizadores:
      '[data-testid="input-nome"] / [data-testid="input-email"] / [data-testid="btn-iniciar"] / [data-testid="btn-nova-transacao"] / [data-testid="tipo-receita"] / [data-testid="input-descricao"] / [data-testid="input-valor"] / [data-testid="select-categoria"] / [data-testid="input-data"] / [data-testid="btn-salvar"] / [data-testid="nav-lancamentos"] / [data-testid="linha-lancamento"]',
    comandos: ['driver.findElement', '.sendKeys()', '.clear()', '.click()', '.getText()', 'Assert.assertTrue'],
    passos: [
      'Acesse a aplicação, identifique-se e abra uma nova transação.',
      'Escolha o tipo receita e preencha descrição, valor, categoria e data.',
      'Salve e vá para a lista de lançamentos.',
      'Confirme que o lançamento cadastrado aparece na lista.',
    ],
    featureLinhas: [
      'Dado que acesso a aplicação',
      'E preencho o nome com "Fulano de Tal"',
      'E preencho o e-mail com "fulano@exemplo.com"',
      'E clico em iniciar avaliação',
      'Quando clico em nova transação',
      'E clico no tipo receita',
      'E preencho a descrição com "Salario"',
      'E preencho o valor com "1000"',
      'E seleciono a categoria "Salário"',
      'E preencho a data com "2024-01-10"',
      'E clico em salvar',
      'E clico em lançamentos',
      'Então devo ver o lançamento "Salario" na lista',
    ],
    codigoInicial: `class Page {
  constructor(driver) {
    this.driver = driver;
    // TODO: monte aqui os localizadores (this.campo = By.cssSelector('...')) — veja "Localizadores sugeridos" acima.
  }

  acessarPagina() {
    ${pendente('acessarPagina')}
  }

  preencherNome(nome) {
    ${pendente('preencherNome')}
  }

  preencherEmail(email) {
    ${pendente('preencherEmail')}
  }

  clicarIniciar() {
    ${pendente('clicarIniciar')}
  }

  clicarNovaTransacao() {
    ${pendente('clicarNovaTransacao')}
  }

  clicarTipoReceita() {
    ${pendente('clicarTipoReceita')}
  }

  preencherDescricao(descricao) {
    ${pendente('preencherDescricao')}
  }

  preencherValor(valor) {
    ${pendente('preencherValor')}
  }

  selecionarCategoria(categoria) {
    ${pendente('selecionarCategoria')}
  }

  preencherData(data) {
    ${pendente('preencherData')}
  }

  clicarSalvar() {
    ${pendente('clicarSalvar')}
  }

  clicarLancamentos() {
    ${pendente('clicarLancamentos')}
  }

  listaContemLancamento(descricao) {
    ${pendente('listaContemLancamento')}
  }
}

class Steps {
  constructor(driver) {
    this.page = new Page(driver);
  }

  // @Dado("que acesso a aplicação")
  queAcessoAAplicacao() {
    ${pendente('queAcessoAAplicacao')}
  }

  // @E("preencho o nome com {string}")
  preenchoONomeCom(nome) {
    ${pendente('preenchoONomeCom')}
  }

  // @E("preencho o e-mail com {string}")
  preenchoOEmailCom(email) {
    ${pendente('preenchoOEmailCom')}
  }

  // @E("clico em iniciar avaliação")
  clicoEmIniciarAvaliacao() {
    ${pendente('clicoEmIniciarAvaliacao')}
  }

  // @Quando("clico em nova transação")
  clicoEmNovaTransacao() {
    ${pendente('clicoEmNovaTransacao')}
  }

  // @E("clico no tipo receita")
  clicoNoTipoReceita() {
    ${pendente('clicoNoTipoReceita')}
  }

  // @E("preencho a descrição com {string}")
  preenchoADescricaoCom(descricao) {
    ${pendente('preenchoADescricaoCom')}
  }

  // @E("preencho o valor com {string}")
  preenchoOValorCom(valor) {
    ${pendente('preenchoOValorCom')}
  }

  // @E("seleciono a categoria {string}")
  selecionoACategoria(categoria) {
    ${pendente('selecionoACategoria')}
  }

  // @E("preencho a data com {string}")
  preenchoADataCom(data) {
    ${pendente('preenchoADataCom')}
  }

  // @E("clico em salvar")
  clicoEmSalvar() {
    ${pendente('clicoEmSalvar')}
  }

  // @E("clico em lançamentos")
  clicoEmLancamentos() {
    ${pendente('clicoEmLancamentos')}
  }

  // @Então("devo ver o lançamento {string} na lista")
  async devoVerOLancamentoNaLista(descricao) {
    ${pendente('devoVerOLancamentoNaLista')}
  }
}`,
  },
];
