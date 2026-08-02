// carrega os comandos customizados
import './commands';

// não falhar o teste por erro não tratado da aplicação
Cypress.on('uncaught:exception', () => false);

// reporter mochawesome
import 'cypress-mochawesome-reporter/register';
