import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SimuladorApp } from './simulador/SimuladorApp';
import { useSimuladorStore } from './simulador/store/useSimuladorStore';
import { QUESTOES } from './simulador/questoes';
import { SimuladorPage } from './simulador/pages/SimuladorPage';
import './index.css';
import './simulador/simulador.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SimuladorApp
      useStore={useSimuladorStore}
      questoes={QUESTOES}
      nomeProva="Simulador Cypress"
      logo="🧪"
      titulo="Simulador Cypress - Avaliação Técnica"
      descricao={`${QUESTOES.length} questões práticas. Você escreve o teste em um editor de código embutido e roda direto no navegador — ao final, o resultado é enviado por e-mail automaticamente.`}
    >
      <SimuladorPage />
    </SimuladorApp>
  </StrictMode>
);
