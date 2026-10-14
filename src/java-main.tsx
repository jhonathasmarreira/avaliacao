import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SimuladorApp } from './simulador/SimuladorApp';
import { useSimuladorJavaStore } from './simulador-java/store/useSimuladorJavaStore';
import { QUESTOES } from './simulador-java/questoes';
import { SimuladorPage } from './simulador-java/pages/SimuladorPage';
import './index.css';
import './simulador/simulador.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SimuladorApp
      useStore={useSimuladorJavaStore}
      questoes={QUESTOES}
      nomeProva="Simulador Java Pleno"
      logo="☕"
      titulo="Simulador Java Pleno - Avaliação Técnica"
      descricao={`${QUESTOES.length} questões: 3 práticas de Java (coleções, streams, exceções) compiladas e testadas direto no navegador, e 1 de SQL. Ao final, o resultado é enviado por e-mail automaticamente.`}
    >
      <SimuladorPage />
    </SimuladorApp>
  </StrictMode>
);
