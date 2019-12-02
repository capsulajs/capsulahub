Scenario: If additionalOptions prop is provided, the dropdown with corresponding options will appear
    Given Request Form component
    When  additionalOptions prop passed to the Request Form component with the following <data> and <type>
          | <data >  | <type>  |
          | label    | string  |
          | fieldName| string  |
          | options  | Option[]|
    And   Option is an array of 'id' and 'label'
    And   all other required props are provided
    Then  the dropdown with options appears in the Request Form
    And   the selected value in dropdown is first option from the options
    And   the label in dropdown is equal to the "label" prop in additionalOptions prop

Scenario: If additionalOptions prop is not provided, the dropdown with corresponding options will not appear
    Given Request Form component
    When  all other required props are provided
    And   additionalOptions prop has not been passed to the Request Form component
    Then  the dropdown with options does not appear in the Request Form

Scenario: The field with the name of additionalOptions is included with the id of a selected value when a user submits the form
    Given Request Form component
    And   additionalOptions with several options and all other required props are provided
    And   the dropdown with options appears in the Request Form
    And   the selected value in dropdown is first option from the options
    When  user selects an option from additionalOptions dropdown
    And   user submits the request form
    Then  the field with the name of additionalOption is included in submitted data and includes the selected option and correct fieldName

Scenario: If "initialValue" is provided in "additionalOptions" prop - this value is initially applied in the dropdown
    Given Request Form component
    When  additionalOptions prop passed to the Request Form component with the following <data> and <type>
          | <data >      | <type>  |
          | label        | string  |
          | fieldName    | string  |
          | options      | Option[]|
          | initialValue | string  |
    And   Option is an array of 'id' and 'label'
    And   'initialValue' is one of the available options
    And   all other required props are provided
    Then  the dropdown with options appears in the Request Form
    And   the selected value in dropdown is 'initialValue' that was provided in props
