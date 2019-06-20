import { Node, Element } from './index';

export default interface Container extends Node {
  type: 'container';
  orientation: 'horizontal' | 'vertical';
  nodes: [Container | Element, Container | Element];
}
