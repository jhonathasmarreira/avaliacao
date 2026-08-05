export interface Candidato {
  nomeCompleto: string;
  email: string;
}

export interface Questao {
  numero: number;
  titulo: string;
  contexto: string;
  dado: string;
  quando?: string;
  entao: string;
  e?: string;
  dica?: string;
  comandos?: string[];
  passos?: string[];
  /** Usado só pelo simulador Cucumber (Java/Page Object): texto completo da
   *  feature (cada linha já com "Dado "/"Quando "/"Então "/"E " na frente),
   *  exibido ao candidato e usado pelo motor pra casar com os métodos
   *  anotados da classe Steps. */
  featureLinhas?: string[];
  codigoInicial: string;
}

export type StatusQuestao = 'pendente' | 'executando' | 'aprovada' | 'reprovada';

export interface LinhaLog {
  tipo: 'comando' | 'sucesso' | 'erro' | 'info';
  texto: string;
}

export interface Resposta {
  codigo: string;
  status: StatusQuestao;
  log: LinhaLog[];
  erro?: string;
}

export type Fase = 'identificacao' | 'simulador' | 'finalizado';

export interface SandboxController {
  getDocument(): Document;
  getWindow(): Window;
  clearAppStorage(): void;
  /** Limpa o storage do app sob teste e recarrega o iframe do zero. */
  reset(): Promise<void>;
  /** Recarrega o iframe sem limpar o storage (equivalente a cy.reload()). */
  reload(): Promise<void>;
}
