
Scenario: Check the code pattern to be displayed for javascript language (with different number of arguments)
    Given Request Form web component
    When  javascript is selected language
    Then  default code pattern "return {};" is displayed
    And   the amount of patterns displayed is in correspondence with the number of arguments selected

Scenario: Check the code pattern to be displayed for json language (with different number of arguments)
    Given Request Form web component
    When  json is selected language
    Then  default code pattern "{}" is displayed
    And   the amount of patterns displayed is in correspondence with the number of arguments selected

Scenario: Check Request Form to be split according to the arguments number
    Given Request Form web component
    And   a number of arguments is selected
    And   Request Form is split according to the arguments number
    When  user change the number of arguments by choosing one of up/down arrows or by typing the number itself
    Then  Request Form is split accordingly
    And   the number of divisions is not changing when user switch to another language

Scenario: Submit with a valid request (check different data types in request and the model of data received) (javascript mode)
    Given Request Form web component
    And   a valid input with the following <data type>
          |<data type>|
          | null      |
          | undefined |
          | number    |
          | string    |
          | object    |
          | array     |
          | function  |
    And   Submit button is enabled
    When  user click on Submit button
    Then  request is sent
    And   the object received contains the following <property>
          |<property> |
          |language   |
          |requestArgs|
          
Scenario: Submit with a valid request (check different data types in request and the model of data received) (json mode)
    Given Request Form web component
    And   a valid input with the following <data type>
          |<data type>|
          | null      |
          | number    |
          | string    |
          | object    |
    And   Submit button is enabled
    When  user click on Submit button
    Then  request is sent
    And   the object received contains the following <property>
          |<property> |
          |language   |
          |requestArgs|
          
Scenario: Submit button should be disabled when there is no service/method name displayed
    Given Request Form web component
    When  there is no service/method name displayed on the bottom corner
    Then  Submit button is disabled
    And   request can not be sent

Scenario: Check Submit button to be disabled when there is an invalid request or an empty entry(with different number of arguments)
    Given Request Form web component
    When  an invalid input or an empty entry for specific language is written for at least one of the arguments
    Then  Submit button is disabled
    And   request can not be sent

Scenario: The input should not be deleted after submit
    Given Request Form web component
    And   a valid input for specific language
    And   Submit button is enabled
    When  user click on Submit button
    And   request is sent
    Then  the input that was sent is not removed from the Request Form

Scenario: Switching between languages should not affect the number of arguments selected
    Given Request Form web component
    And   one of the existing languages is selected
    And   a number of arguments is selected
    When  user switch the language to another supported language
    Then  number of arguments is kept the same

Scenario: Line number should be provided when user write an input with several lines
    Given Request Form web component
    When  default code pattern is displayed according to the language selected
    And   user starts new line of writing
    Then  line number is provided for each row of input written

Scenario: Validation errors of the selected language should be displayed next to the line with wrong input
    Given Request Form web component
    And   one of the existing languages is selected
    And   a valid input is entered
    And   no validation errors are displayed
    When  user types an invalid input
    Then  a validation error of the selected language is displayed next to the line with wrong input

Scenario: Removing the arguments number doesnt remove the existing editors and content
   Given Request Form web component is split in few editors
   And   each editor has some content inside
   When  user removes via the keyboard the arguments number
   Then  the existing editors and their content is still available

Scenario: Submit button should be enabled while the number of arguments changes and all the inputs are valid
    Given Request Form web component
    And   one of the existing languages is selected
    And   two or more arguments are selected
    And   one of the arguments includes invalid or empty input
    And   Submit button is disabled
    When  user changes the number of arguments
    And   all the arguments have a valid input
    Then  Submit button is enabled
    
Scenario: Error message should appear, if there is an error in running JS code from the editor after submitting
    Given Request Form web component
    And   one of the existing languages and a number of arguments is selected
    And   the arguments includes a valid input
    And   Submit button is enabled
    When  user clicks on Submit button
    And   an error in running code occurs
    Then  the relevant error message should appear in the footer of the form
    And   Submit button is disabled
    And   the error message dissapears and submit button is enabled if user makes any change in the Request Form

Scenario: If content prop is changed, the form is updated correctly (1 editor - requestArgs: string)
    Given Request Form web component
    And   one of the existing languages 
    And   number of selected arguments is one
    And   the argument includes a valid input
    When  user changes requestArgs to another valid string 
    Then  the content of the argument is updating in correspondence to requestArg value
    And   the language and number of arguments stays the same

Scenario: If content prop is changed, the form is updated correctly (2 editors - requestArgs: string)
    Given Request Form web component
    And   one of the existing languages 
    And   number of selected arguments is two
    And   the arguments include the same valid input
    When  user changes requestArgs to another valid string 
    Then  the content of both arguments is updating in correspondence to requestArg value
    And   the input of both arguments are the same
    And   the language and number of arguments stays the same    
    
Scenario: If content prop is changed, the form is updated correctly (2 editors - requestArgs: array) 
    Given Request Form web component
    And   one of the existing languages 
    And   number of selected arguments is two
    And   the arguments include the same valid input
    When  user changes requestArgs to a valid array of two different strings
    Then  the content of both arguments is updating in correspondence to requestArg value
    And   the input of first argument includes first string from requestArgs's array, the last one - second string
    And   the language and number of arguments stays the same    
    
Scenario: If content prop is changed, the form is updated correctly (change the language) 
    Given Request Form web component
    And   one of the existing languages 
    And   number of selected arguments is two
    And   the arguments include two different valid inputs
    When  user changes the language to another existing one
    And   user changes requestArgs to a valid array of two different strings
    Then  the content of both arguments is updating in correspondence to requestArg value
    And   the input of first argument includes first string from requestArgs's array, the last one - second string
    And   the language is updating accordingly
    And   number of arguments stays the same 
    
Scenario: If content prop is changed, the form is updated correctly (2 editors requestArgs: array (will result in one editor))
    Given Request Form web component
    And   one of the existing languages 
    And   number of selected arguments is two
    And   the arguments include the same valid input
    When  user changes requestArgs to a valid array that contains one strings
    Then  the number of arguments changes to one 
    And   the content of the argument is updating in correspondence to requestArg value
    And   the input of the argument includes the string from requestArgs's array
    And   the language stays the same
