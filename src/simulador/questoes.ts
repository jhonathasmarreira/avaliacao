import type { Questao } from './types';

// As 3 questões ativas do simulador. Cada uma descreve um cenário no formato
// Dado/Quando/Então (mesma convenção usada no restante do projeto) e traz
// o código inicial que o candidato edita no editor embutido. O comando
// cy.implementeAqui() sempre falha — é o sinal de "questão pendente";
// o candidato apaga essa linha e escreve a implementação real por baixo,
// usando a API cy.* do simulador (documentada no painel de ajuda da tela).
// `comandos` só nomeia os comandos esperados (get, should, etc.), sem
// explicar como usá-los. `passos` é o passo a passo detalhado, exibido só
// quando o candidato clica no botão "Ver passo a passo" na tela da questão.
//
// Existem mais 17 questões fora deste conjunto ativo, guardadas em
// ./questoes-arquivadas.ts para uso futuro (ex: montar uma prova mais longa,
// ou trocar alguma questão daqui por outra do arquivo).

const STUB = "cy.implementeAqui();";

export const QUESTOES: Questao[] = [
  {
    numero: 1,
    titulo: 'Deve exibir a tela de identificação ao acessar a aplicação',
    contexto:
      'Antes de cada execução, o simulador já limpa os dados salvos do app sob teste e recarrega a página sozinho. Você não precisa (nem deve) fazer isso no seu código — comece direto pelo cenário abaixo.',
    dado: 'que o app sob teste é acessado pela primeira vez, sem dados salvos',
    entao: 'o sistema deve exibir a tela de identificação com os campos Nome completo e E-mail',
    dica: '[data-testid="identificacao-page"] / [data-testid="input-nome"] / [data-testid="input-email"]',
    comandos: ['visit', 'get', 'should'],
    passos: [
      'Visite a aplicação.',
      'Confirme que o container da tela de identificação está visível.',
      'Confirme que os dois campos de entrada, nome e e-mail, existem na tela.',
      'Não é preciso preencher nada nesta questão — é só uma checagem do estado inicial.',
    ],
    codigoInicial: `cy.visit('/');\n${STUB}`,
  },
  {
    numero: 2,
    titulo: 'Deve avançar para o Dashboard ao preencher nome e e-mail válidos',
    contexto: 'O caminho feliz da identificação.',
    dado: 'que o candidato está na tela de identificação',
    quando: 'preenche nome completo e e-mail válidos e confirma',
    entao: 'o sistema deve exibir o Dashboard',
    dica: '[data-testid="card-saldo"] só existe depois da identificação',
    comandos: ['visit', 'get', 'type', 'click', 'should'],
    passos: [
      'Visite a aplicação.',
      'Preencha o campo nome com um nome completo qualquer.',
      'Preencha o campo e-mail com um endereço em formato válido (com "@" e domínio).',
      'Clique no botão de iniciar a avaliação.',
      'Confirme que um elemento que só existe depois da identificação — como o card de saldo do Dashboard — fica visível na tela.',
    ],
    codigoInicial: `cy.visit('/');\n${STUB}`,
  },
  {
    numero: 3,
    titulo: 'Deve cadastrar uma receita com sucesso',
    contexto: 'Fluxo completo de cadastro, do zero.',
    dado: 'que o candidato preenche o modal de novo lançamento com tipo Receita',
    quando: 'informa descrição, valor, categoria e data válidos e salva',
    entao: 'o novo lançamento deve aparecer na lista de Lançamentos',
    dica: '[data-testid="tipo-receita"] / [data-testid="select-categoria"] / [data-testid="input-data"]',
    comandos: ['visit', 'get', 'type', 'click', 'select', 'should'],
    passos: [
      'Identifique-se primeiro, preenchendo nome e e-mail válidos e confirmando — o estado é resetado antes de cada execução, então essa etapa precisa estar no código.',
      'Abra o modal de nova transação a partir do Dashboard.',
      'Selecione o tipo Receita.',
      'Preencha descrição, valor, categoria e data, todos com valores válidos.',
      'Salve o formulário.',
      'Navegue até a tela de Lançamentos (o data-testid="linha-lancamento" só existe lá, não no Dashboard).',
      'Confirme que a linha do lançamento recém-criado aparece na lista, contendo a descrição informada.',
    ],
    codigoInicial: `cy.visit('/');\n${STUB}`,
  },
];
