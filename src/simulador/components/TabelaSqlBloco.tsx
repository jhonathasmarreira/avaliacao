import type { Questao } from '../types';

// Usado só em questões dissertativas de SQL (ver Questao.tabelaSql): mostra a
// tabela de referência (nome + colunas) em cima da qual o candidato escreve
// a consulta. Compartilhado entre QuestaoDescricao (Cypress) e
// FeatureDescricao (Cucumber).
export function TabelaSqlBloco({ tabelaSql }: { tabelaSql: NonNullable<Questao['tabelaSql']> }) {
  return (
    <div className="tabela-sql-wrapper">
      <p className="tabela-sql-nome">
        Tabela: <code>{tabelaSql.nome}</code>
      </p>
      <table data-testid="tabela-sql" className="tabela-sql">
        <thead>
          <tr>
            <th>Coluna</th>
            <th>Tipo</th>
          </tr>
        </thead>
        <tbody>
          {tabelaSql.colunas.map((coluna) => (
            <tr key={coluna.nome}>
              <td>
                <code>{coluna.nome}</code>
              </td>
              <td>{coluna.tipo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
