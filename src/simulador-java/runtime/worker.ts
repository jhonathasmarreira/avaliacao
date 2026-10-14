import { executarJava, type PedidoExecucao } from './executor';

// Um worker novo por execução: isola os patches de protótipo do runtime e
// permite matar um laço infinito do candidato sem travar a aba (ver runner.ts).
self.onmessage = (e: MessageEvent<PedidoExecucao>) => {
  self.postMessage(executarJava(e.data));
};
