import findIndex from 'lodash/findIndex';
import { getNode } from '.';
import createNode from './node/create';
import updateNode from './node/update';
import removeTab from './tab/remove';
import moveTab from './tab/move';
import reorderTab from './tab/reorder';

export default (layout, event, metadata) => {
  const { source, destination, nodeId, tabId, ...updates } = metadata;
  const node = getNode(layout, nodeId);

  switch (event) {
    case 'drop':
      return { eventType: event, layout: createNode(layout, metadata) };
    case 'resizestop':
      const updateMultipleNodes = (layout, updates = []) => {
        const [update, ...rest] = updates;
        if (update) {
          return updateMultipleNodes(updateNode(layout, update), rest);
        }
        return layout;
      };
      return { eventType: event, data: { ...metadata }, layout: updateMultipleNodes(layout, metadata) };
    case 'resize': {
      const updateMultipleNodes = (layout, updates = []) => {
        const [update, ...rest] = updates;
        if (update) {
          return updateMultipleNodes(updateNode(layout, update), rest);
        }
        return layout;
      };
      // No need to recalculate each resize
      return { eventType: event, data: { ...metadata }, layout: undefined };
    }
    case 'reorder':
      return {
        eventType: event,
        data: {
          source: { tabId: source.index, nodeId: source.droppableId },
          destination: { tabId: destination.index, nodeId: destination.droppableId },
        },
        layout: reorderTab(layout, source, destination),
      };

    case 'move':
      return {
        eventType: event,
        data: {
          source: { tabId: source.index, nodeId: source.droppableId },
          destination: { tabId: destination.index, nodeId: destination.droppableId },
        },
        layout: moveTab(layout, source, destination),
      };
    case 'select':
      const activeTabIndex = findIndex(node.tabs, (tab) => tab.id === tabId);
      return {
        eventType: event,
        data: { nodeId, activeTabIndex },
        layout: updateNode(layout, { nodeId, activeTabIndex }),
      };
    case 'update': {
      const tabs = node.tabs.map((tab) => {
        if (tab.id === tabId) {
          return { ...tab, ...updates };
        }
        return tab;
      });
      return { eventType: event, layout: updateNode(layout, { nodeId, tabs }) };
    }
    case 'remove':
      return { eventType: event, layout: removeTab(layout, metadata) };
    default:
      return layout;
  }
};
