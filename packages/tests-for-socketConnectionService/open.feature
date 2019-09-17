Feature: ConnectionService. Tests related to open method

Background:
  Given ConnectionService with open method
  And   a valid openConnectionRequest has the following model
        |property |type  |
        |envKey   |string|
        |endpoint |string|
  And   there is no "pending connection" or socket connection established

Scenario: Calling open with a valid request
  When  user calls open method with a valid openConnectionRequest
  Then  the connection is in a pending state
  And   a socket connection is established

Scenario: Calling open with an invalid request
  When  user calls open method with an invalid openConnectionRequest
  Then  the promise, that is returned from the call of the open method, rejects with an error
  And   socket connection is not established

Scenario: Calling open with a valid request and an error while establishing the connection occurs
  When  user calls open method with a valid openConnectionRequest
  And   the connection is in a pending state
  And   an error occurs while establishing the connection
  Then  the promise, that is returned from the call of the open method, rejects with an error
  And   no "pending connection" or socket connection is established

Scenario: Calling open when there is a "pending connection"
  Given user calls open method with a valid openConnectionRequest with envKey= 'develop'
  And   the connection is in a pending state
  When  user calls open method with a valid openConnectionRequest with envKey= 'test'
  Then  the promise, that is returned from the second call of the open method, rejects with an error
  And   socket connection is established for 'develop' envKey

Scenario: Calling open when connection is already established for `envKey`
  Given user calls open method with a valid openConnectionRequest with envKey= 'develop'
  And   the connection is in a pending state
  And   socket connection is established for 'develop' envKey
  When  user calls open method with a valid openConnectionRequest with envKey= 'develop'
  Then  the promise, that is returned from the second call of the open method, rejects with an error
  And   socket connection is established for 'develop' envKey
