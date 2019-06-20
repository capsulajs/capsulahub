
Scenario: Calling renderLayouts renders the layouts from configuration
  Given Renderer service with renderLayouts method
  And   workspace configuration that includes several layouts
  When  I call renderLayouts method with a valid request
  Then  promise is resolved and layouts from configuration are rendered

Scenario: Calling renderItems renders items from configuration
  Given Renderer service with renderItems method
  And   layout is rendered
  And   workspace configuration that includes several items
  When  I call renderItems method with a valid request
  Then  both items are rendered

Scenario: Call renderItems when layout is not rendered  is rejected with error
  Given Renderer service with renderItems method
  And   workspace configuration that includes several items
  And   layout is not rendered
  When  I call renderItems method with a valid request
  Then  'callRenderLayoutBefore' error is returned

Scenario: Calling renderItem with nodeId renders the relevant item
  Given Renderer service with renderItem method
  And   one item with valid nodeId
  And   layout is rendered
  When  I call renderItem method with a valid request and with valid nodeId
  Then  the item with specific nodeId is rendered

Scenario: Call renderItem with invalid nodeId is rejected with error
  Given Renderer service with renderItem method
  And   layout is rendered
  And   one item with invalid nodeId
  When  I call renderItem method with one of the following values for <nodeId>
        |<nodeId>  |
        |{}        |
        |{ test: 'test' }|
        |[]        |
        |['test']  |
        |null      |
        |undefined |
        |true      |
        |false     |
        |0         |
        |-1        |
  Then  'invalidNodeId' error is returned

Scenario: Call renderItem with an nodeId which does not exist in configuration is rejected with error
  Given Renderer service with renderItem method
  And   layout is rendered
  And   one item with valid nodeId
  When  I call renderItem method with the nodeId which does not exist in configuration
  Then  'notFoundComponent' error is returned

Scenario: Calling renderItem with nodeId which node not exist rejects the with error
  Given Renderer service with renderItem method
  And   one item with valid nodeId
  When  I call renderItem method with a valid request and with valid nodeId
  Then  'notFoundNode' error is returned
