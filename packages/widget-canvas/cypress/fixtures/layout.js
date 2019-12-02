// prettier-ignore
module.exports = {
  id: 'root',
  type: 'container',
  flex: 1,
  orientation: 'vertical',
  nodes: [
    {
      id: 'node11',
      type: 'element',
      flex: 0.5,
      tabs: [
        {
          id: 'tab11',
          name: 'Tab 11',
          content: '&lt;web-cmponent-11&gt;&lt;/web-component-11&gt;',
        },
        {
          id: 'tab12',
          name: 'Tab 12',
          content: '&lt;web-cmponent-12&gt;&lt;/web-component-12&gt;',
        },
      ],
      activeTabIndex: 0,
    },
    {
      id: 'node21',
      type: 'element',
      flex: 0.5,
      tabs: [
        {
          id: 'tab21',
          name: 'Tab 21',
          content: '&lt;web-cmponent-21&gt;&lt;/web-component-21&gt;',
        },
        {
          id: 'tab22',
          name: 'Tab 22',
          content: '&lt;web-cmponent-22&gt;&lt;/web-component-22&gt;',
        },
      ],
      activeTabIndex: 0,
    },
  ],
}
