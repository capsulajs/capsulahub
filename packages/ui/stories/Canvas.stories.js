import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Canvas } from 'src';
import styled from 'styled-components';

const Container = styled.div`
  width: 1000px;
  height: 500px;
`;

export default class CanvasExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      layout: {
        id: 'root',
        type: 'container',
        flex: 1,
        orientation: 'vertical',
        nodes: [
          {
            id: 'node11',
            type: 'element',
            flex: 0.5,
            tabs: [
              {
                id: 'tab11',
                name: 'Tab 11',
                content: () => <h1>Test</h1>,
              },
            ],
            activeTabIndex: 0,
          },
          {
            id: 'node21',
            type: 'element',
            flex: 0.5,
            tabs: [
              {
                id: 'tab21',
                name: 'Tab 21',
                content: '&lt;web-cmponent-21&gt;&lt;/web-component-21&gt;',
              },
            ],
            activeTabIndex: 0,
          },
        ],
      },
    };
    this.onUpdate = this.onUpdate.bind(this);
  }

  onUpdate({ eventType, layout }) {
    if (eventType === 'move') {
      this.setState({ layout });
    }
  }

  render() {
    return (
      <Container>
        <Canvas layout={this.state.layout} onUpdate={this.onUpdate} />
      </Container>
    );
  }
}

storiesOf('Canvas', module).add('default', () => <CanvasExample />);
