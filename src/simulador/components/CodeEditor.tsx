import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { autocompletion } from '@codemirror/autocomplete';
import { cyCompletionSource } from '../miniCy/autocomplete';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onExecutar?: () => void;
}

export function CodeEditor({ value, onChange, onExecutar }: Props) {
  return (
    <div
      data-testid="code-editor"
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
        extensions={[javascript(), autocompletion({ override: [cyCompletionSource] })]}
        onChange={onChange}
        basicSetup={{ lineNumbers: true, foldGutter: false, autocompletion: false }}
      />
    </div>
  );
}
