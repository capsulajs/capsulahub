import React from 'react';
import { storiesOf } from '@storybook/react';
import { RequestForm } from 'src';

document.getElementById('root').style.heigh = '500px';

const data = {
  hello: 'world',
  test: 7777,
  awesome: {
    like: 'this tool',
    howMuch: {
      likeThis: 55555,
    },
  },
};

export const props = {
  selectedMethodPath: 'greetingService/hello',
  content: {
    language: 'json',
    requestArgs: JSON.stringify(data, null, 2),
  },
  onSubmit: (data) => {
    console.log('data from RequestForm onSubmit callback', data);
  },
  isChangeLanguageVisible: false,
  isChangeArgsCountVisible: false,
  width: '100%',
  title: 'Message',
  additionalOptions: {
    label: 'asyncModel',
    fieldName: 'asyncModel',
    options: [{ id: 'request/response', label: 'request/response' }, { id: 'request/stream', label: 'request/stream' }],
  },
  iconStyle: { marginTop: '-6px' },
};

storiesOf('RequestForm', module).add('default', () => <RequestForm {...props} />);
