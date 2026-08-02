# Avaliação Técnica — Cypress

Projeto de avaliação prática para candidatos escreverem testes E2E com
Cypress. A aplicação (React + TypeScript + Vite, sem backend/banco de
dados — os dados ficam no `localStorage` do navegador) é uma versão
enxuta do [App-financeiro](https://github.com/jhonathasmarreira/App-financeiro),
com uma tela inicial de identificação (nome + e-mail) no lugar do login.

## O que o candidato precisa fazer

1. Preencher `cypress/fixtures/candidato.json` com seu nome completo e e-mail.
2. Implementar as 20 questões em `cypress/e2e/avaliacao.cy.js` (cada `it`
   começa com `cy.implementeAqui()` — remova essa linha e escreva o teste).
3. Fazer push. O GitHub Action builda a aplicação, roda os 20 testes e
   envia por e-mail o resultado para o avaliador.

Veja `COMO_CONFIGURAR_GITHUB_ACTION.txt` para configurar o envio de e-mail.

## Comandos

```
npm install
npm run dev        # aplicação em http://localhost:5173
npm run cy:open     # Cypress interativo (com a app rodando em outro terminal)

npm run build
npm run test:e2e    # build + preview + Cypress headless (o que o CI roda)
```

## Estrutura

```
src/                      aplicação (Identificação, Dashboard, Lançamentos)
cypress/e2e/avaliacao.cy.js   as 20 questões da avaliação
cypress/support/pages/    Page Objects prontos (infraestrutura)
cypress/support/locators/ seletores (data-testid) centralizados
cypress/fixtures/candidato.json  nome/e-mail do candidato
scripts/gerar-corpo-email.cjs    monta o e-mail final a partir do resumo dos testes
.github/workflows/avaliacao.yml  CI: build + testes + envio de e-mail
```
