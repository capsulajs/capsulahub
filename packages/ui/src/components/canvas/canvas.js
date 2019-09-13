import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-beautiful-dnd';
import Grid from './grid';
import transform from './utils/transform';
import bus from './services';
import './styles.css';
import 'react-reflex/styles.css';

export default class Canvas extends React.Component {
  static propTypes = {
    layout: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
  };

  state = {
    metadata: {},
  };

  containerRef = React.createRef();

  onDragStart = (metadata) => bus.emit('dragstart', metadata);
  onDragEnd = (metadata) => {
    const { source, destination } = metadata;
    if (destination) {
      destination && source.droppableId === destination.droppableId
        ? bus.emit('reorder', metadata)
        : bus.emit('move', metadata);
    }
    bus.emit('dragend', {});
  };

  componentDidMount() {
    if (this.containerRef.current) {
      this.eventsSubscription = bus.getEventsStream(this.containerRef.current).subscribe(([event, metadata]) => {
        switch (event) {
          case 'dragstart':
            return this.setState({ metadata });
          case 'dragover':
            return this.setState({ metadata });
          case 'dragend':
            return this.setState({ metadata });
          default:
            return this.props.onUpdate(transform(this.props.layout, event, metadata));
        }
      });
    }
  }

  render() {
    const { metadata } = this.state;
    const { layout, className } = this.props;

    return (
      <div ref={this.containerRef} className={`canvas-container ${className ? ` ${className}` : ''}`} data-cy="canvas">
        <DragDropContext onBeforeDragStart={this.onDragStart} onDragEnd={this.onDragEnd}>
          <Grid layout={layout} metadata={metadata} />
        </DragDropContext>
      </div>
    );
  }

  componentWillUnmount() {
    this.eventsSubscription.unsubscribe();
  }
}
