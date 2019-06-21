import React from 'react';
import { storiesOf } from '@storybook/react';
import { helpers } from '@capsulajs/capsulahub-utils';
import { mountWebComponentRequest } from './src/example/utils';

export const styles = {
  width: 1000,
  height: 500,
};

class Example extends React.Component {
  componentDidMount() {
    helpers.mountWebComponent(mountWebComponentRequest);
  }

  render() {
    return <div id="web-canvas" style={styles} />;
  }
}

storiesOf('Canvas', module).add('default', () => <Example />);
