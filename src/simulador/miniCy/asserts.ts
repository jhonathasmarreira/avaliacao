export class AssertionError extends Error {}

interface PollOptions {
  timeout?: number;
  interval?: number;
}

export function pollUntil<T>(fn: () => T, { timeout = 4000, interval = 50 }: PollOptions = {}): Promise<T> {
  const inicio = Date.now();
  return new Promise((resolve, reject) => {
    function tentar() {
      try {
        resolve(fn());
      } catch (erro) {
        if (Date.now() - inicio >= timeout) {
          reject(erro);
        } else {
          setTimeout(tentar, interval);
        }
      }
    }
    tentar();
  });
}

function isVisible(el: Element): boolean {
  const view = el.ownerDocument?.defaultView;
  if (!view) return false;
  const style = view.getComputedStyle(el as HTMLElement);
  if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

export function checkShould(els: Element[], assertion: string, args: unknown[]): void {
  switch (assertion) {
    case 'exist':
      if (els.length === 0) throw new AssertionError('esperado que o elemento existisse, mas ele não foi encontrado');
      return;
    case 'not.exist':
      if (els.length > 0) throw new AssertionError('esperado que o elemento não existisse, mas ele foi encontrado');
      return;
    case 'have.length': {
      const esperado = Number(args[0]);
      if (els.length !== esperado) {
        throw new AssertionError(`esperado ${esperado} elemento(s), encontrado(s) ${els.length}`);
      }
      return;
    }
    default:
      break;
  }

  if (els.length === 0) throw new AssertionError('elemento não encontrado');
  const el = els[0] as HTMLInputElement;

  switch (assertion) {
    case 'be.visible':
      if (!isVisible(el)) throw new AssertionError('esperado que o elemento estivesse visível');
      return;
    case 'not.be.visible':
      if (isVisible(el)) throw new AssertionError('esperado que o elemento não estivesse visível');
      return;
    case 'contain.text':
    case 'contain': {
      const esperado = String(args[0]);
      if (!(el.textContent ?? '').includes(esperado)) {
        throw new AssertionError(`esperado que o texto contivesse "${esperado}", encontrado "${el.textContent}"`);
      }
      return;
    }
    case 'have.text': {
      const esperado = String(args[0]);
      if ((el.textContent ?? '').trim() !== esperado) {
        throw new AssertionError(`esperado o texto "${esperado}", encontrado "${(el.textContent ?? '').trim()}"`);
      }
      return;
    }
    case 'have.value': {
      const esperado = String(args[0]);
      if (String(el.value ?? '') !== esperado) {
        throw new AssertionError(`esperado o valor "${esperado}", encontrado "${el.value}"`);
      }
      return;
    }
    case 'be.checked':
      if (!el.checked) throw new AssertionError('esperado que o elemento estivesse marcado');
      return;
    case 'be.disabled':
      if (!(el as unknown as HTMLButtonElement).disabled) throw new AssertionError('esperado que o elemento estivesse desabilitado');
      return;
    case 'be.enabled':
      if ((el as unknown as HTMLButtonElement).disabled) throw new AssertionError('esperado que o elemento estivesse habilitado');
      return;
    case 'have.class': {
      const esperado = String(args[0]);
      if (!el.classList.contains(esperado)) throw new AssertionError(`esperado a classe "${esperado}"`);
      return;
    }
    case 'not.have.class': {
      const esperado = String(args[0]);
      if (el.classList.contains(esperado)) throw new AssertionError(`não esperava a classe "${esperado}"`);
      return;
    }
    default:
      throw new AssertionError(`assertion "${assertion}" não é suportada pelo simulador`);
  }
}
