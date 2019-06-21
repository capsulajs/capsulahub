import React from 'react';
import { storiesOf } from '@storybook/react';
import { helpers } from '@capsulajs/capsulahub-utils';
import { mountWebComponentRequest } from './src/example/utils';

class Example extends React.Component {
  componentDidMount() {
    helpers.mountWebComponent(mountWebComponentRequest);
  }

  render() {
    return <div id="web-modal" />;
  }
}

storiesOf('Modal', module).add('default', () => <Example />);
