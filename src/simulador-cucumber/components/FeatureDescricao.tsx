import { useState } from 'react';
import type { Questao } from '../../simulador/types';
import { PassosModal } from '../../simulador/components/PassosModal';

// Equivalente ao QuestaoDescricao do simulador Cypress, mas mostrando a
// feature Gherkin completa (já pronta, só leitura) como um bloco de código,
// em vez da lista Dado/Quando/Então usada lá.
export function FeatureDescricao({ questao }: { questao: Questao }) {
  const [passosAbertos, setPassosAbertos] = useState(false);

  return (
    <div data-testid="questao-descricao" className="questao-descricao">
      <h2>
        Questão {String(questao.numero).padStart(2, '0')} — {questao.titulo}
      </h2>
      <p className="questao-contexto">{questao.contexto}</p>

      <pre data-testid="feature-bloco" className="feature-bloco">
        {(questao.featureLinhas ?? []).join('\n')}
      </pre>

      <p className="questao-aviso-this">
        ⚠ Diferente de Java: em JavaScript, campos e métodos da própria classe
        sempre precisam do prefixo <code>this.</code> — use{' '}
        <code>this.page.metodo()</code>, nunca só <code>page.metodo()</code>.
      </p>

      {questao.localizadores && (
        <div className="questao-localizadores-bloco">
          <span className="questao-localizadores-titulo">
            Localizadores sugeridos (monte com By.cssSelector no construtor da Page):
          </span>
          <pre data-testid="questao-localizadores" className="questao-localizadores">
            {questao.localizadores}
          </pre>
        </div>
      )}

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
          API sugerida: <code>{questao.comandos.join(', ')}</code>
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
