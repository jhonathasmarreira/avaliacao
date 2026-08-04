import type { Questao } from './types';

// As 8 questões ativas do simulador. Cada uma descreve um cenário no formato
// Dado/Quando/Então (mesma convenção usada no restante do projeto) e traz
// o código inicial que o candidato edita no editor embutido. O comando
// cy.implementeAqui() sempre falha — é o sinal de "questão pendente";
// o candidato apaga essa linha e escreve a implementação real por baixo,
// usando a API cy.* do simulador (documentada no painel de ajuda da tela).
// O campo `comandos` só nomeia os comandos esperados (get, should, etc.),
// sem explicar como usá-los — isso o candidato precisa saber/consultar.
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
      'Todo teste começa do zero: o harness limpa o armazenamento local do app sob teste e recarrega o iframe antes de cada execução — você não precisa (nem deve) fazer isso manualmente. Passos esperados: (1) visitar a aplicação; (2) confirmar que o container da tela de identificação está visível; (3) confirmar que os dois campos de entrada, nome e e-mail, existem na tela. Não é preciso preencher nada nesta questão — é só uma checagem do estado inicial.',
    dado: 'que o app sob teste é acessado pela primeira vez, sem dados salvos',
    entao: 'o sistema deve exibir a tela de identificação com os campos Nome completo e E-mail',
    dica: '[data-testid="identificacao-page"] / [data-testid="input-nome"] / [data-testid="input-email"]',
    comandos: ['visit', 'get', 'should'],
    codigoInicial: `cy.visit('/');\n${STUB}`,
  },
  {
    numero: 2,
    titulo: 'Deve exibir erro ao informar um e-mail em formato inválido',
    contexto:
      'Vai além do campo vazio: aqui o e-mail é preenchido, mas com um valor sem "@" (ex: "emailinvalido"), ou seja, um formato inválido. Passos esperados: (1) visitar a aplicação; (2) preencher o campo nome com qualquer texto válido; (3) preencher o campo e-mail com um valor sem "@"; (4) clicar no botão de iniciar a avaliação; (5) confirmar que a mensagem de erro de formato inválido fica visível perto do campo e-mail, e que a tela de identificação continua na tela (não avançou para o Dashboard).',
    dado: 'que o candidato está na tela de identificação',
    quando: 'preenche o nome e digita um e-mail sem "@" (ex: "emailinvalido")',
    e: 'clica em "Iniciar avaliação"',
    entao: 'o sistema deve exibir uma mensagem de erro de formato inválido e não avançar',
    dica: '[data-testid="erro-email"]',
    comandos: ['visit', 'get', 'type', 'click', 'should'],
    codigoInicial: `cy.visit('/');\n${STUB}`,
  },
  {
    numero: 3,
    titulo: 'Deve avançar para o Dashboard ao preencher nome e e-mail válidos',
    contexto:
      'O caminho feliz da identificação. Passos esperados: (1) visitar a aplicação; (2) preencher o campo nome com um nome completo qualquer; (3) preencher o campo e-mail com um endereço em formato válido (com "@" e domínio); (4) clicar no botão de iniciar a avaliação; (5) confirmar que um elemento que só existe depois da identificação — como o card de saldo do Dashboard — fica visível na tela.',
    dado: 'que o candidato está na tela de identificação',
    quando: 'preenche nome completo e e-mail válidos e confirma',
    entao: 'o sistema deve exibir o Dashboard',
    dica: '[data-testid="card-saldo"] só existe depois da identificação',
    comandos: ['visit', 'get', 'type', 'click', 'should'],
    codigoInicial: `cy.visit('/');\n${STUB}`,
  },
  {
    numero: 4,
    titulo: 'Deve cadastrar uma receita com sucesso',
    contexto:
      'Fluxo completo de cadastro, do zero. Passos esperados: (1) identifique-se primeiro, preenchendo nome e e-mail válidos e confirmando — o estado é resetado antes de cada execução, então essa etapa precisa estar no código; (2) abra o modal de nova transação a partir do Dashboard; (3) selecione o tipo Receita; (4) preencha descrição, valor, categoria e data, todos com valores válidos; (5) salve o formulário; (6) navegue até a tela de Lançamentos (o `data-testid="linha-lancamento"` só existe lá, não no Dashboard); (7) confirme que a linha do lançamento recém-criado aparece na lista, contendo a descrição informada.',
    dado: 'que o candidato preenche o modal de novo lançamento com tipo Receita',
    quando: 'informa descrição, valor, categoria e data válidos e salva',
    entao: 'o novo lançamento deve aparecer na lista de Lançamentos',
    dica: '[data-testid="tipo-receita"] / [data-testid="select-categoria"] / [data-testid="input-data"]',
    comandos: ['visit', 'get', 'type', 'click', 'select', 'should'],
    codigoInicial: `cy.visit('/');\n${STUB}`,
  },
  {
    numero: 5,
    titulo: 'Deve editar um lançamento existente e refletir a alteração na lista',
    contexto:
      'Depende de já existir um lançamento — como o estado é resetado a cada execução, o próprio código desta questão precisa criar um lançamento primeiro antes de editá-lo. Passos esperados: (1) identifique-se; (2) cadastre um lançamento qualquer (descrição, valor e data válidos); (3) vá até a tela de Lançamentos; (4) clique no botão de editar desse lançamento; (5) apague a descrição atual e digite uma nova; (6) salve novamente; (7) confirme que a lista de Lançamentos passa a exibir a descrição nova, não mais a antiga.',
    dado: 'que existe um lançamento cadastrado',
    quando: 'o candidato clica em editar, altera a descrição e salva',
    entao: 'a lista de lançamentos deve exibir a descrição atualizada',
    dica: '[data-testid="btn-editar"]',
    comandos: ['visit', 'get', 'type', 'clear', 'click', 'should'],
    codigoInicial: `cy.visit('/');\n${STUB}`,
  },
  {
    numero: 6,
    titulo: 'Deve excluir um lançamento após confirmação',
    contexto:
      'Também precisa de um lançamento prévio, criado dentro do próprio código da questão. Passos esperados: (1) identifique-se; (2) cadastre um lançamento qualquer; (3) vá até a tela de Lançamentos; (4) clique no botão de excluir desse lançamento — isso deve abrir um modal de confirmação; (5) clique no botão de confirmar a exclusão dentro desse modal; (6) confirme que o lançamento não aparece mais na lista (por exemplo, checando que a mensagem de lista vazia passa a ser exibida, já que era o único lançamento cadastrado).',
    dado: 'que existe um lançamento cadastrado',
    quando: 'o candidato clica em excluir e confirma a exclusão',
    entao: 'o lançamento não deve mais aparecer na lista',
    dica: '[data-testid="btn-excluir"] / [data-testid="modal-exclusao"] / [data-testid="btn-confirmar-exclusao"]',
    comandos: ['visit', 'get', 'type', 'click', 'should'],
    codigoInicial: `cy.visit('/');\n${STUB}`,
  },
  {
    numero: 7,
    titulo: 'Deve filtrar os lançamentos por tipo',
    contexto:
      'Precisa de pelo menos um lançamento de cada tipo, cadastrados dentro do próprio código da questão. Passos esperados: (1) identifique-se; (2) cadastre um lançamento do tipo Receita; (3) cadastre um lançamento do tipo Despesa; (4) vá até a tela de Lançamentos; (5) use o filtro de tipo para selecionar "Receita"; (6) confirme que a lista passa a ter só um item visível e que esse item é o de Receita — nenhuma linha do lançamento de Despesa deve continuar aparecendo.',
    dado: 'que existem lançamentos de receita e de despesa cadastrados',
    quando: 'o candidato filtra a lista por tipo "Receita"',
    entao: 'somente lançamentos de receita devem ser exibidos',
    dica: '[data-testid="filtro-tipo"]',
    comandos: ['visit', 'get', 'type', 'click', 'select', 'should'],
    codigoInicial: `cy.visit('/');\n${STUB}`,
  },
  {
    numero: 8,
    titulo: 'Deve manter os lançamentos após recarregar a página',
    contexto:
      'Testa a persistência local dos dados, não um cadastro em si. Passos esperados: (1) identifique-se; (2) cadastre um lançamento qualquer; (3) vá até a tela de Lançamentos e confirme que ele aparece na lista; (4) recarregue a página usando o comando de reload (não o de visitar, que reinicia todo o estado salvo — o objetivo aqui é justamente recarregar sem perder os dados); (5) volte para a tela de Lançamentos, se necessário; (6) confirme de novo que o mesmo lançamento continua na lista, mostrando que os dados persistiram.',
    dado: 'que o candidato cadastrou um lançamento',
    quando: 'a página é recarregada (cy.reload())',
    entao: 'o lançamento cadastrado deve continuar aparecendo na lista (persistência local)',
    dica: 'cy.reload() recarrega o iframe sem apagar o localStorage, ao contrário de cy.visit()',
    comandos: ['visit', 'get', 'type', 'click', 'reload', 'should'],
    codigoInicial: `cy.visit('/');\n${STUB}`,
  },
];
