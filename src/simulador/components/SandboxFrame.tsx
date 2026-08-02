import { useEffect, useRef, useCallback } from 'react';
import type { SandboxController } from '../types';

const APP_STORAGE_KEY = 'avaliacao-storage';

interface Props {
  onReady: (controller: SandboxController) => void;
}

export function SandboxFrame({ onReady }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const aguardarCarregamento = useCallback((iframe: HTMLIFrameElement) => {
    return new Promise<void>((resolve, reject) => {
      const limite = setTimeout(() => {
        reject(new Error('Tempo excedido carregando o app sob teste.'));
      }, 8000);

      const aguardarMontagem = (tentativas: number) => {
        const doc = iframe.contentDocument;
        if (doc && doc.readyState !== 'loading' && doc.querySelector('[data-testid]')) {
          clearTimeout(limite);
          resolve();
          return;
        }
        if (tentativas <= 0) {
          clearTimeout(limite);
          reject(new Error('O app sob teste não terminou de carregar.'));
          return;
        }
        setTimeout(() => aguardarMontagem(tentativas - 1), 100);
      };

      iframe.addEventListener('load', () => aguardarMontagem(50), { once: true });
    });
  }, []);

  const navegar = useCallback(async () => {
    const iframe = iframeRef.current;
    if (!iframe) throw new Error('Sandbox indisponível.');
    const base = import.meta.env.BASE_URL;
    const carregar = aguardarCarregamento(iframe);
    iframe.src = `${base}sandbox.html?t=${Date.now()}`;
    await carregar;
  }, [aguardarCarregamento]);

  useEffect(() => {
    // O iframe é same-origin com a casca do simulador, então window.localStorage
    // aqui já é o mesmo storage físico do app sob teste — não é preciso esperar
    // o iframe carregar para limpar a chave dele.
    const limparStorageApp = () => window.localStorage.removeItem(APP_STORAGE_KEY);

    const controller: SandboxController = {
      getDocument: () => {
        const doc = iframeRef.current?.contentDocument;
        if (!doc) throw new Error('Sandbox indisponível.');
        return doc;
      },
      getWindow: () => {
        const win = iframeRef.current?.contentWindow;
        if (!win) throw new Error('Sandbox indisponível.');
        return win;
      },
      clearAppStorage: limparStorageApp,
      reset: async () => {
        limparStorageApp();
        await navegar();
      },
      reload: async () => {
        await navegar();
      },
    };
    onReady(controller);
    // Limpa antes da primeira carga também: sem isso, o painel "App sob teste"
    // podia exibir dados deixados por uma execução anterior no mesmo navegador,
    // antes mesmo do candidato clicar em "Executar teste".
    limparStorageApp();
    navegar().catch(() => {
      /* falha na carga inicial é reportada quando o candidato executar a primeira questão */
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <iframe ref={iframeRef} data-testid="sandbox-frame" title="App sob teste" className="sandbox-frame" />;
}
