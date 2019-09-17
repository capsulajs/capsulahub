Feature: ConnectionService. Tests related to close method

Background:
  Given ConnectionService with close method
  And   a valid closeConnectionRequest has the following model
        |property |type  |
        |envKey   |string|
  And   a socket connection is established for 'develop' envKey

Scenario: Calling close with a valid request
  When  user calls close method with a valid closeConnectionRequest
  Then  closing of the connection is in a pending state
  And   disconnection from the socket connection is provided

Scenario: Calling close with an invalid request
  When  user calls close method with an invalid closeConnectionRequest
  Then  the promise, that is returned from the call of the close method, rejects with an error
  And   the socket connection for 'develop' is still established

Scenario: Calling close when no connection has been currently established for envKey
  Given user calls close method with a valid closeConnectionRequest
  And   closing of the connection is in a pending state
  And   disconnection from the socket connection is provided
  When  user calls close method with a valid closeConnectionRequest
  Then  the promise, that is returned from the call of the close method, rejects with an error
  And   no "pending connection" or socket connection is established

Scenario: Calling close when there is a "pending closing of connection"
  Given user calls close method with a valid closeConnectionRequest
  And   closing of the connection is in a pending state
  When  user calls close method with a valid closeConnectionRequest
  Then  the promise, that is returned from the second call of the close method, rejects with an error
  And   disconnection from the socket connection is provided
