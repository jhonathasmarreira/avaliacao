import type { Questao } from '../types';

export function QuestaoDescricao({ questao }: { questao: Questao }) {
  return (
    <div data-testid="questao-descricao" className="questao-descricao">
      <h2>
        Questão {String(questao.numero).padStart(2, '0')} — {questao.titulo}
      </h2>
      <ul className="bdd-lista">
        <li>
          <strong>Dado</strong> {questao.dado}
        </li>
        {questao.quando && (
          <li>
            <strong>Quando</strong> {questao.quando}
          </li>
        )}
        {questao.e && (
          <li>
            <strong>E</strong> {questao.e}
          </li>
        )}
        <li>
          <strong>Então</strong> {questao.entao}
        </li>
      </ul>
      {questao.dica && (
        <p className="questao-dica">
          Dica: <code>{questao.dica}</code>
        </p>
      )}
    </div>
  );
}
