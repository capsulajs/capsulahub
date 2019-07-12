
Scenario: Call setItems with items and get items at subscription after one emission
    Given Selector Service with setItems method
    And   user calls setItems with [A, B, C]
    When  user subscribes to items$
    Then  user receives [A, B, C]

Scenario: Call setItems with items successively and get items after subscription
    Given Selector Service with setItems method
    And   user calls setItems with [A, B, C]
    And   user subscribes to items$
    And   user receives [A, B, C]
    When  user calls setItems with [D, E, F]
    Then  user receives [D, E, F]

Scenario: Call setItems with invalid items
   Given Selector Service with setItems method
   And   user calls setItems with an invalid <items>
         |<items>           |
         |null              |
         |undefined         |
         |123               |
         |true              |
         |{}                |
         |{ test: 'test'}   |
   Then  the promise is rejected with an invalidSetItemsRequest error

Scenario: selectItem selects one of the stored items in the Selector by key
    Given  Selector Service with selectItem method
    And    user calls setItems with [{key: A, value: valueA}, {key: B, value: valueB}, {key: C, value: valueC}]
    When   user calls selectItem method with {key: A}
    Then   the item A is selected
    And    subscribing to selectedItem will return the item A

Scenario: Call selectItem with invalid key
    Given Selector Service with selectItem method
    And   user calls setItems with [{key: A, value: valueA}, {key: B, value: valueB}, {key: C, value: valueC}]
    When  user calls selectItem with an invalid <key>
         |<key>      |
         |null       |
         |undefined  |
         |123        |
         |[]         |
         |true       |
         |{}         |
     Then the promise is rejected with an invalidSelectItemRequest error

Scenario: Call selectItem with a non-existent key
    Given  Selector Service with selectItem method
    And    user calls setItems with [{key: A, value: valueA}, {key: B, value: valueB}, {key: C, value: valueC}]
    When   user calls selectItem method with a non existing <key>
          |<key>                    |
          |{ key: D }               |
          |{ test: 'test' }         |
          |{ test: 'test', key: B } |
    Then   the promise is rejected with an itemNotFound error

Scenario: selectedItems$ returns the selected item
    Given Selector Service with selectedItem method
    And    user calls setItems with [{key: A, value: valueA}, {key: B, value: valueB}, {key: C, value: valueC}]
    And    user subscribes to selectedItem method
    When   <item> is selected
         |<item>    |
         |{key: A}  |
         |{key: B}  |
         |{key: C}  |
    Then  selectedItem subscription emits successively the items A, B and C

Scenario: Call selectItem with currently selected item
  Given  Selector Service with selectItem method
  And    user calls setItems with [{key: A, value: valueA}, {key: B, value: valueB}, {key: C, value: valueC}]
  And    user calls selectItem method with {key: A}
  When   user calls selectItem method with {key: A} again
  Then   the promise is rejected with an itemAlreadySelected error

Scenario: Call selectItem when no data in selector
  Given  Selector Service with selectItem method
  And    user doesn't call setItems
  When   user calls selectItem method with {key: A}
  Then   the promise is rejected with an noData error

Scenario: Preserve selectedItem$ after setItems if the selected item is in the new set
  Given   Selector Service with setItems, selectItem and selectedItem$ methods
  And     user calls setItems with [{key: A, value: valueA}, {key: B, value: valueB}, {key: C, value: valueC}]
  And     user calls selectItem method with {key: A}
  And     user subscribes to selectedItem$ method
  And     selectedItem$ emits item A
  When    user calls setItems with [{key: A, value: valueA}, {key: D, value: valueD}]
  Then    selectedItem$ emits nothing
  And     item A is still selected

Scenario: Reset selectedItem$ after setItems if the selected item is not in the new set
  Given   Selector Service with setItems, selectItem and selectedItem$ methods
  And     user calls setItems with [{key: A, value: valueA}, {key: B, value: valueB}, {key: C, value: valueC}]
  And     user calls selectItem method with {key: A}
  And     user subscribes to selectedItem$ method
  And     selectedItem$ emits item A
  When    user calls setItems with [{key: D, value: valueD}, {key: E, value: valueE}, {key: F, value: valueF}]
  Then    selectedItem$ emits {}
  And     item A is no longer selected
