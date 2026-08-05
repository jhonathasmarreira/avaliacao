import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { autocompletion } from '@codemirror/autocomplete';
import { seleniumCompletionSource } from '../miniSelenium/autocomplete';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onExecutar?: () => void;
}

export function JavaEditor({ value, onChange, onExecutar }: Props) {
  return (
    <div
      data-testid="java-editor"
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
        height="420px"
        theme="dark"
        extensions={[javascript(), autocompletion({ override: [seleniumCompletionSource] })]}
        onChange={onChange}
        basicSetup={{ lineNumbers: true, foldGutter: true, autocompletion: false }}
      />
    </div>
  );
}
