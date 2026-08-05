import type { Questao } from '../simulador/types';

// As 8 questões do simulador Cucumber — mesmos cenários (mesma regra de
// negócio) das 8 questões ativas do simulador Cypress em
// ../simulador/questoes.ts, só que aqui o candidato escreve puro Gherkin
// (Dado/Quando/Então/E em português) contra o catálogo fechado de steps de
// ./gherkinCatalogo.ts, em vez de código. `dica` lista os nomes amigáveis do
// dicionário de elementos necessários para essa questão; `comandos` lista os
// tipos de step esperados (sem a sintaxe exata); `passos` é o passo a passo
// detalhado, exibido só ao clicar em "Ver passo a passo".

const STUB = '# Escreva aqui o cenário em Gherkin usando os steps disponíveis.\nDado que ainda não implementei este cenário';

export const QUESTOES: Questao[] = [
  {
    numero: 1,
    titulo: 'Deve exibir a tela de identificação ao acessar a aplicação',
    contexto:
      'Todo teste começa do zero: o harness limpa o armazenamento local do app sob teste e recarrega o iframe antes de cada execução — você não precisa (nem deve) fazer isso manualmente.',
    dado: 'que o app sob teste é acessado pela primeira vez, sem dados salvos',
    entao: 'o sistema deve exibir a tela de identificação com os campos Nome completo e E-mail',
    dica: '"Tela de identificação" / "Campo Nome completo" / "Campo E-mail"',
    comandos: ['acesso a aplicação', 'devo ver'],
    passos: [
      'Escreva o step que acessa a aplicação.',
      'Escreva um step confirmando que a "Tela de identificação" deve ser vista.',
      'Escreva um step confirmando que o "Campo Nome completo" deve ser visto.',
      'Escreva um step confirmando que o "Campo E-mail" deve ser visto.',
      'Não é preciso preencher nada nesta questão — é só uma checagem do estado inicial.',
    ],
    codigoInicial: STUB,
  },
  {
    numero: 2,
    titulo: 'Deve exibir erro ao informar um e-mail em formato inválido',
    contexto:
      'Vai além do campo vazio: aqui o e-mail é preenchido, mas com um valor sem "@" (ex: "emailinvalido"), ou seja, um formato inválido.',
    dado: 'que o candidato está na tela de identificação',
    quando: 'preenche o nome e digita um e-mail sem "@" (ex: "emailinvalido")',
    e: 'clica em "Iniciar avaliação"',
    entao: 'o sistema deve exibir uma mensagem de erro de formato inválido e não avançar',
    dica: '"Campo Nome completo" / "Campo E-mail" / "Botão Iniciar avaliação" / "Erro do e-mail"',
    comandos: ['acesso a aplicação', 'preencho o campo', 'clico em', 'devo ver'],
    passos: [
      'Escreva o step que acessa a aplicação.',
      'Preencha o "Campo Nome completo" com qualquer texto válido.',
      'Preencha o "Campo E-mail" com um valor sem "@".',
      'Clique no "Botão Iniciar avaliação".',
      'Confirme que o "Erro do e-mail" deve ser visto.',
    ],
    codigoInicial: STUB,
  },
  {
    numero: 3,
    titulo: 'Deve avançar para o Dashboard ao preencher nome e e-mail válidos',
    contexto: 'O caminho feliz da identificação.',
    dado: 'que o candidato está na tela de identificação',
    quando: 'preenche nome completo e e-mail válidos e confirma',
    entao: 'o sistema deve exibir o Dashboard',
    dica: '"Campo Nome completo" / "Campo E-mail" / "Botão Iniciar avaliação" / "Card de saldo" (só existe depois da identificação)',
    comandos: ['acesso a aplicação', 'preencho o campo', 'clico em', 'devo ver'],
    passos: [
      'Escreva o step que acessa a aplicação.',
      'Preencha o "Campo Nome completo" com um nome completo qualquer.',
      'Preencha o "Campo E-mail" com um endereço em formato válido (com "@" e domínio).',
      'Clique no "Botão Iniciar avaliação".',
      'Confirme que o "Card de saldo" deve ser visto — ele só existe depois da identificação.',
    ],
    codigoInicial: STUB,
  },
  {
    numero: 4,
    titulo: 'Deve cadastrar uma receita com sucesso',
    contexto: 'Fluxo completo de cadastro, do zero.',
    dado: 'que o candidato preenche o modal de novo lançamento com tipo Receita',
    quando: 'informa descrição, valor, categoria e data válidos e salva',
    entao: 'o novo lançamento deve aparecer na lista de Lançamentos',
    dica: '"Botão Nova transação" / "Tipo Receita" / "Campo Descrição" / "Campo Valor" / "Campo Categoria" / "Campo Data" / "Botão Salvar" / "Menu Lançamentos" / "Linha do lançamento"',
    comandos: ['acesso a aplicação', 'preencho o campo', 'limpo o campo', 'seleciono a opção', 'clico em', 'deve conter o texto'],
    passos: [
      'Identifique-se primeiro — o estado é resetado antes de cada execução, então essa etapa precisa estar no cenário.',
      'Clique no "Botão Nova transação".',
      'Clique em "Tipo Receita".',
      'Preencha "Campo Descrição", "Campo Valor" e "Campo Data" com valores válidos (limpe o "Campo Data" antes de preenchê-lo, já que ele já vem com uma data padrão).',
      'Selecione uma opção válida no "Campo Categoria".',
      'Clique no "Botão Salvar".',
      'Clique no "Menu Lançamentos".',
      'Confirme que a "Linha do lançamento" deve conter o texto da descrição usada.',
    ],
    codigoInicial: STUB,
  },
  {
    numero: 5,
    titulo: 'Deve editar um lançamento existente e refletir a alteração na lista',
    contexto:
      'Depende de já existir um lançamento — como o estado é resetado a cada execução, o próprio cenário desta questão precisa criar um lançamento primeiro antes de editá-lo.',
    dado: 'que existe um lançamento cadastrado',
    quando: 'o candidato clica em editar, altera a descrição e salva',
    entao: 'a lista de lançamentos deve exibir a descrição atualizada',
    dica: '"Botão Editar" / "Campo Descrição" / "Botão Salvar" / "Descrição do lançamento"',
    comandos: ['acesso a aplicação', 'preencho o campo', 'limpo o campo', 'clico em', 'deve conter o texto'],
    passos: [
      'Identifique-se e cadastre um lançamento qualquer (descrição, valor e data válidos).',
      'Vá até o "Menu Lançamentos".',
      'Clique no "Botão Editar" desse lançamento.',
      'Limpe o "Campo Descrição" e preencha com uma descrição nova.',
      'Clique no "Botão Salvar" novamente.',
      'Confirme que a "Descrição do lançamento" deve conter o texto da descrição nova, não mais a antiga.',
    ],
    codigoInicial: STUB,
  },
  {
    numero: 6,
    titulo: 'Deve excluir um lançamento após confirmação',
    contexto: 'Também precisa de um lançamento prévio, criado dentro do próprio cenário da questão.',
    dado: 'que existe um lançamento cadastrado',
    quando: 'o candidato clica em excluir e confirma a exclusão',
    entao: 'o lançamento não deve mais aparecer na lista',
    dica: '"Botão Excluir" / "Botão Confirmar exclusão" / "Lista vazia"',
    comandos: ['acesso a aplicação', 'preencho o campo', 'limpo o campo', 'clico em', 'devo ver'],
    passos: [
      'Identifique-se e cadastre um lançamento qualquer.',
      'Vá até o "Menu Lançamentos".',
      'Clique no "Botão Excluir" desse lançamento — isso deve abrir um modal de confirmação.',
      'Clique no "Botão Confirmar exclusão".',
      'Confirme que a "Lista vazia" deve ser vista (era o único lançamento cadastrado).',
    ],
    codigoInicial: STUB,
  },
  {
    numero: 7,
    titulo: 'Deve filtrar os lançamentos por tipo',
    contexto: 'Precisa de pelo menos um lançamento de cada tipo, cadastrados dentro do próprio cenário da questão.',
    dado: 'que existem lançamentos de receita e de despesa cadastrados',
    quando: 'o candidato filtra a lista por tipo "Receita"',
    entao: 'somente lançamentos de receita devem ser exibidos',
    dica: '"Tipo Receita" / "Tipo Despesa" / "Campo Filtro de tipo" (aceita os valores "Receita"/"Despesa"/"Todos")',
    comandos: ['acesso a aplicação', 'preencho o campo', 'limpo o campo', 'clico em', 'seleciono a opção', 'lista deve ter N itens', 'deve conter o texto'],
    passos: [
      'Identifique-se.',
      'Cadastre um lançamento do tipo Receita.',
      'Cadastre um lançamento do tipo Despesa.',
      'Vá até o "Menu Lançamentos".',
      'Selecione a opção "Receita" no "Campo Filtro de tipo".',
      'Confirme que a lista de lançamentos deve ter 1 item.',
      'Confirme que a "Linha do lançamento" deve conter o texto da descrição da receita.',
    ],
    codigoInicial: STUB,
  },
  {
    numero: 8,
    titulo: 'Deve manter os lançamentos após recarregar a página',
    contexto: 'Testa a persistência local dos dados, não um cadastro em si.',
    dado: 'que o candidato cadastrou um lançamento',
    quando: 'a página é recarregada',
    entao: 'o lançamento cadastrado deve continuar aparecendo na lista (persistência local)',
    dica: 'O step "a página é recarregada" recarrega o app sem apagar o localStorage, ao contrário do step "que acesso a aplicação"',
    comandos: ['acesso a aplicação', 'preencho o campo', 'limpo o campo', 'clico em', 'a página é recarregada', 'deve conter o texto'],
    passos: [
      'Identifique-se e cadastre um lançamento qualquer.',
      'Vá até o "Menu Lançamentos" e confirme que ele deve conter o texto da descrição.',
      'Use o step "a página é recarregada" (não o de acessar a aplicação, que reinicia todo o estado salvo).',
      'Volte para o "Menu Lançamentos", se necessário.',
      'Confirme de novo que a "Linha do lançamento" deve conter o mesmo texto, mostrando que os dados persistiram.',
    ],
    codigoInicial: STUB,
  },
];
