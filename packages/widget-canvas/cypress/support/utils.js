export const grapAllNodes = (layout) => {
  const nodes = [];
  const forEachNodeIn = (node) => {
    if (node.type === 'element') {
      nodes.push(node);
    } else {
      node.nodes.forEach(forEachNodeIn);
    }
  };
  forEachNodeIn(layout);
  return nodes;
};
