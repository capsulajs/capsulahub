import React from 'react';
import PropTypes from 'prop-types';
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex';
import Element from './element';
import bus from '../services';
import styles from './styles';

export default class Container extends React.PureComponent {
  static propTypes = {
    nodes: PropTypes.array.isRequired,
    orientation: PropTypes.string.isRequired,
    metadata: PropTypes.any,
  };

  onResize = (e) => {
    const { nodeId, flex } = e.component.props;
    bus.emit('resize', { nodeId, flex });
  };

  onStopResize = (e) => {
    const { nodeId, flex } = e.component.props;
    bus.emit('resizestop', { nodeId, flex });
  };

  render() {
    const { id, nodes, orientation, metadata } = this.props;
    const reduce = (acc, node, idx) => {
      const style = node.type === 'container' ? styles.container : styles.element[orientation || 'horizontal'];
      const splitter = (
        <ReflexSplitter
          style={styles.splitter[orientation || 'horizontal']}
          key={'S' + idx}
          className={`canvas-reflex-resizer ${orientation}`}
        />
      );
      const n = (
        <ReflexElement
          style={style}
          className={`canvas-reflex-element ${orientation}`}
          flex={node.flex}
          key={'N' + idx}
          minSize={node.minSize}
          nodeId={node.id}
          onResize={this.onResize}
          onStopResize={this.onStopResize}
        >
          <Element node={node} key={'N' + idx} metadata={metadata} />
        </ReflexElement>
      );
      return idx > 0 ? [...acc, splitter, n] : [...acc, n];
    };

    return (
      <ReflexContainer
        className="canvas-node-container"
        orientation={orientation || 'horizontal'}
        data-cy={`canvas-node-${id}`}
      >
        {nodes.reduce(reduce, [])}
      </ReflexContainer>
    );
  }
}
