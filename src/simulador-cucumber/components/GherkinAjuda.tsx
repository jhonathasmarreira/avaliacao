import { useState } from 'react';
import { PassosModal } from '../../simulador/components/PassosModal';
import { STEPS_DISPONIVEIS, ELEMENTOS_DISPONIVEIS } from '../gherkinCatalogo';

const LINHAS_AJUDA = [
  ...STEPS_DISPONIVEIS,
  '— Elementos conhecidos —',
  ...ELEMENTOS_DISPONIVEIS.map((nome) => `"${nome}"`),
];

// Vocabulário fechado: diferente do editor de código do simulador Cypress
// (onde qualquer JS válido funciona), aqui o candidato só pode usar os steps
// e elementos catalogados — por isso essa referência precisa ficar sempre
// acessível, não só como dica pontual por questão.
export function GherkinAjuda() {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <button
        data-testid="btn-ver-steps"
        className="btn-secondary btn-passos"
        onClick={() => setAberto(true)}
      >
        Ver steps e elementos disponíveis
      </button>
      {aberto && (
        <PassosModal
          titulo="Steps e elementos disponíveis"
          passos={LINHAS_AJUDA}
          onFechar={() => setAberto(false)}
        />
      )}
    </>
  );
}
