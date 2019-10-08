import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { getAllByTestId } from '@testing-library/dom';
import RequestForm from '../../src/components/request-form/request-form';
import { additionalOptions, generateBaseProps } from '../helpers/consts';

describe('Request Form tests', () => {
  it('additionalOptions added', () => {
    expect.assertions(8);
    const onSubmitMock = jest.fn();
    const props = generateBaseProps({ onSubmit: onSubmitMock });
    const { getByTestId: getByTestIdInRequestForm, getByText } = render(
      <RequestForm {...props} additionalOptions={additionalOptions} />
    );
    expect(getByTestIdInRequestForm('additional-options-label')).toHaveTextContent('asyncModel');
    const selectEl = getByTestIdInRequestForm('additional-options-select');
    expect(selectEl).toHaveTextContent('request/response');

    fireEvent.click(selectEl.children[0]);
    const selectOptionsEls = getAllByTestId(document.body, 'additional-options-option');
    expect(selectOptionsEls.length).toBe(2);
    expect(selectOptionsEls[0]).toHaveTextContent('request/response');
    expect(selectOptionsEls[1]).toHaveTextContent('request/stream');

    fireEvent.click(getByText('Send'));
    expect(onSubmitMock.mock.calls[0][0].additionalOption).toEqual({
      fieldName: 'asyncModel',
      value: 'request/response',
    });

    fireEvent.click(selectOptionsEls[1]);
    expect(selectEl).toHaveTextContent('request/stream');

    fireEvent.click(getByText('Send'));
    expect(onSubmitMock.mock.calls[1][0].additionalOption).toEqual({
      fieldName: 'asyncModel',
      value: 'request/stream',
    });
  });

  it('additionalOptions are not provided', () => {
    expect.assertions(2);
    const onSubmitMock = jest.fn();
    const props = generateBaseProps({ onSubmit: onSubmitMock });
    const { queryByTestId, getByText } = render(<RequestForm {...props} />);

    expect(queryByTestId('additional-options-wrapper')).toBeNull();

    fireEvent.click(getByText('Send'));
    expect(onSubmitMock.mock.calls[0][0].additionalOption).toBeUndefined();
  });
});
