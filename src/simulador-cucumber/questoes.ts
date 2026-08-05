import type { Questao } from '../simulador/types';

// As 8 questões do simulador Cucumber, no modelo Java/Selenium/Page Object:
// a feature (Gherkin) já vem pronta e é só leitura (featureLinhas); o
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

function pendente(metodo: string): string {
  return `throw new Error('Implemente o método ${metodo}().');`;
}

export const QUESTOES: Questao[] = [
  {
    numero: 1,
    titulo: 'Deve exibir a tela de identificação ao acessar a aplicação',
    contexto:
      'Todo teste começa do zero: o motor limpa o armazenamento local do app sob teste e recarrega o iframe antes de cada execução — você não precisa (nem deve) fazer isso manualmente.',
    dado: 'que acesso a aplicação',
    entao: 'devo ver a tela de identificação',
    dica: 'driver já vem pronto no construtor — não instancie nada, só use this.driver.',
    localizadores:
      'this.telaIdentificacao → [data-testid="identificacao-page"]\n' +
      'this.campoNome → [data-testid="input-nome"]\n' +
      'this.campoEmail → [data-testid="input-email"]',
    comandos: ['driver.get', 'driver.findElement', '.isDisplayed()', 'Assert.assertTrue'],
    passos: [
      'Em Page.acessarPagina(), chame this.driver.get(\'/\').',
      'Em Page.telaIdentificacaoEstaVisivel() (e nos outros dois getters), retorne this.driver.findElement(<localizador>).isDisplayed() — não precisa de await aqui, só devolva a Promise.',
      'Em Steps, cada método @Dado/@Quando/@Então só chama o método correspondente da Page.',
      'Nos métodos @Então/@E que fazem asserção, use await pra pegar o valor real antes de passar pro Assert.',
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
    titulo: 'Deve exibir erro ao informar um e-mail em formato inválido',
    contexto:
      'Vai além do campo vazio: aqui o e-mail é preenchido, mas com um valor sem "@", ou seja, um formato inválido.',
    dado: 'que acesso a aplicação',
    entao: 'devo ver a mensagem de erro do e-mail',
    dica: 'Os métodos @Quando/@E que recebem valor da feature (ex: {string}) chegam como parâmetro do método — não precisa reler a feature.',
    localizadores:
      'this.campoNome → [data-testid="input-nome"]\n' +
      'this.campoEmail → [data-testid="input-email"]\n' +
      'this.botaoIniciar → [data-testid="btn-iniciar"]\n' +
      'this.erroEmail → [data-testid="erro-email"]',
    comandos: ['driver.findElement', '.sendKeys()', '.click()', '.isDisplayed()', 'Assert.assertTrue'],
    passos: [
      'Em Page.preencherNome(nome) e preencherEmail(email), use this.driver.findElement(<localizador>).sendKeys(<valor>) — não precisa de await, é encadeado igual clique.',
      'Em Page.clicarIniciar(), use this.driver.findElement(this.botaoIniciar).click().',
      'Em Page.erroEmailEstaVisivel(), retorne this.driver.findElement(this.erroEmail).isDisplayed().',
      'No Steps, os métodos @E preenchoONomeCom(nome) e preenchoOEmailCom(email) recebem o valor certo automaticamente (vem da feature) — só repasse pra Page.',
    ],
    featureLinhas: [
      'Dado que acesso a aplicação',
      'Quando preencho o nome com "Fulano de Tal"',
      'E preencho o e-mail com "emailinvalido"',
      'E clico em iniciar avaliação',
      'Então devo ver a mensagem de erro do e-mail',
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

  erroEmailEstaVisivel() {
    ${pendente('erroEmailEstaVisivel')}
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

  // @Então("devo ver a mensagem de erro do e-mail")
  async devoVerAMensagemDeErroDoEmail() {
    ${pendente('devoVerAMensagemDeErroDoEmail')}
  }
}`,
  },
  {
    numero: 3,
    titulo: 'Deve avançar para o Dashboard ao preencher nome e e-mail válidos',
    contexto: 'O caminho feliz da identificação.',
    dado: 'que acesso a aplicação',
    entao: 'devo ver o card de saldo',
    dica: '[data-testid="card-saldo"] só existe depois da identificação.',
    localizadores:
      'this.campoNome → [data-testid="input-nome"]\n' +
      'this.campoEmail → [data-testid="input-email"]\n' +
      'this.botaoIniciar → [data-testid="btn-iniciar"]\n' +
      'this.cardSaldo → [data-testid="card-saldo"]',
    comandos: ['driver.findElement', '.sendKeys()', '.click()', '.isDisplayed()', 'Assert.assertTrue'],
    passos: [
      'Mesma implementação da questão anterior pra preencherNome/preencherEmail/clicarIniciar/acessarPagina.',
      'Em Page.cardSaldoEstaVisivel(), retorne this.driver.findElement(this.cardSaldo).isDisplayed().',
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
    numero: 4,
    titulo: 'Deve cadastrar uma receita com sucesso',
    contexto: 'Fluxo completo de cadastro, do zero, incluindo a identificação.',
    dado: 'que acesso a aplicação',
    entao: 'devo ver o lançamento "Salario" na lista',
    dica: '[data-testid="input-data"] já vem com uma data padrão — dê .clear() antes de preencher com sendKeys(), senão o valor novo fica colado no antigo.',
    localizadores:
      'this.campoNome → [data-testid="input-nome"]\n' +
      'this.campoEmail → [data-testid="input-email"]\n' +
      'this.botaoIniciar → [data-testid="btn-iniciar"]\n' +
      'this.botaoNovaTransacao → [data-testid="btn-nova-transacao"]\n' +
      'this.tipoReceita → [data-testid="tipo-receita"]\n' +
      'this.campoDescricao → [data-testid="input-descricao"]\n' +
      'this.campoValor → [data-testid="input-valor"]\n' +
      'this.campoCategoria → [data-testid="select-categoria"]\n' +
      'this.campoData → [data-testid="input-data"]\n' +
      'this.botaoSalvar → [data-testid="btn-salvar"]\n' +
      'this.menuLancamentos → [data-testid="nav-lancamentos"]\n' +
      'this.linhaLancamento → [data-testid="linha-lancamento"]',
    comandos: ['driver.findElement', '.sendKeys()', '.clear()', '.click()', '.getText()', 'Assert.assertTrue'],
    passos: [
      'Page.preencherData(data) precisa limpar o campo antes de digitar: this.driver.findElement(this.campoData).clear() e depois .sendKeys(data).',
      'Page.listaContemLancamento(descricao) precisa ser assíncrono: leia o texto com await this.driver.findElement(this.linhaLancamento).getText() e devolva se esse texto inclui a descrição (String.includes).',
      'Os demais métodos de ação (clicar/preencher/selecionar) seguem o mesmo padrão das questões anteriores.',
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
  {
    numero: 5,
    titulo: 'Deve editar um lançamento existente e refletir a alteração na lista',
    contexto:
      'Depende de já existir um lançamento — como o estado é resetado a cada execução, o próprio cenário desta questão cadastra um lançamento primeiro antes de editá-lo.',
    dado: 'que acesso a aplicação',
    entao: 'devo ver o lançamento "Mercado do mes" na lista',
    dica: '[data-testid="btn-editar"] abre o mesmo modal do cadastro, já preenchido — só troque a descrição.',
    localizadores:
      'this.campoNome → [data-testid="input-nome"]\n' +
      'this.campoEmail → [data-testid="input-email"]\n' +
      'this.botaoIniciar → [data-testid="btn-iniciar"]\n' +
      'this.botaoNovaTransacao → [data-testid="btn-nova-transacao"]\n' +
      'this.campoDescricao → [data-testid="input-descricao"]\n' +
      'this.campoValor → [data-testid="input-valor"]\n' +
      'this.campoData → [data-testid="input-data"]\n' +
      'this.botaoSalvar → [data-testid="btn-salvar"]\n' +
      'this.menuLancamentos → [data-testid="nav-lancamentos"]\n' +
      'this.botaoEditar → [data-testid="btn-editar"]\n' +
      'this.linhaLancamento → [data-testid="linha-lancamento"]',
    comandos: ['driver.findElement', '.sendKeys()', '.clear()', '.click()', '.getText()', 'Assert.assertTrue'],
    passos: [
      'Reaproveite a mesma lógica de preencherData (clear + sendKeys) e listaContemLancamento das questões anteriores.',
      'Page.limparDescricao() só precisa de this.driver.findElement(this.campoDescricao).clear().',
      'Page.clicarEditar() clica no botão de editar do lançamento já cadastrado.',
    ],
    featureLinhas: [
      'Dado que acesso a aplicação',
      'E preencho o nome com "Fulano de Tal"',
      'E preencho o e-mail com "fulano@exemplo.com"',
      'E clico em iniciar avaliação',
      'E clico em nova transação',
      'E preencho a descrição com "Mercado"',
      'E preencho o valor com "150"',
      'E preencho a data com "2024-01-10"',
      'E clico em salvar',
      'E clico em lançamentos',
      'Quando clico em editar',
      'E limpo a descrição',
      'E preencho a descrição com "Mercado do mes"',
      'E clico em salvar',
      'Então devo ver o lançamento "Mercado do mes" na lista',
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

  preencherDescricao(descricao) {
    ${pendente('preencherDescricao')}
  }

  limparDescricao() {
    ${pendente('limparDescricao')}
  }

  preencherValor(valor) {
    ${pendente('preencherValor')}
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

  clicarEditar() {
    ${pendente('clicarEditar')}
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

  // @E("clico em nova transação")
  clicoEmNovaTransacao() {
    ${pendente('clicoEmNovaTransacao')}
  }

  // @E("preencho a descrição com {string}")
  preenchoADescricaoCom(descricao) {
    ${pendente('preenchoADescricaoCom')}
  }

  // @E("preencho o valor com {string}")
  preenchoOValorCom(valor) {
    ${pendente('preenchoOValorCom')}
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

  // @Quando("clico em editar")
  clicoEmEditar() {
    ${pendente('clicoEmEditar')}
  }

  // @E("limpo a descrição")
  limpoADescricao() {
    ${pendente('limpoADescricao')}
  }

  // @Então("devo ver o lançamento {string} na lista")
  async devoVerOLancamentoNaLista(descricao) {
    ${pendente('devoVerOLancamentoNaLista')}
  }
}`,
  },
  {
    numero: 6,
    titulo: 'Deve excluir um lançamento após confirmação',
    contexto: 'Também precisa de um lançamento prévio, criado dentro do próprio cenário da questão.',
    dado: 'que acesso a aplicação',
    entao: 'devo ver a lista vazia',
    dica: '[data-testid="btn-excluir"] abre um modal de confirmação — o clique que realmente exclui é em outro botão, o de confirmar.',
    localizadores:
      'this.campoNome → [data-testid="input-nome"]\n' +
      'this.campoEmail → [data-testid="input-email"]\n' +
      'this.botaoIniciar → [data-testid="btn-iniciar"]\n' +
      'this.botaoNovaTransacao → [data-testid="btn-nova-transacao"]\n' +
      'this.campoDescricao → [data-testid="input-descricao"]\n' +
      'this.campoValor → [data-testid="input-valor"]\n' +
      'this.campoData → [data-testid="input-data"]\n' +
      'this.botaoSalvar → [data-testid="btn-salvar"]\n' +
      'this.menuLancamentos → [data-testid="nav-lancamentos"]\n' +
      'this.botaoExcluir → [data-testid="btn-excluir"]\n' +
      'this.botaoConfirmarExclusao → [data-testid="btn-confirmar-exclusao"]\n' +
      'this.listaVazia → [data-testid="lista-vazia"]',
    comandos: ['driver.findElement', '.sendKeys()', '.click()', '.isDisplayed()', 'Assert.assertTrue'],
    passos: [
      'Page.clicarExcluir() clica no botão de excluir do lançamento.',
      'Page.clicarConfirmarExclusao() clica no botão de confirmar dentro do modal.',
      'Page.listaVaziaEstaVisivel() retorna this.driver.findElement(this.listaVazia).isDisplayed().',
    ],
    featureLinhas: [
      'Dado que acesso a aplicação',
      'E preencho o nome com "Fulano de Tal"',
      'E preencho o e-mail com "fulano@exemplo.com"',
      'E clico em iniciar avaliação',
      'E clico em nova transação',
      'E preencho a descrição com "Cinema"',
      'E preencho o valor com "40"',
      'E preencho a data com "2024-01-10"',
      'E clico em salvar',
      'E clico em lançamentos',
      'Quando clico em excluir',
      'E clico em confirmar exclusão',
      'Então devo ver a lista vazia',
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

  preencherDescricao(descricao) {
    ${pendente('preencherDescricao')}
  }

  preencherValor(valor) {
    ${pendente('preencherValor')}
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

  clicarExcluir() {
    ${pendente('clicarExcluir')}
  }

  clicarConfirmarExclusao() {
    ${pendente('clicarConfirmarExclusao')}
  }

  listaVaziaEstaVisivel() {
    ${pendente('listaVaziaEstaVisivel')}
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

  // @E("clico em nova transação")
  clicoEmNovaTransacao() {
    ${pendente('clicoEmNovaTransacao')}
  }

  // @E("preencho a descrição com {string}")
  preenchoADescricaoCom(descricao) {
    ${pendente('preenchoADescricaoCom')}
  }

  // @E("preencho o valor com {string}")
  preenchoOValorCom(valor) {
    ${pendente('preenchoOValorCom')}
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

  // @Quando("clico em excluir")
  clicoEmExcluir() {
    ${pendente('clicoEmExcluir')}
  }

  // @E("clico em confirmar exclusão")
  clicoEmConfirmarExclusao() {
    ${pendente('clicoEmConfirmarExclusao')}
  }

  // @Então("devo ver a lista vazia")
  async devoVerAListaVazia() {
    ${pendente('devoVerAListaVazia')}
  }
}`,
  },
  {
    numero: 7,
    titulo: 'Deve filtrar os lançamentos por tipo',
    contexto: 'Precisa de pelo menos um lançamento de cada tipo, cadastrados dentro do próprio cenário da questão.',
    dado: 'que acesso a aplicação',
    entao: 'devo ver o lançamento "Salario" na lista',
    dica: 'O <select> de filtro usa valores internos em inglês: "income" pra Receita e "expense" pra Despesa — não é o texto visível.',
    localizadores:
      'this.campoNome → [data-testid="input-nome"]\n' +
      'this.campoEmail → [data-testid="input-email"]\n' +
      'this.botaoIniciar → [data-testid="btn-iniciar"]\n' +
      'this.botaoNovaTransacao → [data-testid="btn-nova-transacao"]\n' +
      'this.tipoReceita → [data-testid="tipo-receita"]\n' +
      'this.tipoDespesa → [data-testid="tipo-despesa"]\n' +
      'this.campoDescricao → [data-testid="input-descricao"]\n' +
      'this.campoValor → [data-testid="input-valor"]\n' +
      'this.campoData → [data-testid="input-data"]\n' +
      'this.botaoSalvar → [data-testid="btn-salvar"]\n' +
      'this.menuLancamentos → [data-testid="nav-lancamentos"]\n' +
      'this.filtroTipo → [data-testid="filtro-tipo"]\n' +
      'this.linhaLancamento → [data-testid="linha-lancamento"]',
    comandos: ['driver.findElement', '.sendKeys()', '.click()', '.selectByValue()', '.getText()', 'Assert.assertTrue/assertFalse'],
    passos: [
      'Page.filtrarPorTipo(tipo) recebe "Receita" (texto da feature) e precisa traduzir pra "income" antes de chamar this.driver.findElement(this.filtroTipo).selectByValue("income").',
      'Reaproveite Page.listaContemLancamento(descricao) da questão 4 pras duas asserções (uma com Assert.assertTrue, outra com Assert.assertFalse).',
    ],
    featureLinhas: [
      'Dado que acesso a aplicação',
      'E preencho o nome com "Fulano de Tal"',
      'E preencho o e-mail com "fulano@exemplo.com"',
      'E clico em iniciar avaliação',
      'E clico em nova transação',
      'E clico no tipo receita',
      'E preencho a descrição com "Salario"',
      'E preencho o valor com "1000"',
      'E preencho a data com "2024-01-10"',
      'E clico em salvar',
      'E clico em nova transação',
      'E clico no tipo despesa',
      'E preencho a descrição com "Aluguel"',
      'E preencho o valor com "800"',
      'E preencho a data com "2024-01-10"',
      'E clico em salvar',
      'E clico em lançamentos',
      'Quando filtro por tipo "Receita"',
      'Então devo ver o lançamento "Salario" na lista',
      'E não devo ver o lançamento "Aluguel" na lista',
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

  clicarTipoDespesa() {
    ${pendente('clicarTipoDespesa')}
  }

  preencherDescricao(descricao) {
    ${pendente('preencherDescricao')}
  }

  preencherValor(valor) {
    ${pendente('preencherValor')}
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

  filtrarPorTipo(tipo) {
    ${pendente('filtrarPorTipo')}
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

  // @E("clico em nova transação")
  clicoEmNovaTransacao() {
    ${pendente('clicoEmNovaTransacao')}
  }

  // @E("clico no tipo receita")
  clicoNoTipoReceita() {
    ${pendente('clicoNoTipoReceita')}
  }

  // @E("clico no tipo despesa")
  clicoNoTipoDespesa() {
    ${pendente('clicoNoTipoDespesa')}
  }

  // @E("preencho a descrição com {string}")
  preenchoADescricaoCom(descricao) {
    ${pendente('preenchoADescricaoCom')}
  }

  // @E("preencho o valor com {string}")
  preenchoOValorCom(valor) {
    ${pendente('preenchoOValorCom')}
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

  // @Quando("filtro por tipo {string}")
  filtroPorTipo(tipo) {
    ${pendente('filtroPorTipo')}
  }

  // @Então("devo ver o lançamento {string} na lista")
  async devoVerOLancamentoNaLista(descricao) {
    ${pendente('devoVerOLancamentoNaLista')}
  }

  // @E("não devo ver o lançamento {string} na lista")
  async naoDevoVerOLancamentoNaLista(descricao) {
    ${pendente('naoDevoVerOLancamentoNaLista')}
  }
}`,
  },
  {
    numero: 8,
    titulo: 'Deve manter os lançamentos após recarregar a página',
    contexto: 'Testa a persistência local dos dados, não um cadastro em si.',
    dado: 'que acesso a aplicação',
    entao: 'devo ver o lançamento "Aluguel" na lista',
    dica: 'driver.navigate().refresh() recarrega sem apagar o localStorage — diferente de driver.get(\'/\'), que reinicia o estado.',
    localizadores:
      'this.campoNome → [data-testid="input-nome"]\n' +
      'this.campoEmail → [data-testid="input-email"]\n' +
      'this.botaoIniciar → [data-testid="btn-iniciar"]\n' +
      'this.botaoNovaTransacao → [data-testid="btn-nova-transacao"]\n' +
      'this.campoDescricao → [data-testid="input-descricao"]\n' +
      'this.campoValor → [data-testid="input-valor"]\n' +
      'this.campoData → [data-testid="input-data"]\n' +
      'this.botaoSalvar → [data-testid="btn-salvar"]\n' +
      'this.menuLancamentos → [data-testid="nav-lancamentos"]\n' +
      'this.linhaLancamento → [data-testid="linha-lancamento"]',
    comandos: ['driver.findElement', '.sendKeys()', '.click()', 'driver.navigate().refresh()', '.getText()', 'Assert.assertTrue'],
    passos: [
      'Page.recarregarPagina() chama this.driver.navigate().refresh().',
      'O resto reaproveita a mesma lógica das questões de cadastro/lista anteriores.',
    ],
    featureLinhas: [
      'Dado que acesso a aplicação',
      'E preencho o nome com "Fulano de Tal"',
      'E preencho o e-mail com "fulano@exemplo.com"',
      'E clico em iniciar avaliação',
      'E clico em nova transação',
      'E preencho a descrição com "Aluguel"',
      'E preencho o valor com "500"',
      'E preencho a data com "2024-01-10"',
      'E clico em salvar',
      'E clico em lançamentos',
      'E devo ver o lançamento "Aluguel" na lista',
      'Quando recarrego a página',
      'E clico em lançamentos',
      'Então devo ver o lançamento "Aluguel" na lista',
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

  preencherDescricao(descricao) {
    ${pendente('preencherDescricao')}
  }

  preencherValor(valor) {
    ${pendente('preencherValor')}
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

  recarregarPagina() {
    ${pendente('recarregarPagina')}
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

  // @E("clico em nova transação")
  clicoEmNovaTransacao() {
    ${pendente('clicoEmNovaTransacao')}
  }

  // @E("preencho a descrição com {string}")
  preenchoADescricaoCom(descricao) {
    ${pendente('preenchoADescricaoCom')}
  }

  // @E("preencho o valor com {string}")
  preenchoOValorCom(valor) {
    ${pendente('preenchoOValorCom')}
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

  // @E("devo ver o lançamento {string} na lista")
  async devoVerOLancamentoNaLista(descricao) {
    ${pendente('devoVerOLancamentoNaLista')}
  }

  // @Quando("recarrego a página")
  recarregoAPagina() {
    ${pendente('recarregoAPagina')}
  }
}`,
  },
];
