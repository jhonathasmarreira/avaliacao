import type { Questao } from '../simulador/types';

// Questões que já estiveram no conjunto ativo do simulador Cucumber
// (./questoes.ts) e foram retiradas no corte de 8 para 3 questões — eram as
// questões 2, 5, 6, 7 e 8 do conjunto de 8. Ficam guardadas aqui para
// reaproveitamento futuro (ex: montar uma prova mais longa, ou trocar
// alguma questão ativa por outra do arquivo) — este arquivo não é importado
// por nenhuma tela hoje, é só um "banco de reserva".
//
// O campo `numero` abaixo é o número original de quando a questão fazia
// parte do conjunto de 8; se alguma delas voltar a ser usada, renumere para
// não colidir com os números de ./questoes.ts (hoje 1 a 3).

function pendente(metodo: string): string {
  return `// TODO: apague a linha abaixo e escreva sua implementação aqui\n    throw new Error('Implemente o método ${metodo}().');`;
}

export const QUESTOES_ARQUIVADAS: Questao[] = [
  {
    numero: 2,
    titulo: 'Deve exibir erro ao informar um e-mail em formato inválido',
    contexto:
      'Vai além do campo vazio: aqui o e-mail é preenchido, mas com um valor sem "@", ou seja, um formato inválido.',
    dado: 'que acesso a aplicação',
    entao: 'devo ver a mensagem de erro do e-mail',
    dica: 'Os métodos @Quando/@E que recebem valor da feature (ex: {string}) chegam como parâmetro do método: não precisa reler a feature.',
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
    // TODO: monte aqui os localizadores (this.campo = By.cssSelector('...')). Veja "Localizadores sugeridos" acima.
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
    numero: 5,
    titulo: 'Deve editar um lançamento existente e refletir a alteração na lista',
    contexto:
      'Depende de já existir um lançamento: como o estado é resetado a cada execução, o próprio cenário desta questão cadastra um lançamento primeiro antes de editá-lo.',
    dado: 'que acesso a aplicação',
    entao: 'devo ver o lançamento "Mercado do mes" na lista',
    dica: '[data-testid="btn-editar"] abre o mesmo modal do cadastro, já preenchido: só troque a descrição.',
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
    // TODO: monte aqui os localizadores (this.campo = By.cssSelector('...')). Veja "Localizadores sugeridos" acima.
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
    dica: '[data-testid="btn-excluir"] abre um modal de confirmação. O clique que realmente exclui é em outro botão, o de confirmar.',
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
    // TODO: monte aqui os localizadores (this.campo = By.cssSelector('...')). Veja "Localizadores sugeridos" acima.
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
    dica: 'O <select> de filtro usa valores internos em inglês: "income" pra Receita e "expense" pra Despesa. Não é o texto visível.',
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
    // TODO: monte aqui os localizadores (this.campo = By.cssSelector('...')). Veja "Localizadores sugeridos" acima.
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
    dica: 'driver.navigate().refresh() recarrega sem apagar o localStorage, diferente de driver.get(\'/\'), que reinicia o estado.',
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
    // TODO: monte aqui os localizadores (this.campo = By.cssSelector('...')). Veja "Localizadores sugeridos" acima.
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
