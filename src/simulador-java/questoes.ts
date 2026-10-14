import type { Questao } from '../simulador/types';
import { questaoSql } from '../simulador/questaoSql';

// As 3 questões do simulador Java Pleno. Nas 2 primeiras o candidato escreve
// Java "de verdade" (um subconjunto: classes, enums, coleções, streams,
// lambdas, exceções) que é compilado no navegador (./compilador) e executado
// contra uma suíte de testes oculta (./runtime/testes.ts), igual aos outros
// dois simuladores: o código inicial sempre falha, a execução para no
// primeiro teste que falhar e o resultado (aprovada/reprovada) não é exibido.
//
// Convenção fixa: o nome da classe e a assinatura do método do codigoInicial
// não podem mudar — a suíte faz `new Classe()` e chama o método pelo nome.
// As classes de apoio (Lancamento, TipoLancamento) já existem no ambiente e
// são só exibidas ao candidato (classesApoio), sem import.
//
// A última questão é a dissertativa de SQL compartilhada com os outros
// simuladores (ver ../simulador/questaoSql.ts).

const CLASSES_APOIO = `public enum TipoLancamento {
    RECEITA,
    DESPESA
}

public class Lancamento {
    private final String descricao;
    private final double valor;          // sempre positivo
    private final TipoLancamento tipo;
    private final String categoria;

    public Lancamento(String descricao, double valor,
                      TipoLancamento tipo, String categoria) { ... }

    public String getDescricao() { return descricao; }
    public double getValor() { return valor; }
    public TipoLancamento getTipo() { return tipo; }
    public String getCategoria() { return categoria; }
}`;

function pendente(metodo: string): string {
  return `// TODO: apague a linha abaixo e escreva sua implementação aqui
        throw new UnsupportedOperationException("Implemente o método ${metodo}().");`;
}

export const QUESTOES: Questao[] = [
  {
    numero: 1,
    titulo: 'Calcular o saldo de uma lista de lançamentos',
    contexto:
      'A aplicação financeira guarda receitas e despesas como objetos Lancamento (veja "Classes de apoio"). O valor de um lançamento é sempre positivo: o que define se ele soma ou subtrai é o tipo. Se a lista recebida for null ou vazia, o saldo é 0.0.',
    dado: 'uma lista de lançamentos com receitas e despesas',
    quando: 'chamo calcularSaldo(lancamentos)',
    entao: 'devo receber a soma das receitas menos a soma das despesas (podendo ser negativa)',
    dica: 'Compare o tipo com TipoLancamento.RECEITA / TipoLancamento.DESPESA (enum: use == ou switch).',
    comandos: ['for (Lancamento l : lancamentos)', 'l.getTipo()', 'l.getValor()', 'stream().mapToDouble(...).sum()'],
    passos: [
      'Trate a lista null ou vazia retornando 0.0.',
      'Percorra os lançamentos.',
      'Some o valor das receitas e subtraia o valor das despesas.',
      'Retorne o saldo (que pode ser negativo).',
    ],
    classesApoio: CLASSES_APOIO,
    codigoInicial: `import java.util.List;

public class CalculadoraSaldo {

    public double calcularSaldo(List<Lancamento> lancamentos) {
        ${pendente('calcularSaldo')}
    }
}
`,
  },
  {
    numero: 2,
    titulo: 'Totalizar as despesas por categoria',
    contexto:
      'O relatório mensal precisa mostrar quanto foi gasto em cada categoria. Só despesas entram no relatório (receitas são ignoradas). Se não houver despesas, retorne um mapa vazio (nunca null). A lista recebida não pode ser alterada.',
    dado: 'uma lista de lançamentos de várias categorias',
    quando: 'chamo totalPorCategoria(lancamentos)',
    entao: 'devo receber um Map com o total gasto em cada categoria de despesa',
    dica: 'Map.merge(chave, valor, Double::sum) ou Collectors.groupingBy(..., Collectors.summingDouble(...)).',
    comandos: ['new HashMap<>()', 'map.merge', 'map.getOrDefault', 'Collectors.groupingBy', 'Collectors.summingDouble'],
    passos: [
      'Crie o mapa de resultado (categoria → total).',
      'Considere apenas os lançamentos do tipo DESPESA.',
      'Acumule o valor de cada despesa na sua categoria.',
      'Retorne o mapa (vazio se não houver despesas), sem alterar a lista recebida.',
    ],
    classesApoio: CLASSES_APOIO,
    codigoInicial: `import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RelatorioDespesas {

    public Map<String, Double> totalPorCategoria(List<Lancamento> lancamentos) {
        ${pendente('totalPorCategoria')}
    }
}
`,
  },
  questaoSql(3),
];
