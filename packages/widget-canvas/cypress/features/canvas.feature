Scenario: Each node can have one or more tabs according to tabs, activeTabIndex and content parameters
  Given Canvas web component with at least 1 node
  When one or more tabs are defined in tabs config of this node
  And setting the index of a certain tab in activeTabIndex
  Then the number of tabs displayed in the node is according to the config
  When setting the index of a certain tab in activeTabIndex
  Then she relevant tab appears as selected by default
  When having some content in content parameter for this tab
  Then the content is displayed inside the tab

Scenario: The name of the tab can be edited manually by the user
   Given Canvas web component with at least 1 node and 1 tab
   When double click on the name of the tab and type a new name
   Then the name of the tab is updated accordingly

Scenario: Check that tab can be closed
   Given Canvas web component with at least 1 node and 2 tab
   When click on x icon next to first tab
   And click on x icon next to the second tab
   Then the first tab gets closed
   And the second tabs gets closed and the node is removed from the canvas

Scenario: Click on inactive tab will make it active
   Given Canvas web component with 1 node and 2 tabs
   When click on the name of the inactive tab
   Then the inactive tab will become active and the active one - inactive

@manual
Scenario: Check that tabs can be switched with places
  Given Canvas web component with several nodes and tabs
  When drag a tab by its name and drop it on top of other tab (in the same node on in other node)
  Then the two tabs are switched with places
