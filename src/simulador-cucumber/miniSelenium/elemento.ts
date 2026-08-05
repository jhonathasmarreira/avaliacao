import { pollUntil, AssertionError } from '../../simulador/miniCy/asserts';
import { simulateClick, simulateType, simulateClear, simulateSelect } from '../../simulador/miniCy/dom';
import type { RunnerContext } from './runner';

// Elemento no estilo Selenium WebElement: ações (click/sendKeys/clear) ficam
// na fila e só executam quando o motor drena — igual ao cy.get(...).click()
// do simulador Cypress, pra parecer código Java síncrono de verdade. Só os
// métodos que precisam LER um valor real da tela (getText/isDisplayed/
// isEnabled) são assíncronos: eles drenam a fila pendente até ali antes de
// ler o DOM, porque só assim têm um valor de verdade pra devolver.

export interface Elemento {
  click(): void;
  sendKeys(texto: string): void;
  clear(): void;
  selectByValue(valor: string): void;
  getText(): Promise<string>;
  isDisplayed(): Promise<boolean>;
  isEnabled(): Promise<boolean>;
}

function isVisible(el: Element): boolean {
  const view = el.ownerDocument?.defaultView;
  if (!view) return false;
  const style = view.getComputedStyle(el as HTMLElement);
  if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

export async function drenarAteAqui(ctx: RunnerContext): Promise<void> {
  while (ctx.queue.length > 0) {
    const tarefa = ctx.queue.shift()!;
    await tarefa();
  }
}

export function criarElemento(ctx: RunnerContext, seletor: string): Elemento {
  function derive(): Element[] {
    return Array.from(ctx.sandbox.getDocument().querySelectorAll(seletor));
  }

  function resolveExisting(): Element[] {
    const els = derive();
    if (els.length === 0) throw new AssertionError(`elemento não encontrado: ${seletor}`);
    return els;
  }

  function enqueue(label: string, acao: (el: Element) => void): void {
    ctx.queue.push(async () => {
      ctx.onLog({ tipo: 'comando', texto: label });
      const [el] = await pollUntil(() => resolveExisting(), { timeout: ctx.timeoutMs });
      acao(el);
    });
  }

  return {
    click: () =>
      enqueue(`driver.findElement("${seletor}").click()`, (el) => simulateClick(el as HTMLElement)),

    sendKeys: (texto: string) =>
      enqueue(`driver.findElement("${seletor}").sendKeys("${texto}")`, (el) => simulateType(el, texto)),

    clear: () =>
      enqueue(`driver.findElement("${seletor}").clear()`, (el) => simulateClear(el)),

    selectByValue: (valor: string) =>
      enqueue(`driver.findElement("${seletor}").selectByValue("${valor}")`, (el) => simulateSelect(el, valor)),

    getText: async () => {
      await drenarAteAqui(ctx);
      ctx.onLog({ tipo: 'comando', texto: `driver.findElement("${seletor}").getText()` });
      const [el] = await pollUntil(() => resolveExisting(), { timeout: ctx.timeoutMs });
      return (el.textContent ?? '').trim();
    },

    isDisplayed: async () => {
      await drenarAteAqui(ctx);
      ctx.onLog({ tipo: 'comando', texto: `driver.findElement("${seletor}").isDisplayed()` });
      const els = derive();
      return els.length > 0 && isVisible(els[0]);
    },

    isEnabled: async () => {
      await drenarAteAqui(ctx);
      ctx.onLog({ tipo: 'comando', texto: `driver.findElement("${seletor}").isEnabled()` });
      const [el] = await pollUntil(() => resolveExisting(), { timeout: ctx.timeoutMs });
      return !(el as unknown as HTMLButtonElement).disabled;
    },
  };
}
