import { criarElemento, type Elemento } from './elemento';
import type { RunnerContext } from './runner';

// "WebDriver" no estilo Selenium Java: driver.get(caminho), driver.findElement(By.cssSelector(...)),
// driver.navigate().refresh(). O WebDriver em si já vem pronto pro candidato (injetado no
// construtor da Page) — ele só usa, nunca instancia.

export interface Locator {
  seletor: string;
}

export const By = {
  cssSelector: (seletor: string): Locator => ({ seletor }),
  id: (id: string): Locator => ({ seletor: `#${id}` }),
  name: (nome: string): Locator => ({ seletor: `[name="${nome}"]` }),
  className: (nome: string): Locator => ({ seletor: `.${nome}` }),
};

export interface Driver {
  get(caminho?: string): void;
  findElement(locator: Locator): Elemento;
  navigate(): { refresh(): void };
}

export function criarDriver(ctx: RunnerContext): Driver {
  return {
    get: (caminho = '/') => {
      ctx.queue.push(async () => {
        ctx.onLog({ tipo: 'comando', texto: `driver.get("${caminho}")` });
        await ctx.sandbox.reload();
      });
    },

    findElement: (locator: Locator) => criarElemento(ctx, locator.seletor),

    navigate: () => ({
      refresh: () => {
        ctx.queue.push(async () => {
          ctx.onLog({ tipo: 'comando', texto: 'driver.navigate().refresh()' });
          await ctx.sandbox.reload();
        });
      },
    }),
  };
}
