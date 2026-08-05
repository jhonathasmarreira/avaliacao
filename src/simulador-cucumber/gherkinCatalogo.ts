import type { StepDefinicao } from '../simulador/miniCy/gherkinRunner';

// Dicionário de "linguagem ubíqua" do app financeiro sob teste: nome amigável
// em português -> seletor real na tela. É o glossário que o candidato usa
// para escrever os steps (documentado na tela via GherkinAjuda.tsx).
const DICIONARIO_ELEMENTOS: Record<string, string> = {
  'Tela de identificação': '[data-testid="identificacao-page"]',
  'Campo Nome completo': '[data-testid="input-nome"]',
  'Campo E-mail': '[data-testid="input-email"]',
  'Botão Iniciar avaliação': '[data-testid="btn-iniciar"]',
  'Erro do nome': '[data-testid="erro-nome"]',
  'Erro do e-mail': '[data-testid="erro-email"]',
  'Card de saldo': '[data-testid="card-saldo"]',
  'Botão Nova transação': '[data-testid="btn-nova-transacao"]',
  'Modal de transação': '[data-testid="modal-transacao"]',
  'Tipo Receita': '[data-testid="tipo-receita"]',
  'Tipo Despesa': '[data-testid="tipo-despesa"]',
  'Campo Descrição': '[data-testid="input-descricao"]',
  'Campo Valor': '[data-testid="input-valor"]',
  'Campo Categoria': '[data-testid="select-categoria"]',
  'Campo Data': '[data-testid="input-data"]',
  'Botão Salvar': '[data-testid="btn-salvar"]',
  'Menu Lançamentos': '[data-testid="nav-lancamentos"]',
  'Linha do lançamento': '[data-testid="linha-lancamento"]',
  'Botão Editar': '[data-testid="btn-editar"]',
  'Botão Excluir': '[data-testid="btn-excluir"]',
  'Botão Confirmar exclusão': '[data-testid="btn-confirmar-exclusao"]',
  'Lista vazia': '[data-testid="lista-vazia"]',
  'Campo Filtro de tipo': '[data-testid="filtro-tipo"]',
  'Descrição do lançamento': '[data-testid="lancamento-descricao"]',
};

// Alguns campos de seleção têm valor interno diferente do rótulo visível
// (ex: o filtro de tipo usa "income"/"expense" internamente). Esse alias
// existe pra deixar o step em português mesmo quando o valor técnico não é.
const ALIAS_VALORES: Record<string, Record<string, string>> = {
  'campo filtro de tipo': { receita: 'income', despesa: 'expense', todos: '' },
};

function normalizar(texto: string): string {
  return texto.trim().toLowerCase();
}

const DICIONARIO_NORMALIZADO: Record<string, string> = Object.fromEntries(
  Object.entries(DICIONARIO_ELEMENTOS).map(([chave, seletor]) => [normalizar(chave), seletor])
);

function resolverSeletor(nomeAmigavel: string): string {
  const seletor = DICIONARIO_NORMALIZADO[normalizar(nomeAmigavel)];
  if (!seletor) {
    throw new Error(`Elemento "${nomeAmigavel}" não é reconhecido. Confira a lista de elementos disponíveis.`);
  }
  return seletor;
}

function resolverValor(campoAmigavel: string, valor: string): string {
  const alias = ALIAS_VALORES[normalizar(campoAmigavel)];
  if (alias && normalizar(valor) in alias) return alias[normalizar(valor)];
  return valor;
}

export const CATALOGO_STEPS: StepDefinicao[] = [
  {
    padrao: /^que acesso a aplicação$/i,
    executar: (cy) => {
      cy.visit('/');
    },
  },
  {
    padrao: /^preencho o campo "([^"]+)" com "([^"]*)"$/i,
    executar: (cy, [campo, valor]) => {
      cy.get(resolverSeletor(campo)).type(valor);
    },
  },
  {
    padrao: /^limpo o campo "([^"]+)"$/i,
    executar: (cy, [campo]) => {
      cy.get(resolverSeletor(campo)).clear();
    },
  },
  {
    padrao: /^seleciono a opção "([^"]+)" no campo "([^"]+)"$/i,
    executar: (cy, [valor, campo]) => {
      cy.get(resolverSeletor(campo)).select(resolverValor(campo, valor));
    },
  },
  {
    padrao: /^clico em "([^"]+)"$/i,
    executar: (cy, [elemento]) => {
      cy.get(resolverSeletor(elemento)).click();
    },
  },
  {
    padrao: /^(a página é recarregada|recarrego a página)$/i,
    executar: (cy) => {
      cy.reload();
    },
  },
  {
    padrao: /^devo ver "([^"]+)"$/i,
    executar: (cy, [elemento]) => {
      cy.get(resolverSeletor(elemento)).should('be.visible');
    },
  },
  {
    padrao: /^não devo ver "([^"]+)"$/i,
    executar: (cy, [elemento]) => {
      cy.get(resolverSeletor(elemento)).should('not.exist');
    },
  },
  {
    padrao: /^"([^"]+)" deve conter o texto "([^"]*)"$/i,
    executar: (cy, [elemento, textoEsperado]) => {
      cy.get(resolverSeletor(elemento)).should('contain.text', textoEsperado);
    },
  },
  {
    padrao: /^a lista de lançamentos deve ter (\d+) item(?:ns)?$/i,
    executar: (cy, [quantidade]) => {
      cy.get(resolverSeletor('Linha do lançamento')).should('have.length', Number(quantidade));
    },
  },
];

export const ELEMENTOS_DISPONIVEIS = Object.keys(DICIONARIO_ELEMENTOS);

// Espelha os padrões do catálogo acima em texto legível pro candidato
// (a tela de ajuda mostra isso, não a regex).
export const STEPS_DISPONIVEIS: string[] = [
  'Dado que acesso a aplicação',
  'Quando/E preencho o campo "<elemento>" com "<valor>"',
  'Quando/E limpo o campo "<elemento>"',
  'Quando/E seleciono a opção "<valor>" no campo "<elemento>"',
  'Quando/E clico em "<elemento>"',
  'Quando/E a página é recarregada',
  'Então/E devo ver "<elemento>"',
  'Então/E não devo ver "<elemento>"',
  'Então/E "<elemento>" deve conter o texto "<texto>"',
  'Então/E a lista de lançamentos deve ter <N> item(ns)',
];
