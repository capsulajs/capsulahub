Feature: SocketConnectionService. isConnectionOpened method

  Background:
  Given SocketConnectionService with isConnectionOpened
  And   a valid isConnectedRequest has the following model
        |property |type  |
        |envKey   |string|
  And   an environment with envKey A

Scenario: Call isConnectionOpened method when connection is opened
  Given a connection to the provided environment is established
  When  user calls isConnectionOpened with envKey A
  Then  the promise is resolved with "true"

Scenario: Call isConnectionOpened method when connection is closed
  Given connection to the provided environment has not been established
  When  user calls isConnectionOpened with the envKey A
  Then  the promise is resolved with "false"

Scenario: Call isConnectionOpened method when connection is pending
  Given connection to the provided environment is in pending state
  When  user calls isConnectionOpened with the envKey A
  #Then  TBD

Scenario: Call isConnectionOpened with invalid request
  When user calls isConnectionOpened with an invalid envKey
  Then a relevant error is returned

Scenario: Call isConnectionOpened with an envKey that does not exist
  When  user calls isConnectionOpened with envKey B
  Then  an error message informing that such env doesn't exist is returned
