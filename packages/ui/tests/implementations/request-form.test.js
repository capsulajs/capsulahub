import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, fireEvent, configure } from '@testing-library/react';
import { getAllByTestId } from '@testing-library/dom';
import RequestForm from '../../src/components/request-form/request-form';
import { additionalOptions, generateBaseProps } from '../helpers/consts';
import { namespace } from '../../src/components/constants';

let editorMock;

jest.mock('../../src/components/request-form/editor', () => {
  return (props) => {
    editorMock = props;
    return null;
  };
});

describe('Request Form tests', () => {
  configure({ testIdAttribute: 'data-cy' });

  it(`
    If additionalOptions prop is provided, the dropdown with corresponding options will appear,
    The field with the name of additionalOptions is included with the id of a selected value when a user submits the form
  `, () => {
    expect.assertions(8);
    const onSubmitMock = jest.fn();
    const props = generateBaseProps({ onSubmit: onSubmitMock });
    const { getByTestId: getByTestIdInRequestForm, getByText } = render(
      <RequestForm {...props} additionalOptions={additionalOptions} />
    );
    expect(getByTestIdInRequestForm('additional-options-label')).toHaveTextContent('Async Model');
    const selectEl = getByTestIdInRequestForm('additional-options-select');
    expect(selectEl).toHaveTextContent('requestResponse');

    fireEvent.click(selectEl.children[0]);
    const selectOptionsEls = getAllByTestId(document.body, 'additional-options-option');
    expect(selectOptionsEls.length).toBe(2);
    expect(selectOptionsEls[0]).toHaveTextContent('requestResponse');
    expect(selectOptionsEls[1]).toHaveTextContent('requestStream');

    fireEvent.click(getByText('Send'));
    expect(onSubmitMock.mock.calls[0][0].additionalOption).toEqual({
      fieldName: 'asyncModel',
      value: 'request/response',
    });

    fireEvent.click(selectOptionsEls[1]);
    expect(selectEl).toHaveTextContent('requestStream');

    fireEvent.click(getByText('Send'));
    expect(onSubmitMock.mock.calls[1][0].additionalOption).toEqual({
      fieldName: 'asyncModel',
      value: 'request/stream',
    });
  });

  it('If additionalOptions prop is not provided, the dropdown with corresponding options will not appear', () => {
    expect.assertions(2);
    const onSubmitMock = jest.fn();
    const props = generateBaseProps({ onSubmit: onSubmitMock });
    const { queryByTestId, getByText } = render(<RequestForm {...props} />);

    expect(queryByTestId('additional-options-wrapper')).toBeNull();

    fireEvent.click(getByText('Send'));
    expect(onSubmitMock.mock.calls[0][0].additionalOption).toBeUndefined();
  });

  it('If "initialValue" is provided in "additionalOptions" prop - this value is initially applied in the dropdown', () => {
    expect.assertions(1);
    const additionalOptionsWithInitialValue = {
      ...additionalOptions,
      initialValue: 'request/stream',
    };
    const onSubmitMock = jest.fn();
    const props = generateBaseProps({ onSubmit: onSubmitMock });
    const { getByTestId: getByTestIdInRequestForm } = render(
      <RequestForm {...props} additionalOptions={additionalOptionsWithInitialValue} />
    );

    expect(getByTestIdInRequestForm('additional-options-select')).toHaveTextContent('requestStream');
  });

  it(`cache set to false and refresh button disabled`, () => {
    expect.assertions(3);

    const onSubmitMock = jest.fn();
    const props = generateBaseProps({ onSubmit: onSubmitMock });
    const cachedMsg = 'cached value';
    const content = { ...props.content, requestArgs: 'simple content' };
    localStorage.setItem(`${namespace}-${props.msgId}`, JSON.stringify([cachedMsg]));

    const { getByTestId: getByTestIdInRequestForm } = render(
      <RequestForm {...props} cache={false} content={content} />
    );
    expect(editorMock.value).toMatch(content.requestArgs);
    fireEvent.click(getByTestIdInRequestForm('request-form-btn-clear-cache'));
    expect(localStorage.getItem(`${namespace}-${props.msgId}`)).toMatch(cachedMsg);
    expect(editorMock.value).toMatch(content.requestArgs);
  });

  it(`cache set to true and refresh button enabled`, () => {
    expect.assertions(3);

    const onSubmitMock = jest.fn();
    const props = generateBaseProps({ onSubmit: onSubmitMock });
    const content = { ...props.content, requestArgs: 'simple content' };
    const cachedMsg = 'cached value';
    localStorage.setItem(`${namespace}-${props.msgId}`, JSON.stringify([cachedMsg]));

    const { getByTestId: getByTestIdInRequestForm } = render(<RequestForm {...props} cache={true} content={content} />);
    expect(editorMock.value).toMatch(cachedMsg);
    fireEvent.click(getByTestIdInRequestForm('request-form-btn-clear-cache'));

    expect(localStorage.getItem(`${namespace}-${props.msgId}`)).toBe(null);
    expect(editorMock.value).toMatch(content.requestArgs);
  });

  it('cache set to true but not value in localStorage', () => {
    expect.assertions(1);

    const onSubmitMock = jest.fn();
    const props = generateBaseProps({ onSubmit: onSubmitMock });
    const content = { ...props.content, requestArgs: 'simple content' };

    const { getByTestId: getByTestIdInRequestForm } = render(<RequestForm {...props} content={content} />);
    expect(editorMock.value).toMatch(content.requestArgs);
  });
});
