import { criarSimuladorStore } from '../../simulador/store/criarSimuladorStore';
import { QUESTOES } from '../questoes';

export const useSimuladorCucumberStore = criarSimuladorStore(QUESTOES);
