import React from 'react';
import { storiesOf } from '@storybook/react';
import { helpers } from '@capsulajs/capsulahub-utils';
import { mountWebComponentRequest } from '../widget-request-form/src/example/utils';

export const styles = {
  width: 1000,
  height: 500,
};

class Example extends React.Component {
  componentDidMount() {
    helpers.mountWebComponent(mountWebComponentRequest);
  }

  render() {
    return <div id="web-table" style={styles} />;
  }
}

storiesOf('Table', module).add('default', () => <Example />);
