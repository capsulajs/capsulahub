
Scenario: The correspondent modal title and content is displayed
  Given ModalUIProps with title, children and isOpen property
  And   a title "Title" and children "Content"
  And   <isOpen> property has the following value
        |<isOpen>|
		|  true  |
		|  false |
  When  I open the modal component
  Then  I see the correspondent title and content displayed if isOpen: true
  And   the modal is closed if isOpen: false

Scenario: Check default value of isOpen property
  Given ModalUIProps with title, children
  And   I don't mention isOpen property in ModalUIProps
  When  I open the modal component
  Then  the modal is closed
  And   the default value isOpen: false is applied

Scenario: Click on cross - isOpen became false
  Given ModalUIProps with title, children and isOpen property
  And   I have modal component opened (isOpen: true)
  When  I click on cross
  Then  modal is closed (isOpen: false)

Scenario: Click on background - isOpen became false
  Given ModalUIProps with title, children and isOpen property
  And   I have modal component opened (isOpen: true)
  When  I click on background
  Then  modal is closed (isOpen: false)
