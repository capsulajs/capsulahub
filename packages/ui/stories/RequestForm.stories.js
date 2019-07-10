import React from 'react';
import { storiesOf } from '@storybook/react';
import { RequestForm } from 'src';

document.getElementById('root').style.heigh = '500px';

export const props = {
  selectedMethodPath: 'greetingService/hello',
  content: {
    language: 'json',
    requestArgs: '{}',
  },
  onSubmit: (data) => {
    console.log('data from RequestForm onSubmit callback', data);
  },
  isChangeLanguageVisible: false,
  isChangeArgsCountVisible: false,
  width: '100%',
  title: 'Message',
};

storiesOf('RequestForm', module).add('default', () => <RequestForm {...props} />);
