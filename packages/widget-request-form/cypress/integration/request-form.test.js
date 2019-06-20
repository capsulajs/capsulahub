import { BehaviorSubject } from 'rxjs';

const { cy, describe, it } = global;

const defaultText = {
  javascript: 'return {};',
  json: '{}',
};

const basicProps = {
  selectedMethodPath: 'SelectedService/SelectedMethod',
  content: {
    language: 'javascript',
    requestArgs: 'return {};',
  },
  onSubmit: () => {},
};

describe('Request Form TCs', () => {
  Cypress.on('uncaught:exception', (err) => {
    return false;
  });

  it('Check the code pattern to be displayed for javascript language (with different number of arguments)', () => {
    cy.visit('/')
      .checkEditorsAmount(1)
      .should('have.text', defaultText.javascript)
      .changeArgsAmount(2)
      .checkEditorsAmount(2)
      .each((editor$) => expect(editor$.text()).to.equal(defaultText.javascript));
  });

  it('Check the code pattern to be displayed for json language (with different number of arguments)', () => {
    cy.visit('/')
      .changeLanguage('json')
      .checkEditorsAmount(1)
      .should('have.text', defaultText.json)
      .changeArgsAmount(2)
      .checkEditorsAmount(2)
      .each((editor$) => expect(editor$.text()).to.equal(defaultText.json));
  });

  it('Check Request Form to be split according to the arguments number', () => {
    cy.visit('/')
      .checkEditorsAmount(1)
      .changeArgsAmount(2)
      .checkEditorsAmount(2)
      .changeArgsAmount(3)
      .checkEditorsAmount(3)
      .changeLanguage('json')
      .checkEditorsAmount(3)
      .changeArgsAmount(1)
      .checkEditorsAmount(1);
  });

  it(
    'Submit with a valid request (check different data types in request and the model of data received)' +
      ' (javascript mode)',
    () => {
      const onSubmitSpy = cy.spy();
      cy.visit('/', {
        onBeforeLoad(window) {
          window.requestFormPropsSubject = new BehaviorSubject({ ...basicProps, onSubmit: onSubmitSpy });
        },
      });

      cy.wrap([
        { content: 'return null;', requestArgs: [null] },
        { content: 'return undefined;', requestArgs: [undefined] },
        { content: 'return 5;', requestArgs: [5] },
        { content: 'return "hello";', requestArgs: ['hello'] },
        { content: 'return {{} hello: "world" };', requestArgs: [{ hello: 'world' }] },
        { content: 'return [{{} hello: "world" }, 5];', requestArgs: [[{ hello: 'world' }, 5]] },
        {
          content: 'return () => {{} const a = "Hello"; return a; };',
          argToPass: undefined,
          expectedResultAfterInvoke: 'Hello',
        },
        {
          content: 'return function test(b) {{} const a = "Hello"; return a + " " + b; };',
          argToPass: 'World',
          expectedResultAfterInvoke: 'Hello World',
        },
      ]).each((data, index) => {
        cy.wait(500)
          .typeInEditor(data.content)
          .submitRequest()
          .then(() => {
            if (!data.expectedResultAfterInvoke) {
              expect(onSubmitSpy).calledWithExactly({ language: 'javascript', requestArgs: data.requestArgs });
            } else {
              const argsCalled = onSubmitSpy.args[index];
              expect(argsCalled.length).to.equal(1);
              expect(Object.keys(argsCalled[0]).length).to.equal(2);
              expect(argsCalled[0].language).to.equal('javascript');
              expect(argsCalled[0].requestArgs.length).to.equal(1);
              expect(argsCalled[0].requestArgs[0](data.argToPass)).to.equal(data.expectedResultAfterInvoke);
            }
          });
      });
    }
  );

  it(
    'Submit with a valid request (check different data types in request and the model of data received)' +
      ' (json mode)',
    () => {
      const onSubmitSpy = cy.spy();
      cy.visit('/', {
        onBeforeLoad(window) {
          window.requestFormPropsSubject = new BehaviorSubject({ ...basicProps, onSubmit: onSubmitSpy });
        },
      });

      cy.changeLanguage('json')
        .wrap([
          { content: '{{} "test": "world" }', requestArgs: [{ test: 'world' }] },
          { content: 'null', requestArgs: [null] },
          { content: '5', requestArgs: [5] },
          { content: '"hello"', requestArgs: ['hello'] },
        ])
        .each((data) => {
          cy.wait(500)
            .typeInEditor(data.content)
            .submitRequest()
            .then(() => {
              expect(onSubmitSpy).calledWithExactly({ language: 'json', requestArgs: data.requestArgs });
            });
        });
    }
  );

  it('Submit button should be disabled when there is no service/method name displayed', () => {
    const onSubmitSpy = cy.spy();
    const requestFormPropsSubject = new BehaviorSubject({
      ...basicProps,
      selectedMethodPath: '',
      onSubmit: onSubmitSpy,
    });
    cy.visit('/', {
      onBeforeLoad(window) {
        window.requestFormPropsSubject = requestFormPropsSubject;
      },
    });
    cy.submitRequest({ onSubmitSpy, callCount: 0 })
      .changeLanguage('json')
      .submitRequest({ onSubmitSpy, callCount: 0 })
      .then(() => {
        requestFormPropsSubject.next({
          ...basicProps,
          selectedMethodPath: 'selectedService/selectedMethod',
          onSubmit: onSubmitSpy,
        });
      })
      .submitRequest({ onSubmitSpy, callCount: 1 });
  });

  it(
    'Check Submit button to be disabled when there is an invalid request or an empty entry(with different' +
      ' number of arguments)',
    () => {
      const onSubmitSpy = cy.spy();
      cy.visit('/', {
        onBeforeLoad(window) {
          window.requestFormPropsSubject = new BehaviorSubject({ ...basicProps, onSubmit: onSubmitSpy });
        },
      });

      cy.wrap(['return () = {{} return "Hello"; };', 'return {{}', 'return {{} test: };', '', 'retur 5'])
        .each((input) => {
          cy.wait(500)
            .typeInEditor(input, 0, 'disabled')
            .submitRequest({ onSubmitSpy, callCount: 0 });
        })
        .changeArgsAmount(2)
        .typeInEditor('return "test"', 1, 'disabled')
        .submitRequest({ onSubmitSpy, callCount: 0 })
        .changeLanguage('json')
        .changeArgsAmount(1)
        .wrap(['{{} test: "world" }', '{{} "test: "world" }', 'return {{} test: "world" };', 'test', ''])
        .each((input) => {
          cy.wait(500)
            .typeInEditor(input, 0, 'disabled')
            .submitRequest({ onSubmitSpy, callCount: 0 });
        })
        .changeArgsAmount(2)
        .typeInEditor('{{} "test": "world" }', 1, 'disabled')
        .submitRequest({ onSubmitSpy, callCount: 0 });
    }
  );

  it('The input should not be deleted after submit', () => {
    const onSubmitSpy = cy.spy();
    cy.visit('/', {
      onBeforeLoad(window) {
        window.requestFormPropsSubject = new BehaviorSubject({ ...basicProps, onSubmit: onSubmitSpy });
      },
    });

    cy.typeInEditor('return {{} count: 5 }')
      .submitRequest({ onSubmitSpy, callCount: 1 })
      .get('.ace_content')
      .should('have.text', 'return { count: 5 }');
  });

  it('Switching between languages should not affect the number of arguments selected', () => {
    cy.visit('/')
      .changeArgsAmount(2)
      .checkEditorsAmount(2)
      .changeLanguage('json')
      .checkEditorsAmount(2)
      .changeArgsAmount(1)
      .changeLanguage('javascript')
      .checkEditorsAmount(1);
  });

  it('Line number should be provided when user write an input with several lines', () => {
    cy.visit('/')
      .typeInEditor('var a = "test";{enter}return {{} val: a };')
      .get('.ace_gutter-cell')
      .should('have.length', 2)
      .each((lineNumber$, index) => expect(+lineNumber$.text()).to.equal(index + 1))
      .changeLanguage('json')
      .typeInEditor('{{}{enter} "test": "world"{enter}}')
      .get('.ace_gutter-cell')
      .should('have.length', 3)
      .each((lineNumber$, index) => expect(+lineNumber$.text()).to.equal(index + 1));
  });

  it('Validation errors of the selected language should be displayed next to the line with wrong input', () => {
    cy.visit('/')
      .typeInEditor('return {{} test: }', 0, 'disabled')
      .get('.ace_gutter-cell.ace_error')
      .should('have.text', '1')
      .typeInEditor('return {{} test: "world" }')
      .get('.ace_gutter-cell.ace_error')
      .should('not.exist')
      .changeLanguage('json')
      .typeInEditor('return', 0, 'disabled')
      .get('.ace_gutter-cell.ace_error')
      .should('have.text', '1')
      .typeInEditor('{{} "test": "world" }')
      .get('.ace_gutter-cell.ace_error')
      .should('not.exist');
  });

  it('Removing the arguments number doesnt remove the existing editors and content', () => {
    cy.visit('/')
      .typeInEditor('return 5;')
      .changeArgsAmount('')
      .checkEditorsAmount(1)
      .get('.ace_content')
      .should('have.text', 'return 5;')
      .changeArgsAmount(2)
      .typeInEditor('return "test";', 1)
      .get('.ace_content')
      .should('have.length', 2)
      .each((editorContent$, index) => {
        expect(editorContent$.text()).to.equal(index === 0 ? 'return 5;' : 'return "test";');
      })
      .changeArgsAmount('')
      .get('.ace_content')
      .should('have.length', 2)
      .each((editorContent$, index) => {
        expect(editorContent$.text()).to.equal(index === 0 ? 'return 5;' : 'return "test";');
      })
      .changeLanguage('json')
      .changeArgsAmount(2)
      .typeInEditor('{{} "test": "world" }')
      .typeInEditor('{{} "test7": "world7" }', 1)
      .get('.ace_content')
      .should('have.length', 2)
      .each((editorContent$, index) => {
        expect(editorContent$.text()).to.equal(index === 0 ? '{ "test": "world" }' : '{ "test7": "world7" }');
      })
      .changeArgsAmount('')
      .get('.ace_content')
      .should('have.length', 2)
      .each((editorContent$, index) => {
        expect(editorContent$.text()).to.equal(index === 0 ? '{ "test": "world" }' : '{ "test7": "world7" }');
      })
      .changeArgsAmount(1)
      .get('.ace_content')
      .should('have.length', 1)
      .should('have.text', '{ "test": "world" }');
  });

  it('Submit button should be enabled while the number of arguments changes and all the inputs are valid', () => {
    const onSubmitSpy = cy.spy();
    cy.visit('/', {
      onBeforeLoad(window) {
        window.requestFormPropsSubject = new BehaviorSubject({ ...basicProps, onSubmit: onSubmitSpy });
      },
    });

    cy.changeArgsAmount(2)
      .typeInEditor('return {{} test: }', 1, 'disabled')
      .submitRequest({ onSubmitSpy, callCount: 0 })
      .changeArgsAmount(1)
      .submitRequest({ onSubmitSpy, callCount: 1 })
      .changeLanguage('json')
      .changeArgsAmount(2)
      .typeInEditor('{{} test: "test" }', 1, 'disabled')
      .submitRequest({ onSubmitSpy, callCount: 1 })
      .changeArgsAmount(1)
      .submitRequest({ onSubmitSpy, callCount: 2 });
  });

  it('Error message should appear, if there is an error in running JS code from the editor after submitting', () => {
    const codeWithRuntimeError = 'return {{} test };';
    const onSubmitSpy = cy.spy();
    const requestFormPropsSubject = new BehaviorSubject({ ...basicProps, onSubmit: onSubmitSpy });
    cy.visit('/', {
      onBeforeLoad(window) {
        window.requestFormPropsSubject = requestFormPropsSubject;
      },
    });
    cy.typeInEditor(codeWithRuntimeError)
      .submitRequest({ onSubmitSpy, callCount: 0 })
      .get('[data-cy="request-form-error-message"]')
      .should('have.text', 'ReferenceError: test is not defined')
      .typeInEditor('return 5')
      .get('[data-cy="request-form-error-message"]')
      .should('not.exist')
      .typeInEditor(codeWithRuntimeError)
      .submitRequest({ onSubmitSpy, callCount: 0 })
      .get('[data-cy="request-form-error-message"]')
      .changeLanguage('json')
      .get('[data-cy="request-form-error-message"]')
      .should('not.exist')
      .changeLanguage('javascript')
      .typeInEditor(codeWithRuntimeError)
      .submitRequest({ onSubmitSpy, callCount: 0 })
      .get('[data-cy="request-form-error-message"]')
      .changeArgsAmount(2)
      .get('[data-cy="request-form-error-message"]')
      .should('not.exist')
      .typeInEditor(codeWithRuntimeError)
      .submitRequest({ onSubmitSpy, callCount: 0 })
      .get('[data-cy="request-form-error-message"]')
      .then(() => {
        requestFormPropsSubject.next({
          ...basicProps,
          content: {
            language: 'javascript',
            requestArgs: 'return "valid"',
          },
        });
      })
      .get('[data-cy="request-form-error-message"]')
      .should('not.exist');
  });

  it('If content prop is changed, the form is updated correctly', () => {
    const onSubmitSpy = cy.spy();
    const requestFormPropsSubject = new BehaviorSubject({ ...basicProps, onSubmit: onSubmitSpy });
    cy.visit('/', {
      onBeforeLoad(window) {
        window.requestFormPropsSubject = requestFormPropsSubject;
      },
    });
    cy.typeInEditor('return {{}test: 5};')
      .changeLanguage('json')
      .checkEditorsLanguage('json')
      .changeLanguage('javascript')
      .checkEditorsLanguage('javascript')
      // Javascript - 1 editor - requestArgs: string
      .then(() => {
        requestFormPropsSubject.next({
          ...basicProps,
          content: {
            language: 'javascript',
            requestArgs: 'return "some default val"',
          },
        });
      })
      .get('.ace_content')
      .should('have.length', 1)
      .should('have.text', 'return "some default val"')
      .checkEditorsLanguage('javascript')
      .changeArgsAmount(2)
      // Javascript - 2 editors - requestArgs: string
      .then(() => {
        requestFormPropsSubject.next({
          ...basicProps,
          content: {
            language: 'javascript',
            requestArgs: 'return "default for both editors"',
          },
        });
      })
      .wait(100)
      .get('.ace_content')
      .should('have.length', 2)
      .each((textArea$) => expect(textArea$.text()).to.equal('return "default for both editors"'))
      .checkEditorsLanguage('javascript')
      // Javascript - 2 editors - requestArgs: array (will result in 2 editors)
      .then(() => {
        requestFormPropsSubject.next({
          ...basicProps,
          content: {
            language: 'javascript',
            requestArgs: ['return "for the first"', 'return 5'],
          },
        });
      })
      .wait(100)
      .get('.ace_content')
      .should('have.length', 2)
      .each((textArea$, index) =>
        expect(textArea$.text()).to.equal(index === 0 ? 'return "for the first"' : 'return 5')
      )
      .checkEditorsLanguage('javascript')
      // Json - 2 editors - requestArgs: array (will result in 2 editors)
      .then(() => {
        requestFormPropsSubject.next({
          ...basicProps,
          content: {
            language: 'json',
            requestArgs: ['{ "test": "default" }', '{ "test": "default2" }'],
          },
        });
      })
      .wait(100)
      .get('.ace_content')
      .should('have.length', 2)
      .each((textArea$, index) =>
        expect(textArea$.text()).to.equal(index === 0 ? '{ "test": "default" }' : '{ "test": "default2" }')
      )
      .checkEditorsLanguage('json')
      // Json - 2 editors - requestArgs: string
      .then(() => {
        requestFormPropsSubject.next({
          ...basicProps,
          content: {
            language: 'json',
            requestArgs: '{ "test": "default from string" }',
          },
        });
      })
      .wait(100)
      .get('.ace_content')
      .should('have.length', 2)
      .each((textArea$) => expect(textArea$.text()).to.equal('{ "test": "default from string" }'))
      .checkEditorsLanguage('json')
      // Json - 2 editors - requestArgs: array (will result in one editor)
      .then(() => {
        requestFormPropsSubject.next({
          ...basicProps,
          content: {
            language: 'json',
            requestArgs: ['{ "test": "now there is one editor" }'],
          },
        });
      })
      .wait(100)
      .get('.ace_content')
      .should('have.length', 1)
      .each((textArea$) => expect(textArea$.text()).to.equal('{ "test": "now there is one editor" }'))
      .checkEditorsLanguage('json');
  });
});
