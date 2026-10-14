import { criarSimuladorStore } from '../../simulador/store/criarSimuladorStore';
import { QUESTOES } from '../questoes';

export const useSimuladorJavaStore = criarSimuladorStore(QUESTOES);
