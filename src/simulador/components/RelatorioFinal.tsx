import { useEffect, useRef } from 'react';
import type { UseBoundStore, StoreApi } from 'zustand';
import type { SimuladorState } from '../store/criarSimuladorStore';
import type { Questao } from '../types';
import { enviarRelatorio } from '../email/enviarRelatorio';

interface Props {
  useStore: UseBoundStore<StoreApi<SimuladorState>>;
  questoes: Questao[];
  nomeProva: string;
}

// Compartilhado entre o simulador Cypress e o Cucumber: ambos usam stores
// com o mesmo formato (criadas por criarSimuladorStore), então essa tela só
// precisa receber qual store e qual lista de questões usar.
export function RelatorioFinal({ useStore, questoes, nomeProva }: Props) {
  const candidato = useStore((s) => s.candidato);
  const respostas = useStore((s) => s.respostas);
  const envioStatus = useStore((s) => s.envioStatus);
  const setEnvioStatus = useStore((s) => s.setEnvioStatus);
  const jaEnviou = useRef(false);

  useEffect(() => {
    if (jaEnviou.current || !candidato) return;
    jaEnviou.current = true;
    setEnvioStatus('enviando');
    enviarRelatorio(questoes, candidato, respostas, nomeProva).then((resultado) => {
      // Motivo do erro só vai pro console (ajuda quem for depurar o envio):
      // a tela do candidato mostra só um aviso genérico, sem detalhes técnicos.
      if (!resultado.ok) console.error('Falha ao enviar relatório da avaliação:', resultado.motivo);
      setEnvioStatus(resultado.ok ? 'enviado' : 'erro');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!candidato) return null;

  return (
    <div data-testid="relatorio-final" className="id-wrapper">
      <div className="id-card relatorio-card">
        <div className="id-header">
          <div className="id-logo">✅</div>
          <h1>Avaliação finalizada</h1>
          <p>Obrigado pela participação, {candidato.nomeCompleto.split(' ')[0]}!</p>
        </div>

        {/* Resultado não é mostrado ao candidato de propósito: só o avaliador vê,
            pelo relatório que a aplicação envia por e-mail. */}
        <p className="relatorio-agradecimento">
          Seu resultado foi registrado e enviado para análise do avaliador. Você já pode fechar
          esta página.
        </p>

        {envioStatus === 'enviando' && <p className="envio-status">Enviando relatório…</p>}
        {envioStatus === 'enviado' && (
          <p data-testid="envio-sucesso" className="envio-status envio-ok">
            Relatório enviado com sucesso.
          </p>
        )}
        {envioStatus === 'erro' && (
          <p data-testid="envio-erro" className="envio-status envio-falha">
            Não foi possível confirmar o envio automático do relatório. Avise o avaliador
            informando que você concluiu a prova.
          </p>
        )}
      </div>
    </div>
  );
}
