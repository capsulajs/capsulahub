class LayoutABC extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<div data-cy="layout-abc">
      <div id="item-a"></div>
      <div id="item-b"></div>
      <div id="item-c"></div>
    </div>`;
  }
}

class ItemA extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<div data-cy=item-a>Item A</div>`;
  }
}

class ItemB extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<div data-cy=item-b>Item B</div>`;
  }
}

class ItemC extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<div data-cy=item-c>Item C</div>`;
  }
}

customElements.define('layout-abc', LayoutABC);
customElements.define('item-a', ItemA);
customElements.define('item-b', ItemB);
customElements.define('item-c', ItemC);

export default {
  LayoutABC: Promise.resolve({
    nodeId: 'layout-abc',
    type: 'layout',
    componentName: 'layout-abc',
    reference: new LayoutABC(),
  }),
  ItemA: Promise.resolve({
    nodeId: 'item-a',
    type: 'item',
    componentName: 'item-a',
    reference: new ItemA(),
  }),
  ItemB: Promise.resolve({
    nodeId: 'item-b',
    type: 'item',
    componentName: 'item-b',
    reference: new ItemB(),
  }),
  ItemC: Promise.resolve({
    nodeId: 'item-c',
    type: 'item',
    componentName: 'item-c',
    reference: new ItemC(),
  }),
};
