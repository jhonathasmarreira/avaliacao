// --- Comandos BDD para melhor legibilidade dos testes ---
Cypress.Commands.add('Dado', (texto) => cy.log(`DADO: ${texto}`));
Cypress.Commands.add('Quando', (texto) => cy.log(`QUANDO: ${texto}`));
Cypress.Commands.add('Entao', (texto) => cy.log(`ENTÃO: ${texto}`));
Cypress.Commands.add('E', (texto) => cy.log(`E: ${texto}`));

// --- Marca uma questão como ainda não implementada ---
// Use no lugar do corpo do teste enquanto a Questão não foi resolvida.
// Remova esta chamada assim que escrever a implementação real.
Cypress.Commands.add('implementeAqui', (mensagem) => {
  throw new Error(
    `❌ Questão ainda não implementada. ${mensagem || 'Remova cy.implementeAqui() e escreva o teste.'}`
  );
});
