import type { Questao } from './types';

// As 8 questões ativas do simulador. Cada uma descreve um cenário no formato
// Dado/Quando/Então (mesma convenção usada no restante do projeto) e traz
// o código inicial que o candidato edita no editor embutido. O comando
// cy.implementeAqui() sempre falha — é o sinal de "questão pendente";
// o candidato apaga essa linha e escreve a implementação real por baixo,
// usando a API cy.* do simulador (documentada no painel de ajuda da tela).
//
// Existem mais 12 questões fora deste conjunto ativo, guardadas em
// ./questoes-arquivadas.ts para uso futuro (ex: montar uma prova mais longa,
// ou trocar alguma questão daqui por outra do arquivo).

const STUB = "cy.implementeAqui();";

export const QUESTOES: Questao[] = [
  {
    numero: 1,
    titulo: 'Deve exibir a tela de identificação ao acessar a aplicação',
    contexto:
      'Todo teste começa do zero: o harness limpa o armazenamento local do app sob teste e recarrega o iframe antes de cada execução. Valide que, sem nenhum dado salvo, a primeira coisa que aparece é a tela de identificação, não o Dashboard.',
    dado: 'que o app sob teste é acessado pela primeira vez, sem dados salvos',
    entao: 'o sistema deve exibir a tela de identificação com os campos Nome completo e E-mail',
    dica: '[data-testid="identificacao-page"] / [data-testid="input-nome"] / [data-testid="input-email"]',
    codigoInicial: `cy.visit('/');\n${STUB}`,
  },
  {
    numero: 2,
    titulo: 'Deve exibir erro ao informar um e-mail em formato inválido',
    contexto:
      'Vai além do campo vazio: aqui o e-mail é preenchido, mas com um valor sem "@", ou seja, um formato inválido. A validação de formato precisa barrar o avanço mesmo com o campo preenchido.',
    dado: 'que o candidato está na tela de identificação',
    quando: 'preenche o nome e digita um e-mail sem "@" (ex: "emailinvalido")',
    e: 'clica em "Iniciar avaliação"',
    entao: 'o sistema deve exibir uma mensagem de erro de formato inválido e não avançar',
    dica: '[data-testid="erro-email"]',
    codigoInicial: `cy.visit('/');\n${STUB}`,
  },
  {
    numero: 3,
    titulo: 'Deve avançar para o Dashboard ao preencher nome e e-mail válidos',
    contexto:
      'O caminho feliz da identificação: com nome completo e e-mail válidos, o sistema deve liberar o acesso ao Dashboard. Use um elemento que só existe após a identificação (como o card de saldo) para confirmar a navegação.',
    dado: 'que o candidato está na tela de identificação',
    quando: 'preenche nome completo e e-mail válidos e confirma',
    entao: 'o sistema deve exibir o Dashboard',
    dica: '[data-testid="card-saldo"] só existe depois da identificação',
    codigoInicial: `cy.visit('/');\n${STUB}`,
  },
  {
    numero: 4,
    titulo: 'Deve cadastrar uma receita com sucesso',
    contexto:
      'Fluxo completo de cadastro: selecione o tipo Receita, preencha descrição, valor, categoria e data válidos, salve e depois navegue até Lançamentos para confirmar que a nova linha aparece na lista (o `data-testid="linha-lancamento"` só existe nessa tela, não no Dashboard).',
    dado: 'que o candidato preenche o modal de novo lançamento com tipo Receita',
    quando: 'informa descrição, valor, categoria e data válidos e salva',
    entao: 'o novo lançamento deve aparecer na lista de Lançamentos',
    dica: '[data-testid="tipo-receita"] / [data-testid="select-categoria"] / [data-testid="input-data"]',
    codigoInicial: `cy.visit('/');\n${STUB}`,
  },
  {
    numero: 5,
    titulo: 'Deve editar um lançamento existente e refletir a alteração na lista',
    contexto:
      'Primeiro cadastre um lançamento (ou parta de um já existente), depois use o botão de editar para alterar a descrição e salvar novamente. A lista precisa mostrar o texto novo, não mais o antigo.',
    dado: 'que existe um lançamento cadastrado',
    quando: 'o candidato clica em editar, altera a descrição e salva',
    entao: 'a lista de lançamentos deve exibir a descrição atualizada',
    dica: '[data-testid="btn-editar"]',
    codigoInicial: `cy.visit('/');\n${STUB}`,
  },
  {
    numero: 6,
    titulo: 'Deve excluir um lançamento após confirmação',
    contexto:
      'Testa o fluxo de exclusão com confirmação: clique em excluir, o modal de confirmação deve abrir, confirme a exclusão e valide que o lançamento realmente some da lista.',
    dado: 'que existe um lançamento cadastrado',
    quando: 'o candidato clica em excluir e confirma a exclusão',
    entao: 'o lançamento não deve mais aparecer na lista',
    dica: '[data-testid="btn-excluir"] / [data-testid="modal-exclusao"] / [data-testid="btn-confirmar-exclusao"]',
    codigoInicial: `cy.visit('/');\n${STUB}`,
  },
  {
    numero: 7,
    titulo: 'Deve filtrar os lançamentos por tipo',
    contexto:
      'Cadastre pelo menos um lançamento de cada tipo (receita e despesa) e use o filtro de tipo para selecionar "Receita". Depois do filtro aplicado, só linhas de receita devem estar visíveis na lista — nenhuma despesa deve aparecer.',
    dado: 'que existem lançamentos de receita e de despesa cadastrados',
    quando: 'o candidato filtra a lista por tipo "Receita"',
    entao: 'somente lançamentos de receita devem ser exibidos',
    dica: '[data-testid="filtro-tipo"]',
    codigoInicial: `cy.visit('/');\n${STUB}`,
  },
  {
    numero: 8,
    titulo: 'Deve manter os lançamentos após recarregar a página',
    contexto:
      'Testa a persistência local dos dados: cadastre um lançamento, use `cy.reload()` (não `cy.visit()`, que reinicia o estado) para recarregar a página sem limpar o armazenamento, e confirme que o lançamento continua aparecendo na lista depois do reload.',
    dado: 'que o candidato cadastrou um lançamento',
    quando: 'a página é recarregada (cy.reload())',
    entao: 'o lançamento cadastrado deve continuar aparecendo na lista (persistência local)',
    dica: 'cy.reload() recarrega o iframe sem apagar o localStorage, ao contrário de cy.visit()',
    codigoInicial: `cy.visit('/');\n${STUB}`,
  },
];
