import { AssertionError } from './asserts';

export function simulateClick(el: HTMLElement): void {
  el.click();
}

function setNativeValue(el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, value: string): void {
  const proto = Object.getPrototypeOf(el);
  const descriptor = Object.getOwnPropertyDescriptor(proto, 'value');
  descriptor?.set?.call(el, value);
}

// Os elementos vêm do document do iframe sandbox (outro realm de JS), então
// `instanceof HTMLInputElement` do documento pai nunca bate — precisa checar
// por tagName, que funciona independente do realm.
function exigirDigitavel(el: Element): asserts el is HTMLInputElement | HTMLTextAreaElement {
  if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') return;
  throw new AssertionError(
    `.type()/.clear() falhou: <${el.tagName.toLowerCase()}> não é um campo digitável (esperado <input> ou <textarea>)`
  );
}

export function simulateType(el: Element, texto: string): void {
  exigirDigitavel(el);
  const atual = el.value ?? '';
  setNativeValue(el, atual + texto);
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
}

export function simulateClear(el: Element): void {
  exigirDigitavel(el);
  setNativeValue(el, '');
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
}

export function simulateSelect(el: Element, valor: string): void {
  if (el.tagName !== 'SELECT') {
    throw new AssertionError(`.select() falhou: <${el.tagName.toLowerCase()}> não é um <select>`);
  }
  setNativeValue(el as HTMLSelectElement, valor);
  el.dispatchEvent(new Event('change', { bubbles: true }));
}

export function filterContains(scopeEls: Element[], texto: string, doc: Document): Element[] {
  const roots = scopeEls.length > 0 ? scopeEls : [doc.body];
  const candidatos = new Set<Element>();

  for (const root of roots) {
    if (!(root.textContent ?? '').includes(texto)) continue;
    const todos = [root, ...Array.from(root.querySelectorAll('*'))];
    for (const el of todos) {
      if ((el.textContent ?? '').includes(texto)) candidatos.add(el);
    }
  }

  const lista = Array.from(candidatos);
  // mantém só os elementos mais específicos (sem filho que também seja candidato)
  return lista.filter((el) => !lista.some((outro) => outro !== el && el.contains(outro)));
}
