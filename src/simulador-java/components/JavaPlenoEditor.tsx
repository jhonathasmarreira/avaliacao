import CodeMirror from '@uiw/react-codemirror';
import { java } from '@codemirror/lang-java';
import { autocompletion } from '@codemirror/autocomplete';
import { javaCompletionSource } from '../autocomplete';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onExecutar?: () => void;
}

export function JavaPlenoEditor({ value, onChange, onExecutar }: Props) {
  return (
    <div
      data-testid="java-pleno-editor"
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
        height="460px"
        theme="dark"
        extensions={[java(), autocompletion({ override: [javaCompletionSource] })]}
        onChange={onChange}
        basicSetup={{ lineNumbers: true, foldGutter: true, autocompletion: false }}
      />
    </div>
  );
}
