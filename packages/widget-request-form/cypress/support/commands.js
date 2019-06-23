const { Cypress, cy } = global;

Cypress.Commands.add('changeArgsAmount', (argsAmount) => {
  return cy
    .get('[data-cy=request-form-args-count-value]')
    .clear()
    .then((input$) => {
      if (argsAmount) {
        cy.wrap(input$).type(argsAmount);
      }
    });
});

Cypress.Commands.add('changeLanguage', (language) => {
  return cy
    .get('[data-cy=request-form-language-dropdown-header]')
    .click()
    .get(`[data-cy=request-form-language-dropdown-option-${language}]`)
    .click();
});

Cypress.Commands.add('checkEditorsAmount', (editorsAmount) => {
  return cy.get('#web-request-form .ace_content').should('have.length', editorsAmount);
});

Cypress.Commands.add('checkEditorsLanguage', (language) => {
  return cy.get('[data-cy="request-form-language-dropdown-title"]').should('have.text', language);
});

Cypress.Commands.add('submitRequest', ({ onSubmitSpy = undefined, callCount = 1 } = {}) => {
  return cy
    .get(`[data-cy^=request-form-submit-btn]`)
    .click()
    .then(() => {
      if (onSubmitSpy) {
        expect(onSubmitSpy.callCount).to.equal(callCount);
      }
    });
});

Cypress.Commands.add('typeInEditor', (content = '{backspace}', editorIndex = 0, submitButtonStatus = 'active') => {
  cy.get(`[data-cy=request-form-editor-${editorIndex}] .ace_text-input`)
    .as('textarea')
    .focus({ force: true })
    .type(`{end}`, { force: true, delay: 0 })
    .type(`{shift}`, { force: true, delay: 0, release: false })
    .type(`{home}`, { force: true, delay: 0 })
    .type(`{backspace}${content}{shift}`, { force: true, delay: 0, log: true })
    .get(`[data-cy=request-form-editor-${editorIndex}] .ace_content`)
    .should(
      'have.text',
      content
        .replace(/{{}/g, '{')
        .replace(/{enter}/g, '')
        .replace(/{backspace}/g, '')
    )
    .get(`[data-cy=request-form-submit-btn-${submitButtonStatus}]`);
});
