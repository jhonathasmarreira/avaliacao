import type { Questao } from './types';

// As 20 questões do simulador. Cada uma descreve um cenário no formato
// Dado/Quando/Então (mesma convenção usada no restante do projeto) e traz
// o código inicial que o candidato edita no editor embutido. O comando
// cy.implementeAqui() sempre falha — é o sinal de "questão pendente";
// o candidato apaga essa linha e escreve a implementação real por baixo,
// usando a API cy.* do simulador (documentada no painel de ajuda da tela).

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
    titulo: 'Deve exibir erro ao tentar avançar com o nome vazio',
    contexto:
      'Testa a validação obrigatória do campo nome. O candidato deve preencher só o e-mail, deixando o nome vazio, e confirmar que o formulário não avança para o Dashboard — a mensagem de erro correta deve aparecer perto do campo nome.',
    dado: 'que o candidato está na tela de identificação',
    quando: 'preenche apenas o e-mail e clica em "Iniciar avaliação"',
    entao: 'o sistema deve exibir uma mensagem de erro no campo nome e não avançar',
    dica: '[data-testid="erro-nome"] / [data-testid="btn-iniciar"]',
    codigoInicial: `cy.visit('/');\n${STUB}`,
  },
  {
    numero: 3,
    titulo: 'Deve exibir erro ao tentar avançar com o e-mail vazio',
    contexto:
      'Espelha a questão anterior, mas validando o campo e-mail: preencha somente o nome e tente avançar. O sistema não deve deixar seguir para o Dashboard sem um e-mail informado.',
    dado: 'que o candidato está na tela de identificação',
    quando: 'preenche apenas o nome e clica em "Iniciar avaliação"',
    entao: 'o sistema deve exibir uma mensagem de erro no campo e-mail e não avançar',
    dica: '[data-testid="erro-email"]',
    codigoInicial: `cy.visit('/');\n${STUB}`,
  },
  {
    numero: 4,
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
    numero: 5,
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
    numero: 6,
    titulo: 'Deve exibir os cards zerados no Dashboard quando não há lançamentos',
    contexto:
      'Depois de se identificar, sem nenhum lançamento cadastrado, os três cards do Dashboard (Receitas, Despesas e Saldo) devem mostrar valores zerados formatados em Real. Lembre que o "R$" tem um espaço não separável antes do número — prefira validar só a parte numérica (ex: "0,00").',
    dado: 'que o candidato acabou de se identificar e não possui lançamentos',
    entao: 'os cards de Receitas, Despesas e Saldo devem exibir R$ 0,00',
    dica: '[data-testid="card-receitas"] / [data-testid="card-despesas"] / [data-testid="card-saldo"]',
    codigoInicial: `cy.visit('/');\n${STUB}`,
  },
  {
    numero: 7,
    titulo: 'Deve exibir o nome do candidato no menu lateral após a identificação',
    contexto:
      'Confirma que o nome informado na identificação é propagado para a interface do app sob teste, aparecendo no menu lateral. É um bom teste de "os dados da identificação realmente chegaram à aplicação".',
    dado: 'que o candidato se identificou com um nome completo',
    entao: 'o menu lateral deve exibir esse nome',
    dica: '[data-testid="user-nome"]',
    codigoInicial: `cy.visit('/');\n${STUB}`,
  },
  {
    numero: 8,
    titulo: 'Deve navegar do Dashboard para Lançamentos pelo menu lateral',
    contexto:
      'Testa a navegação básica entre as duas telas principais do app. Depois de clicar em "Lançamentos" no menu, confirme que algum elemento exclusivo dessa tela (como o contador de lançamentos) fica visível.',
    dado: 'que o candidato está no Dashboard',
    quando: 'clica no item "Lançamentos" do menu lateral',
    entao: 'a aplicação deve exibir a tela de Lançamentos',
    dica: '[data-testid="nav-lancamentos"] / [data-testid="contador-lancamentos"]',
    codigoInicial: `cy.visit('/');\n${STUB}`,
  },
  {
    numero: 9,
    titulo: 'Deve abrir o modal de novo lançamento a partir do Dashboard',
    contexto:
      'Valida apenas a abertura do modal, sem preencher nada — clique no botão "+ Nova transação" e confirme que o modal fica visível. Serve de base para as questões seguintes, que preenchem e salvam o formulário.',
    dado: 'que o candidato está no Dashboard',
    quando: 'clica no botão "+ Nova transação"',
    entao: 'o modal de nova transação deve ser exibido',
    dica: '[data-testid="btn-nova-transacao"] / [data-testid="modal-transacao"]',
    codigoInicial: `cy.visit('/');\n${STUB}`,
  },
  {
    numero: 10,
    titulo: 'Deve exibir erro ao salvar um lançamento sem descrição',
    contexto:
      'Validação obrigatória do campo descrição dentro do modal: preencha o valor, deixe a descrição em branco e tente salvar. O modal precisa continuar aberto e mostrar a mensagem de erro correspondente, sem criar o lançamento.',
    dado: 'que o modal de novo lançamento está aberto',
    quando: 'preenche apenas o valor e tenta salvar, deixando a descrição em branco',
    entao: 'o sistema deve exibir um erro no campo descrição e não fechar o modal',
    dica: '[data-testid="input-valor"] / [data-testid="btn-salvar"] / [data-testid="erro-descricao"]',
    codigoInicial: `cy.visit('/');\n${STUB}`,
  },
  {
    numero: 11,
    titulo: 'Deve exibir erro ao salvar um lançamento com valor zero ou negativo',
    contexto:
      'Testa a regra de negócio de que o valor precisa ser maior que zero. Preencha a descrição normalmente, mas informe "0" no valor e tente salvar — o erro customizado do campo valor deve aparecer e o modal não pode fechar.',
    dado: 'que o modal de novo lançamento está aberto',
    quando: 'preenche a descrição e informa um valor igual a 0',
    e: 'tenta salvar',
    entao: 'o sistema deve exibir um erro no campo valor e não fechar o modal',
    dica: '[data-testid="erro-valor"]',
    codigoInicial: `cy.visit('/');\n${STUB}`,
  },
  {
    numero: 12,
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
    numero: 13,
    titulo: 'Deve cadastrar uma despesa com sucesso',
    contexto:
      'Mesmo fluxo da questão anterior, agora com o tipo Despesa selecionado. Confirme também na tela de Lançamentos, já que é lá que a lista de lançamentos é renderizada.',
    dado: 'que o candidato preenche o modal de novo lançamento com tipo Despesa',
    quando: 'informa descrição, valor, categoria e data válidos e salva',
    entao: 'o novo lançamento deve aparecer na lista de Lançamentos',
    dica: '[data-testid="tipo-despesa"]',
    codigoInicial: `cy.visit('/');\n${STUB}`,
  },
  {
    numero: 14,
    titulo: 'Deve atualizar o card de Saldo no Dashboard após um novo lançamento',
    contexto:
      'Verifica que o Dashboard reage ao novo estado da aplicação: cadastre uma receita de R$ 100,00 e volte (ou permaneça) no Dashboard para conferir que o card de Saldo passa a refletir esse valor, e não continua zerado.',
    dado: 'que o candidato está no Dashboard sem lançamentos',
    quando: 'cadastra uma receita de R$ 100,00',
    entao: 'o card de Saldo deve passar a exibir R$ 100,00',
    dica: '[data-testid="card-saldo"] — lembre de fechar o modal antes de checar o card',
    codigoInicial: `cy.visit('/');\n${STUB}`,
  },
  {
    numero: 15,
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
    numero: 16,
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
    numero: 17,
    titulo: 'Deve cancelar a exclusão de um lançamento',
    contexto:
      'Caminho oposto ao da questão 16: abra o modal de exclusão, mas clique em "Cancelar" em vez de confirmar. O lançamento precisa continuar existindo na lista normalmente, como se nada tivesse acontecido.',
    dado: 'que existe um lançamento cadastrado e o modal de exclusão está aberto',
    quando: 'o candidato clica em "Cancelar"',
    entao: 'o lançamento deve continuar aparecendo na lista',
    dica: '[data-testid="btn-cancelar-exclusao"]',
    codigoInicial: `cy.visit('/');\n${STUB}`,
  },
  {
    numero: 18,
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
    numero: 19,
    titulo: 'Deve exibir mensagem de lista vazia quando não houver lançamentos',
    contexto:
      'Estado vazio da tela de Lançamentos: sem nenhum lançamento cadastrado, a lista não deve aparecer em branco — deve haver uma mensagem explícita informando que não há lançamentos.',
    dado: 'que o candidato está na tela de Lançamentos sem nenhum lançamento cadastrado',
    entao: 'o sistema deve exibir uma mensagem informando que a lista está vazia',
    dica: '[data-testid="lista-vazia"]',
    codigoInicial: `cy.visit('/');\n${STUB}`,
  },
  {
    numero: 20,
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
