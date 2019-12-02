import { Node, Tab } from './index';

export default interface Element extends Node {
  type: 'element';
  activeTabIndex: number;
  tabs: Tab[];
}
