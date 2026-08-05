import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SimuladorApp } from './simulador/SimuladorApp';
import { useSimuladorCucumberStore } from './simulador-cucumber/store/useSimuladorCucumberStore';
import { QUESTOES } from './simulador-cucumber/questoes';
import { SimuladorPage } from './simulador-cucumber/pages/SimuladorPage';
import './index.css';
import './simulador/simulador.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SimuladorApp
      useStore={useSimuladorCucumberStore}
      questoes={QUESTOES}
      nomeProva="Simulador Cucumber"
      logo="🥒"
      titulo="Simulador Cucumber - Avaliação Técnica"
      descricao={`${QUESTOES.length} questões práticas no modelo Java/Cucumber/Selenium com Page Object. A feature (Gherkin) já vem pronta; você implementa os métodos das classes Page e Steps e roda direto no navegador — ao final, o resultado é enviado por e-mail automaticamente.`}
    >
      <SimuladorPage />
    </SimuladorApp>
  </StrictMode>
);
