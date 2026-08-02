import { useEffect, useRef } from 'react';
import { useSimuladorStore } from '../store/useSimuladorStore';
import { enviarRelatorio } from '../email/enviarRelatorio';

export function RelatorioFinal() {
  const candidato = useSimuladorStore((s) => s.candidato);
  const respostas = useSimuladorStore((s) => s.respostas);
  const envioStatus = useSimuladorStore((s) => s.envioStatus);
  const setEnvioStatus = useSimuladorStore((s) => s.setEnvioStatus);
  const jaEnviou = useRef(false);

  useEffect(() => {
    if (jaEnviou.current || !candidato) return;
    jaEnviou.current = true;
    setEnvioStatus('enviando');
    enviarRelatorio(candidato, respostas).then((resultado) => {
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
