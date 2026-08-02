import type { LinhaLog } from '../types';

const ICONE: Record<LinhaLog['tipo'], string> = {
  erro: '✖',
  sucesso: '✔',
  info: 'ℹ',
  comando: '›',
};

export function ResultadoLogPanel({ log }: { log: LinhaLog[] }) {
  return (
    <div data-testid="log-execucao" className="log-panel">
      {log.length === 0 && <p className="log-vazio">Execute o teste para ver o resultado aqui.</p>}
      {log.map((linha, i) => (
        <p key={i} className={`log-linha log-${linha.tipo}`}>
          {ICONE[linha.tipo]} {linha.texto}
        </p>
      ))}
    </div>
  );
}
