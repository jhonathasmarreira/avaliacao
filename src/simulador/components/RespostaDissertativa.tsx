interface Props {
  value: string;
  onChange: (value: string) => void;
  onSalvar?: () => void;
}

// Campo de texto livre usado em questões dissertativas (ver Questao.dissertativa):
// sem execução nem correção automática, diferente do CodeEditor/JavaEditor.
// Compartilhado entre o simulador Cypress e o Cucumber.
export function RespostaDissertativa({ value, onChange, onSalvar }: Props) {
  return (
    <textarea
      data-testid="editor-dissertativa"
      className="dissertativa-textarea"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          e.preventDefault();
          onSalvar?.();
        }
      }}
      placeholder="Escreva sua resposta aqui…"
      spellCheck={false}
    />
  );
}
