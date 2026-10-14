import type { Questao } from './types';

// Questão dissertativa de SQL, a mesma no fim de todas as provas. Recebe o
// número porque cada prova tem uma quantidade diferente de questões antes dela.
export function questaoSql(numero: number): Questao {
  return {
    numero,
    titulo: 'Deve retornar apenas as colunas necessárias em uma consulta SQL',
    contexto:
      'Questão dissertativa: diferente das outras, aqui você não escreve um teste automatizado nem interage com o app sob teste. Escreva o comando SQL na caixa de texto abaixo. A correção é manual, feita pelo avaliador depois.',
    dado: 'que existe uma tabela lancamentos no banco de dados, com as colunas ao lado',
    entao: 'o candidato deve escrever um comando SELECT que retorne apenas as colunas descricao e valor dessa tabela',
    dica: 'Use SELECT com a lista de colunas separada por vírgula, não SELECT *.',
    dissertativa: true,
    tabelaSql: {
      nome: 'lancamentos',
      colunas: [
        { nome: 'id', tipo: 'INT' },
        { nome: 'descricao', tipo: 'VARCHAR(100)' },
        { nome: 'valor', tipo: 'DECIMAL(10,2)' },
        { nome: 'tipo', tipo: "VARCHAR(10) ('receita' ou 'despesa')" },
        { nome: 'categoria', tipo: 'VARCHAR(50)' },
        { nome: 'data', tipo: 'DATE' },
      ],
    },
    passos: [
      'Identifique quais colunas a questão pede: descricao e valor.',
      'Escreva um SELECT informando só essas colunas, separadas por vírgula (não use SELECT *).',
      'Informe a cláusula FROM com o nome da tabela: lancamentos.',
    ],
    codigoInicial: '-- Escreva seu SELECT aqui\n',
  };
}
