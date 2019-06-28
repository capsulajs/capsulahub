const { cy, describe, it } = global;

describe('Capsulahub run TCs #2 success (LocalFile)', () => {
  it('Run CapsulaHub instance with specifying valid arguments (check for LocalFileConfigurationProvider)', () => {
    cy.exec(
      'cat bin/temp/app-config.json | grep \'"7779":{"token":"./configuration","configProvider":"localFile"}\''
    ).then(({ code }) => expect(code).to.eq(0));
  });
});
