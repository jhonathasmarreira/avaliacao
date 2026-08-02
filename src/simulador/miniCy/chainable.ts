import type { RunnerContext } from './runner';
import { pollUntil, checkShould, AssertionError } from './asserts';
import { simulateClick, simulateType, simulateClear, simulateSelect, filterContains } from './dom';

export type DeriveFn = () => Element[];

export interface Chainable {
  click(): Chainable;
  type(texto: string): Chainable;
  clear(): Chainable;
  select(valor: string): Chainable;
  should(assertion: string, ...args: unknown[]): Chainable;
  contains(texto: string): Chainable;
  first(): Chainable;
  eq(indice: number): Chainable;
}

interface Opcoes {
  descricao: string;
  /** Se true (padrão), o simples ato de encadear já espera o elemento existir. */
  requireExists?: boolean;
}

export function createChainable(ctx: RunnerContext, derive: DeriveFn, opcoes: Opcoes): Chainable {
  const { descricao } = opcoes;

  function resolveExisting(minimo = 1): Element[] {
    const els = derive();
    if (els.length < minimo) {
      throw new AssertionError(`elemento não encontrado: ${descricao}`);
    }
    return els;
  }

  function enqueue(label: string, acao: () => Promise<void> | void): Chainable {
    ctx.queue.push(async () => {
      ctx.onLog({ tipo: 'comando', texto: label });
      await acao();
    });
    return chain;
  }

  const chain: Chainable = {
    click: () =>
      enqueue(`${descricao}.click()`, async () => {
        const [el] = await pollUntil(() => resolveExisting(), { timeout: ctx.timeoutMs });
        simulateClick(el as HTMLElement);
      }),

    type: (texto: string) =>
      enqueue(`${descricao}.type('${texto}')`, async () => {
        const [el] = await pollUntil(() => resolveExisting(), { timeout: ctx.timeoutMs });
        simulateType(el, texto);
      }),

    clear: () =>
      enqueue(`${descricao}.clear()`, async () => {
        const [el] = await pollUntil(() => resolveExisting(), { timeout: ctx.timeoutMs });
        simulateClear(el);
      }),

    select: (valor: string) =>
      enqueue(`${descricao}.select('${valor}')`, async () => {
        const [el] = await pollUntil(() => resolveExisting(), { timeout: ctx.timeoutMs });
        simulateSelect(el, valor);
      }),

    should: (assertion: string, ...args: unknown[]) => {
      const argsTxt = args.length ? `, ${args.map((a) => JSON.stringify(a)).join(', ')}` : '';
      return enqueue(`${descricao}.should('${assertion}'${argsTxt})`, async () => {
        await pollUntil(() => checkShould(derive(), assertion, args), { timeout: ctx.timeoutMs });
      });
    },

    contains: (texto: string) =>
      createChainable(ctx, () => filterContains(derive(), texto, ctx.sandbox.getDocument()), {
        descricao: `${descricao}.contains('${texto}')`,
      }),

    first: () =>
      createChainable(ctx, () => derive().slice(0, 1), { descricao: `${descricao}.first()` }),

    eq: (indice: number) =>
      createChainable(ctx, () => {
        const els = derive();
        return els[indice] ? [els[indice]] : [];
      }, { descricao: `${descricao}.eq(${indice})` }),
  };

  if (opcoes.requireExists !== false) {
    enqueue(descricao, async () => {
      await pollUntil(() => resolveExisting(), { timeout: ctx.timeoutMs });
    });
  }

  return chain;
}
