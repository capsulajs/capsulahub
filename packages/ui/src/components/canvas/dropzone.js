import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { dropzone } from './settings';
import { isSizeLessThan } from './utils';

const Container = styled.div`
  height: 100%;
  padding: 0;
  margin: 0;
  position: relative;
  background: #676767;
`;

const Sector = styled.div`
  width: 50%;
  height: 50%;
  float: left;
`;

const Centre = styled.div`
  position: absolute;
  height: ${(props) => props.ratio * 100}%;
  width: ${(props) => props.ratio * 100}%;
  top: ${(props) => (1 - props.ratio) * 50}%;
  left: ${(props) => (1 - props.ratio) * 50}%;
  background: transparent;
`;

export default class Dropzone extends React.PureComponent {
  static propTypes = {
    nodeId: PropTypes.string.isRequired,
    tabId: PropTypes.string,
    metadata: PropTypes.any,
  };

  dropZoneRef = React.createRef();

  getStyle(sector) {
    const { nodeId, metadata } = this.props;
    const { destination } = metadata;

    if (destination) {
      if (nodeId === destination.nodeId && destination.sectors.includes(sector)) {
        return { background: dropzone.highlight };
      }
    }

    return {};
  }

  render() {
    const { nodeId, tabId } = this.props;
    const ratio = tabId || isSizeLessThan(this.dropZoneRef.current, dropzone.minSize) ? 1 : dropzone.ratio;

    return (
      <Container ref={this.dropZoneRef} data-cy="canvas-dropzone">
        <Centre data-node-id={nodeId} data-sectors={dropzone.sectors} ratio={ratio} />
        {dropzone.sectors.map((sector) => (
          <Sector data-node-id={nodeId} data-sectors={sector} key={sector} style={this.getStyle(sector)} />
        ))}
      </Container>
    );
  }
}
