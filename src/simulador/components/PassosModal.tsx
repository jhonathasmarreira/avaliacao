interface Props {
  titulo: string;
  passos: string[];
  onFechar: () => void;
}

export function PassosModal({ titulo, passos, onFechar }: Props) {
  return (
    <div className="passos-overlay" onClick={onFechar}>
      <div
        data-testid="passos-modal"
        className="passos-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="passos-header">
          <h3>Passo a passo — {titulo}</h3>
          <button
            data-testid="btn-fechar-passos"
            className="passos-fechar"
            onClick={onFechar}
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>
        <ol className="passos-lista">
          {passos.map((passo, i) => (
            <li key={i}>{passo}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
