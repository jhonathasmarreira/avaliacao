export function simulateClick(el: HTMLElement): void {
  el.click();
}

function setNativeValue(el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, value: string): void {
  const proto = Object.getPrototypeOf(el);
  const descriptor = Object.getOwnPropertyDescriptor(proto, 'value');
  descriptor?.set?.call(el, value);
}

export function simulateType(el: HTMLInputElement | HTMLTextAreaElement, texto: string): void {
  const atual = el.value ?? '';
  setNativeValue(el, atual + texto);
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
}

export function simulateClear(el: HTMLInputElement | HTMLTextAreaElement): void {
  setNativeValue(el, '');
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
}

export function simulateSelect(el: HTMLSelectElement, valor: string): void {
  setNativeValue(el, valor);
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
