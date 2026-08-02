const { defineConfig } = require('cypress');
const fs = require('fs');
const path = require('path');

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  video: false,
  reporterOptions: {
    charts: true,
    reportPageTitle: 'Avaliação Técnica - Relatório Cypress',
    embeddedScreenshots: true,
    inlineAssets: true,
    reportDir: 'cypress/relatorio',
  },
  chromeWebSecurity: false,

  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:5173',
    viewportWidth: 1280,
    viewportHeight: 720,
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);

      // Ao final da execução, gera um resumo (candidato + placar) usado
      // para compor o e-mail enviado pelo GitHub Action.
      on('after:run', (results) => {
        if (!results || results.status !== 'finished') return;

        let candidato = { nomeCompleto: '', email: '' };
        try {
          const raw = fs.readFileSync(
            path.join(__dirname, 'cypress/fixtures/candidato.json'),
            'utf-8'
          );
          candidato = JSON.parse(raw);
        } catch (e) {
          // fixture ausente ou inválida — segue com valores vazios
        }

        const questoes = [];
        (results.runs || []).forEach((run) => {
          (run.tests || []).forEach((t) => {
            questoes.push({ titulo: t.title.join(' > '), estado: t.state });
          });
        });

        const resumo = {
          candidato,
          totalTestes: results.totalTests,
          aprovados: results.totalPassed,
          reprovados: results.totalFailed,
          pendentes: results.totalPending,
          questoes,
          geradoEm: new Date().toISOString(),
        };

        const relatorioDir = path.join(__dirname, 'cypress/relatorio');
        fs.mkdirSync(relatorioDir, { recursive: true });
        fs.writeFileSync(
          path.join(relatorioDir, 'resumo.json'),
          JSON.stringify(resumo, null, 2)
        );
      });

      return config;
    },
  },

  defaultCommandTimeout: 10000,
  pageLoadTimeout: 30000,
});
