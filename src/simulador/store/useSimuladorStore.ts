import { QUESTOES } from '../questoes';
import { criarSimuladorStore } from './criarSimuladorStore';

export type { EnvioStatus } from './criarSimuladorStore';

export const useSimuladorStore = criarSimuladorStore(QUESTOES);
