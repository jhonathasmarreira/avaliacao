import type { RunnerContext } from './runner';
import { createChainable, type Chainable } from './chainable';
import { filterContains } from './dom';

export interface CyRoot {
  get(selector: string): Chainable;
  contains(texto: string): Chainable;
  visit(caminho?: string): CyRoot;
  reload(): CyRoot;
  wait(ms: number): CyRoot;
  clearLocalStorage(): CyRoot;
  Dado(texto: string): CyRoot;
  Quando(texto: string): CyRoot;
  Entao(texto: string): CyRoot;
  E(texto: string): CyRoot;
  implementeAqui(): CyRoot;
}

function pushTask(ctx: RunnerContext, label: string, acao: () => Promise<void> | void): void {
  ctx.queue.push(async () => {
    ctx.onLog({ tipo: 'comando', texto: label });
    await acao();
  });
}

export function createCy(ctx: RunnerContext): CyRoot {
  const cy: CyRoot = {
    get: (selector: string) =>
      createChainable(ctx, () => Array.from(ctx.sandbox.getDocument().querySelectorAll(selector)), {
        descricao: `cy.get('${selector}')`,
      }),

    contains: (texto: string) =>
      createChainable(ctx, () => filterContains([], texto, ctx.sandbox.getDocument()), {
        descricao: `cy.contains('${texto}')`,
      }),

    visit: (caminho = '/') => {
      pushTask(ctx, `cy.visit('${caminho}')`, async () => {
        await ctx.sandbox.reload();
      });
      return cy;
    },

    reload: () => {
      pushTask(ctx, 'cy.reload()', async () => {
        await ctx.sandbox.reload();
      });
      return cy;
    },

    wait: (ms: number) => {
      const tempo = Math.max(0, Math.min(ms, 10000));
      pushTask(ctx, `cy.wait(${ms})`, () => new Promise((resolve) => setTimeout(resolve, tempo)));
      return cy;
    },

    clearLocalStorage: () => {
      pushTask(ctx, 'cy.clearLocalStorage()', () => {
        ctx.sandbox.clearAppStorage();
      });
      return cy;
    },

    Dado: (texto: string) => {
      pushTask(ctx, `Dado: ${texto}`, () => {});
      return cy;
    },
    Quando: (texto: string) => {
      pushTask(ctx, `Quando: ${texto}`, () => {});
      return cy;
    },
    Entao: (texto: string) => {
      pushTask(ctx, `Então: ${texto}`, () => {});
      return cy;
    },
    E: (texto: string) => {
      pushTask(ctx, `E: ${texto}`, () => {});
      return cy;
    },

    implementeAqui: () => {
      pushTask(ctx, 'cy.implementeAqui()', () => {
        throw new Error('Implemente esta questão: remova cy.implementeAqui() e escreva seu teste.');
      });
      return cy;
    },
  };

  return cy;
}
