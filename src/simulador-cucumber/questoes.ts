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
  return `// TODO: apague a linha abaixo e escreva sua implementação aqui\n    throw new Error('Implemente o método ${metodo}().');`;
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
    titulo: 'Deve exibir erro ao informar um e-mail em formato inválido',
    contexto:
      'Vai além do campo vazio: aqui o e-mail é preenchido, mas com um valor sem "@", ou seja, um formato inválido.',
    dado: 'que acesso a aplicação',
    entao: 'devo ver a mensagem de erro do e-mail',
    dica: 'Os métodos @Quando/@E que recebem valor da feature (ex: {string}) chegam como parâmetro do método — não precisa reler a feature.',
    localizadores:
      '[data-testid="input-nome"] / [data-testid="input-email"] / [data-testid="btn-iniciar"] / [data-testid="erro-email"]',
    comandos: ['driver.findElement', '.sendKeys()', '.click()', '.isDisplayed()', 'Assert.assertTrue'],
    passos: [
      'Acesse a aplicação.',
      'Preencha o campo nome com qualquer texto válido.',
      'Preencha o campo e-mail com um valor sem "@".',
      'Clique no botão de iniciar avaliação.',
      'Confirme que a mensagem de erro de e-mail fica visível.',
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
    numero: 4,
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
  {
    numero: 5,
    titulo: 'Deve editar um lançamento existente e refletir a alteração na lista',
    contexto:
      'Depende de já existir um lançamento — como o estado é resetado a cada execução, o próprio cenário desta questão cadastra um lançamento primeiro antes de editá-lo.',
    dado: 'que acesso a aplicação',
    entao: 'devo ver o lançamento "Mercado do mes" na lista',
    dica: '[data-testid="btn-editar"] abre o mesmo modal do cadastro, já preenchido — só troque a descrição.',
    localizadores:
      '[data-testid="input-nome"] / [data-testid="input-email"] / [data-testid="btn-iniciar"] / [data-testid="btn-nova-transacao"] / [data-testid="input-descricao"] / [data-testid="input-valor"] / [data-testid="input-data"] / [data-testid="btn-salvar"] / [data-testid="nav-lancamentos"] / [data-testid="btn-editar"] / [data-testid="linha-lancamento"]',
    comandos: ['driver.findElement', '.sendKeys()', '.clear()', '.click()', '.getText()', 'Assert.assertTrue'],
    passos: [
      'Acesse a aplicação, identifique-se e cadastre um lançamento.',
      'Abra a edição do lançamento cadastrado.',
      'Limpe a descrição e preencha com o novo valor.',
      'Salve e confirme que a lista mostra a descrição atualizada.',
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
      '[data-testid="input-nome"] / [data-testid="input-email"] / [data-testid="btn-iniciar"] / [data-testid="btn-nova-transacao"] / [data-testid="input-descricao"] / [data-testid="input-valor"] / [data-testid="input-data"] / [data-testid="btn-salvar"] / [data-testid="nav-lancamentos"] / [data-testid="btn-excluir"] / [data-testid="btn-confirmar-exclusao"] / [data-testid="lista-vazia"]',
    comandos: ['driver.findElement', '.sendKeys()', '.click()', '.isDisplayed()', 'Assert.assertTrue'],
    passos: [
      'Acesse a aplicação, identifique-se e cadastre um lançamento.',
      'Clique em excluir e depois confirme a exclusão.',
      'Confirme que a lista fica vazia.',
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
      '[data-testid="input-nome"] / [data-testid="input-email"] / [data-testid="btn-iniciar"] / [data-testid="btn-nova-transacao"] / [data-testid="tipo-receita"] / [data-testid="tipo-despesa"] / [data-testid="input-descricao"] / [data-testid="input-valor"] / [data-testid="input-data"] / [data-testid="btn-salvar"] / [data-testid="nav-lancamentos"] / [data-testid="filtro-tipo"] / [data-testid="linha-lancamento"]',
    comandos: ['driver.findElement', '.sendKeys()', '.click()', '.selectByValue()', '.getText()', 'Assert.assertTrue/assertFalse'],
    passos: [
      'Acesse a aplicação, identifique-se e cadastre uma receita e uma despesa.',
      'Filtre a lista pelo tipo Receita.',
      'Confirme que só o lançamento de receita aparece na lista (e o de despesa não).',
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
      '[data-testid="input-nome"] / [data-testid="input-email"] / [data-testid="btn-iniciar"] / [data-testid="btn-nova-transacao"] / [data-testid="input-descricao"] / [data-testid="input-valor"] / [data-testid="input-data"] / [data-testid="btn-salvar"] / [data-testid="nav-lancamentos"] / [data-testid="linha-lancamento"]',
    comandos: ['driver.findElement', '.sendKeys()', '.click()', 'driver.navigate().refresh()', '.getText()', 'Assert.assertTrue'],
    passos: [
      'Acesse a aplicação, identifique-se e cadastre um lançamento.',
      'Recarregue a página.',
      'Confirme que o lançamento continua na lista depois de recarregar.',
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
