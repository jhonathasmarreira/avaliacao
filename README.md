# Simulador Cypress — Avaliação Técnica

Ferramenta de avaliação prática para candidatos a QA. Tudo acontece dentro
da própria aplicação web (React + TypeScript + Vite, sem backend/banco de
dados): o candidato se identifica, e depois resolve 20 questões escrevendo
testes com sintaxe estilo Cypress em um editor de código embutido na tela —
sem precisar instalar nada. Ao final, o relatório é enviado por e-mail
automaticamente, direto do navegador.

## Como funciona

1. **Identificação** — o candidato informa nome completo e e-mail.
2. **Simulador** — para cada uma das 20 questões (`src/simulador/questoes.ts`),
   a tela mostra o cenário no formato Dado/Quando/Então e um editor de código
   (CodeMirror). O candidato escreve o teste usando a API `cy.*` do
   simulador — um mini motor que reproduz o essencial da API do Cypress
   real (`cy.get`, `.click`, `.type`, `.should`, `cy.visit`, `cy.reload`,
   `cy.Dado/Quando/Entao/E`, etc.) — e roda contra uma instância isolada do
   app financeiro (Dashboard/Lançamentos), carregada em um iframe
   (`sandbox.html`). Cada questão começa com `cy.implementeAqui()`, que
   sempre falha — é o sinal de "questão pendente"; o candidato apaga essa
   linha e escreve o teste de verdade por baixo.
3. **Finalizar avaliação** — junta nome/e-mail do candidato e o resultado
   (aprovada/reprovada) de cada questão, e envia por e-mail via EmailJS
   (client-side, sem backend) para o avaliador. Se o envio falhar (ex:
   EmailJS não configurado), a tela mostra um botão para copiar o relatório
   manualmente.

Veja `COMO_CONFIGURAR_GITHUB_ACTION.txt` para publicar isso no GitHub Pages
e configurar o envio de e-mail.

## Rotas

Os simuladores **não** ficam na raiz do site. A raiz (`/`) serve uma página
404 neutra, que não deve ser enviada a ninguém. Cada prova tem seu próprio
link — é ele que deve ser enviado ao candidato:

| Prova | Dev | Produção |
| --- | --- | --- |
| Cypress | `http://localhost:5173/cypress-test/` | `https://SEU_USUARIO.github.io/avaliacao/cypress-test` |
| Cucumber (Java/Selenium) | `http://localhost:5173/cucumber-test/` | `https://SEU_USUARIO.github.io/avaliacao/cucumber-test` |
| Java Pleno | `http://localhost:5173/java-test/` | `https://SEU_USUARIO.github.io/avaliacao/java-test` |

Todas terminam com a mesma questão dissertativa de SQL
(`src/simulador/questaoSql.ts`).

## Comandos

```
npm install
npm run dev        # http://localhost:5173 — desenvolvimento
npm run build       # gera dist/ (build de produção)
npm run preview     # serve o build gerado
```

Para testar o envio de e-mail localmente, crie um `.env.local` com:

```
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...
```

Sem essas variáveis, o envio automático não roda — a tela final mostra o
relatório para copiar manualmente (útil em desenvolvimento).

## Estrutura

```
sandbox.html / src/sandbox-main.tsx   entry point que carrega o app financeiro isolado no iframe
src/pages, src/components, src/store  o app financeiro em si (Dashboard/Lançamentos) — "sistema sob teste"

src/simulador/
  questoes.ts               as 20 questões (Dado/Quando/Então + dica + código inicial)
  miniCy/                   mini motor estilo Cypress (fila de comandos, retry, asserts)
  store/useSimuladorStore.ts progresso da prova (persistido separado do app sob teste)
  email/enviarRelatorio.ts  monta e envia o relatório final via EmailJS
  components/, pages/       telas do simulador (identificação, editor, sandbox, relatório)
  questaoSql.ts             questão dissertativa de SQL compartilhada pelas três provas

src/simulador-cucumber/     prova Cucumber (Page/Steps em JS estilo Java + mini Selenium)

src/simulador-java/         prova Java Pleno (src/java-main.tsx, java-test/index.html)
  questoes.ts               3 questões de Java (coleções, streams, exceções) + SQL
  compilador/               lexer + compilador de um subconjunto de Java para JS
  runtime/javaRuntime.ts    biblioteca padrão emulada (List, Map, Stream, Collectors, Optional...)
  runtime/testes.ts         suítes de teste ocultas de cada questão
  runtime/worker.ts         executa os testes num Web Worker (timeout de 5 s, sem travar a aba)
  autocomplete.ts           autocomplete do editor (membros estáticos, métodos, snippets)

.github/workflows/deploy.yml  CI: só builda e publica no GitHub Pages (não roda teste, não envia e-mail)
```

## Limitações conhecidas

- O código do candidato roda sem sandbox de segurança forte (é uma prova
  interna, sem dados sensíveis de terceiros em risco).
- Um loop infinito síncrono no código do candidato trava a aba.
- O subconjunto de sintaxe Cypress suportado é o necessário para as 20
  questões (sem `within`, alias, `intercept`, etc.) — veja as dicas de cada
  questão na própria tela.
