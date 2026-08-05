import { useState } from 'react';
import type { Questao } from '../types';
import { PassosModal } from './PassosModal';

// Assertions aceitas pelo primeiro argumento de cy.get(...).should(...) —
// ver checkShould em miniCy/asserts.ts. Exibida só quando a questão sugere
// o comando `should`, pra dar uma pista de com o que preenchê-lo.
const ASSERTIONS_SHOULD = [
  'exist',
  'not.exist',
  'be.visible',
  'not.be.visible',
  'have.value',
  'have.text',
  'contain',
  'have.length',
  'be.checked',
  'be.disabled',
  'be.enabled',
  'have.class',
  'not.have.class',
];

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
      {questao.comandos?.includes('should') && (
        <p className="questao-comandos">
          Dentro do <code>should(...)</code>, use: <code>{ASSERTIONS_SHOULD.join(', ')}</code>
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
