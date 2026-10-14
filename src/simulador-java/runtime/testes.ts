import {
  ArrayList,
  Lancamento,
  TipoLancamento,
  jstr,
} from './javaRuntime';

// Casos de teste de cada questão do simulador Java Pleno, rodados contra as
// classes compiladas do candidato. O nome de cada caso aparece no log da
// execução (como um teste JUnit); o primeiro que falhar interrompe a questão,
// do mesmo jeito que nos outros dois simuladores.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Qualquer = any;

export class FalhaTeste extends Error {}

export interface Contexto {
  /** Nova instância da classe da questão (falha se a classe ou o método não existirem). */
  novo(): Qualquer;
}

interface Caso {
  nome: string;
  rodar(ctx: Contexto): void;
}

export interface Suite {
  classe: string;
  metodo: string;
  casos: Caso[];
}

const RECEITA = TipoLancamento.RECEITA;
const DESPESA = TipoLancamento.DESPESA;

function lanc(descricao: string, valor: number, tipo: Qualquer, categoria: string) {
  return new Lancamento(descricao, valor, tipo, categoria);
}

function lista(...itens: Qualquer[]) {
  return new ArrayList(itens);
}

function fmt(x: Qualquer): string {
  if (typeof x === 'number') return Number.isInteger(x) ? `${x}.0` : String(x);
  if (typeof x === 'string') return `"${x}"`;
  if (x === undefined) return 'nada (o método não retornou valor)';
  return jstr(x);
}

function falhar(msg: string): never {
  throw new FalhaTeste(msg);
}

function esperarNumero(obtido: Qualquer, esperado: number) {
  if (typeof obtido !== 'number') falhar(`esperado ${fmt(esperado)}, mas o método retornou ${fmt(obtido)}`);
  if (Math.abs(obtido - esperado) > 1e-6) falhar(`esperado ${fmt(esperado)}, obtido ${fmt(obtido)}`);
}

function esperarMapa(obtido: Qualquer): Qualquer {
  if (obtido == null) falhar('o método retornou null; esperado um Map (mesmo que vazio)');
  if (typeof obtido.get !== 'function' || typeof obtido.size !== 'function') {
    falhar(`esperado um Map<String, Double>, mas o método retornou ${fmt(obtido)}`);
  }
  return obtido;
}

function descricoes(l: Qualquer): string[] {
  const r: string[] = [];
  for (let i = 0; i < l.size(); i++) {
    const item = l.get(i);
    r.push(item instanceof Lancamento ? item.getDescricao() : jstr(item));
  }
  return r;
}

function esperarInalterada(original: Qualquer, descricoesAntes: string[]) {
  const depois = descricoes(original);
  if (depois.join('|') !== descricoesAntes.join('|')) {
    falhar(`a lista recebida foi alterada: antes [${descricoesAntes.join(', ')}], depois [${depois.join(', ')}]`);
  }
}

export const SUITES: Record<number, Suite> = {
  1: {
    classe: 'CalculadoraSaldo',
    metodo: 'calcularSaldo',
    casos: [
      {
        nome: 'calcularSaldo(lista vazia) deve retornar 0.0',
        rodar: (ctx) => esperarNumero(ctx.novo().calcularSaldo(lista()), 0),
      },
      {
        nome: 'calcularSaldo(null) deve retornar 0.0',
        rodar: (ctx) => esperarNumero(ctx.novo().calcularSaldo(null), 0),
      },
      {
        nome: 'calcularSaldo deve somar as receitas',
        rodar: (ctx) =>
          esperarNumero(
            ctx.novo().calcularSaldo(lista(lanc('Salário', 3000, RECEITA, 'Salário'), lanc('Projeto', 250.5, RECEITA, 'Freelance'))),
            3250.5
          ),
      },
      {
        nome: 'calcularSaldo deve subtrair as despesas das receitas',
        rodar: (ctx) =>
          esperarNumero(
            ctx.novo().calcularSaldo(
              lista(
                lanc('Salário', 3000, RECEITA, 'Salário'),
                lanc('Aluguel', 1200.4, DESPESA, 'Moradia'),
                lanc('Mercado', 300, DESPESA, 'Alimentação'),
                lanc('Venda de livro', 100, RECEITA, 'Outros (Receita)')
              )
            ),
            1599.6
          ),
      },
      {
        nome: 'calcularSaldo pode retornar saldo negativo',
        rodar: (ctx) =>
          esperarNumero(
            ctx.novo().calcularSaldo(lista(lanc('Uber', 80, DESPESA, 'Transporte'), lanc('Café', 20.5, DESPESA, 'Alimentação'))),
            -100.5
          ),
      },
    ],
  },

  2: {
    classe: 'RelatorioDespesas',
    metodo: 'totalPorCategoria',
    casos: [
      {
        nome: 'totalPorCategoria(lista vazia) deve retornar um mapa vazio, não null',
        rodar: (ctx) => {
          const mapa = esperarMapa(ctx.novo().totalPorCategoria(lista()));
          if (mapa.size() !== 0) falhar(`esperado um mapa vazio, obtido ${jstr(mapa)}`);
        },
      },
      {
        nome: 'totalPorCategoria deve ignorar as receitas',
        rodar: (ctx) => {
          const mapa = esperarMapa(
            ctx.novo().totalPorCategoria(lista(lanc('Salário', 3000, RECEITA, 'Salário'), lanc('Projeto', 500, RECEITA, 'Freelance')))
          );
          if (mapa.size() !== 0) falhar(`esperado um mapa vazio (só havia receitas), obtido ${jstr(mapa)}`);
        },
      },
      {
        nome: 'totalPorCategoria deve somar as despesas de cada categoria',
        rodar: (ctx) => {
          const mapa = esperarMapa(
            ctx.novo().totalPorCategoria(
              lista(
                lanc('Mercado', 50, DESPESA, 'Alimentação'),
                lanc('Uber', 20, DESPESA, 'Transporte'),
                lanc('Salário', 1000, RECEITA, 'Salário'),
                lanc('Restaurante', 30.5, DESPESA, 'Alimentação')
              )
            )
          );
          if (mapa.size() !== 2) falhar(`esperado 2 categorias (Alimentação e Transporte), obtido ${jstr(mapa)}`);
          const alimentacao = mapa.get('Alimentação');
          const transporte = mapa.get('Transporte');
          if (alimentacao == null || transporte == null) falhar(`esperadas as chaves "Alimentação" e "Transporte", obtido ${jstr(mapa)}`);
          esperarNumero(alimentacao, 80.5);
          esperarNumero(transporte, 20);
        },
      },
      {
        nome: 'totalPorCategoria não deve alterar a lista recebida',
        rodar: (ctx) => {
          const entrada = lista(
            lanc('Salário', 1000, RECEITA, 'Salário'),
            lanc('Cinema', 60, DESPESA, 'Lazer'),
            lanc('Farmácia', 45.9, DESPESA, 'Saúde')
          );
          const antes = descricoes(entrada);
          ctx.novo().totalPorCategoria(entrada);
          esperarInalterada(entrada, antes);
        },
      },
    ],
  },
};
