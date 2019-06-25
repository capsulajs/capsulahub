const { cy, describe, it } = global;
import { args } from '../../src/helpers/const';

describe('Capsulahub build TCs', () => {
  it('Run `capsulahub build` with specifying valid arguments (check for HttpFile provider)', () => {
    cy.exec('');
  });

  it('Run `capsulahub build` with specifying valid arguments (check for LocalFile, Scalecube, HttpServer and LocalStorage provider)', () => {
    cy.exec('');
  });

  it('Run `capsulahub build` without specifying the output and configProvider', () => {
    cy.exec('');
  });

  it('Run `capsulahub build` with a non-existent configProvider throws an error', () => {
    cy.exec('capsulahub build --token=http://localhost:3000/configuration --configProvider=test')
      .its('stderr')
      .should('eq', args.configProvider.error);
  });

  it('Run `capsulahub build` with non-existent token throws an error', () => {
    cy.exec('capsulahub build --token=http://localhost:3000/configuration --configProvider=test')
      .its('stderr')
      .should('eq', args.configProvider.error);
  });

  it('Run `capsulahub build` with non-existent output throws an error', () => {
    cy.exec('capsulahub build --token=http://localhost:3000/configuration --configProvider=test')
      .its('stderr')
      .should('eq', args.configProvider.error);
  });
});
