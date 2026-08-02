import { useEffect, useRef } from 'react';
import { useSimuladorStore } from '../store/useSimuladorStore';
import { enviarRelatorio, montarResumoTexto, contarAprovadas } from '../email/enviarRelatorio';
import { QUESTOES } from '../questoes';

export function RelatorioFinal() {
  const candidato = useSimuladorStore((s) => s.candidato);
  const respostas = useSimuladorStore((s) => s.respostas);
  const envioStatus = useSimuladorStore((s) => s.envioStatus);
  const envioMotivo = useSimuladorStore((s) => s.envioMotivo);
  const setEnvioStatus = useSimuladorStore((s) => s.setEnvioStatus);
  const jaEnviou = useRef(false);

  useEffect(() => {
    if (jaEnviou.current || !candidato) return;
    jaEnviou.current = true;
    setEnvioStatus('enviando');
    enviarRelatorio(candidato, respostas).then((resultado) => {
      setEnvioStatus(resultado.ok ? 'enviado' : 'erro', resultado.motivo);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!candidato) return null;

  const aprovadas = contarAprovadas(respostas);
  const resumo = montarResumoTexto(candidato, respostas);

  function copiar() {
    navigator.clipboard?.writeText(resumo);
  }

  return (
    <div data-testid="relatorio-final" className="id-wrapper">
      <div className="id-card relatorio-card">
        <div className="id-header">
          <div className="id-logo">✅</div>
          <h1>Avaliação finalizada</h1>
          <p>Obrigado, {candidato.nomeCompleto.split(' ')[0]}!</p>
        </div>

        <p data-testid="relatorio-placar" className="relatorio-placar">
          {aprovadas} de {QUESTOES.length} questões aprovadas
        </p>

        {envioStatus === 'enviando' && <p className="envio-status">Enviando relatório por e-mail…</p>}
        {envioStatus === 'enviado' && (
          <p data-testid="envio-sucesso" className="envio-status envio-ok">
            Relatório enviado com sucesso para o avaliador.
          </p>
        )}
        {envioStatus === 'erro' && (
          <div data-testid="envio-erro" className="envio-status envio-falha">
            <p>Não foi possível enviar automaticamente: {envioMotivo}</p>
            <button className="btn-secondary" onClick={copiar}>
              Copiar relatório
            </button>
          </div>
        )}

        <pre data-testid="relatorio-detalhe" className="relatorio-detalhe">
          {resumo}
        </pre>
      </div>
    </div>
  );
}
