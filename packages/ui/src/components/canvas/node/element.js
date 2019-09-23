import React from 'react';
import PropTypes from 'prop-types';
import Container from './container';
import Content from '../content';

export default class Element extends React.PureComponent {
  static propTypes = {
    node: PropTypes.object.isRequired,
    metadata: PropTypes.any,
  };

  render() {
    const { node, metadata } = this.props;
    const { id, type, tabs, activeTabIndex, orientation, nodes } = node;

    if (type === 'container') {
      return <Container nodes={nodes} orientation={orientation} metadata={metadata} />;
    } else {
      return <Content nodeId={id} tabs={tabs} activeTabIndex={activeTabIndex} metadata={metadata} />;
    }
  }
}
