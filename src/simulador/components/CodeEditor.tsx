import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

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
        extensions={[javascript()]}
        onChange={onChange}
        basicSetup={{ lineNumbers: true, foldGutter: false }}
      />
    </div>
  );
}
