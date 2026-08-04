import { useState } from 'react';
import type { Questao } from '../types';
import { PassosModal } from './PassosModal';

export function QuestaoDescricao({ questao }: { questao: Questao }) {
  const [passosAbertos, setPassosAbertos] = useState(false);

  return (
    <div data-testid="questao-descricao" className="questao-descricao">
      <h2>
        Questão {String(questao.numero).padStart(2, '0')} — {questao.titulo}
      </h2>
      <p className="questao-contexto">{questao.contexto}</p>
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
      {questao.passos && questao.passos.length > 0 && (
        <button
          data-testid="btn-ver-passos"
          className="btn-secondary btn-passos"
          onClick={() => setPassosAbertos(true)}
        >
          Ver passo a passo
        </button>
      )}
      {questao.dica && (
        <p className="questao-dica">
          Dica: <code>{questao.dica}</code>
        </p>
      )}
      {questao.comandos && questao.comandos.length > 0 && (
        <p className="questao-comandos">
          Comandos sugeridos: <code>{questao.comandos.join(', ')}</code>
        </p>
      )}
      {passosAbertos && questao.passos && (
        <PassosModal
          titulo={questao.titulo}
          passos={questao.passos}
          onFechar={() => setPassosAbertos(false)}
        />
      )}
    </div>
  );
}
