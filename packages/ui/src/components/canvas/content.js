import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import Dropzone from './dropzone';
import Tabs from './tabs';
import { dropzone } from './settings';

const Container = styled.div`
  width: 100%;
`;

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? dropzone.highlight : '#676767',
  width: '100%',
  height: '100%',
});

export default class Content extends React.PureComponent {
  static propTypes = {
    nodeId: PropTypes.string.isRequired,
    tabs: PropTypes.array.isRequired,
    activeTabIndex: PropTypes.number.isRequired,
    metadata: PropTypes.any,
  };

  render() {
    const { nodeId, tabs, activeTabIndex, metadata } = this.props;

    if (tabs && tabs[activeTabIndex]) {
      const tab = tabs[activeTabIndex];

      if (tab) {
        if (metadata.source || metadata.destination) {
          if (metadata.source) {
            return (
              <Container data-cy={`canvas-node-${nodeId}`}>
                <Tabs nodeId={nodeId} tabs={tabs} activeTabIndex={activeTabIndex} />
              </Container>
            );
          }

          return <Dropzone nodeId={nodeId} tabId={tab.id} metadata={metadata} />;
        }

        return (
          <Container className="canvas-node" data-cy={`canvas-node-${nodeId}`}>
            <Tabs nodeId={nodeId} tabs={tabs} activeTabIndex={activeTabIndex} />
            {typeof tab.content === 'string' && (
              <div
                className="canvas-node-content"
                data-cy="canvas-content"
                dangerouslySetInnerHTML={{ __html: tab.content }}
              />
            )}
            {typeof tab.content === 'function' && (
              <div className={`canvas-node-content ${tab.id}`} data-cy="canvas-content">
                {tab.content()}
              </div>
            )}
          </Container>
        );
      }

      return 'No Active Tab..';
    }

    if (!metadata.source && metadata.destination) {
      return <Dropzone nodeId={nodeId} metadata={metadata} />;
    }

    return (
      <Droppable droppableId={nodeId}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)} {...provided.droppableProps}>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  }
}
