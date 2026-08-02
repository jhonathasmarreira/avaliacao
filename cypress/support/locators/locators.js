const Locators = {
  identificacao: {
    page: '[data-testid="identificacao-page"]',
    inputNome: '[data-testid="input-nome"]',
    inputEmail: '[data-testid="input-email"]',
    erroNome: '[data-testid="erro-nome"]',
    erroEmail: '[data-testid="erro-email"]',
    btnIniciar: '[data-testid="btn-iniciar"]',
  },

  layout: {
    navDashboard: '[data-testid="nav-dashboard"]',
    navLancamentos: '[data-testid="nav-lancamentos"]',
    badgeLancamentos: '[data-testid="badge-lancamentos"]',
    userNome: '[data-testid="user-nome"]',
    btnSair: '[data-testid="btn-sair"]',
    fabNovaTransacao: '[data-testid="fab-nova-transacao"]',
  },

  dashboard: {
    btnNovaTransacao: '[data-testid="btn-nova-transacao"]',
    cardReceitas: '[data-testid="card-receitas"]',
    cardDespesas: '[data-testid="card-despesas"]',
    cardSaldo: '[data-testid="card-saldo"]',
    semDados: '[data-testid="dashboard-sem-dados"]',
  },

  lancamentos: {
    inputBusca: '[data-testid="input-busca"]',
    filtroTipo: '[data-testid="filtro-tipo"]',
    btnNovoLancamento: '[data-testid="btn-novo-lancamento"]',
    contador: '[data-testid="contador-lancamentos"]',
    listaVazia: '[data-testid="lista-vazia"]',
    listaSemResultado: '[data-testid="lista-sem-resultado"]',
    linha: '[data-testid="linha-lancamento"]',
    descricao: '[data-testid="lancamento-descricao"]',
    valor: '[data-testid="lancamento-valor"]',
    btnEditar: '[data-testid="btn-editar"]',
    btnExcluir: '[data-testid="btn-excluir"]',
  },

  modalTransacao: {
    modal: '[data-testid="modal-transacao"]',
    tipoReceita: '[data-testid="tipo-receita"]',
    tipoDespesa: '[data-testid="tipo-despesa"]',
    inputDescricao: '[data-testid="input-descricao"]',
    inputValor: '[data-testid="input-valor"]',
    selectCategoria: '[data-testid="select-categoria"]',
    inputData: '[data-testid="input-data"]',
    btnSalvar: '[data-testid="btn-salvar"]',
    erroDescricao: '[data-testid="erro-descricao"]',
    erroValor: '[data-testid="erro-valor"]',
  },

  modalExclusao: {
    modal: '[data-testid="modal-exclusao"]',
    btnConfirmar: '[data-testid="btn-confirmar-exclusao"]',
    btnCancelar: '[data-testid="btn-cancelar-exclusao"]',
  },
};

export default Locators;
