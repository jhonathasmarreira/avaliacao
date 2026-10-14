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
  /** Usado só pelo simulador Cucumber (Java/Page Object): lista "campo →
   *  seletor" com os data-testid que o candidato precisa localizar — os
   *  campos ficam de fora do codigoInicial de propósito, o candidato quem
   *  escreve `this.campo = By.cssSelector(...)` no construtor da Page. */
  localizadores?: string;
  /** Quando true, a questão não roda contra o app sob teste: o candidato escreve
   *  uma resposta livre (ex: um comando SQL) num campo de texto simples, sem
   *  execução nem correção automática — o avaliador lê a resposta no relatório
   *  final e corrige manualmente. */
  dissertativa?: boolean;
  /** Usado só em questões dissertativas: a tabela de referência (nome + colunas)
   *  mostrada ao candidato pra ele escrever a consulta em cima dela. */
  tabelaSql?: { nome: string; colunas: { nome: string; tipo: string }[] };
  /** Usado só pelo simulador Java Pleno: código-fonte (só leitura) das classes
   *  que o candidato pode usar, mas não edita (ex: Lancamento). */
  classesApoio?: string;
  codigoInicial: string;
}

export type StatusQuestao = 'pendente' | 'executando' | 'aprovada' | 'reprovada' | 'respondida';

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
