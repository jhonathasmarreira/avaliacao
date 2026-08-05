import CodeMirror from '@uiw/react-codemirror';
import { autocompletion } from '@codemirror/autocomplete';
import { gherkinCompletionSource } from '../gherkinAutocomplete';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onExecutar?: () => void;
}

export function GherkinEditor({ value, onChange, onExecutar }: Props) {
  return (
    <div
      data-testid="gherkin-editor"
      className="code-editor-wrapper"
      onKeyDown={(e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          e.preventDefault();
          onExecutar?.();
        }
      }}
    >
      <CodeMirror
        value={value}
        height="260px"
        theme="dark"
        extensions={[autocompletion({ override: [gherkinCompletionSource] })]}
        onChange={onChange}
        basicSetup={{ lineNumbers: true, foldGutter: false, autocompletion: false }}
      />
    </div>
  );
}
