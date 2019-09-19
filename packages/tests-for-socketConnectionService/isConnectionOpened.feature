Feature: ConnectionService. isConnectionOpened method

  Background:
  Given ConnectionService with isConnectionOpened
  And   a valid isConnectedRequest has the following model
        |property |type  |
        |envKey   |string|
  And   an environment with envKey A

Scenario: Call isConnectionOpened method when connection is established
  Given a connection to the provided environment is established
  When  user calls isConnectionOpened with envKey A
  Then  user receives "true"

Scenario: Call isConnectionOpened method when there's no connection established
  Given connection to the provided environment has not been established
  When  user calls isConnectionOpened with the envKey A
  Then  user receives "false"

Scenario: Call isConnectionOpened method when connection is pending
  Given connection to the provided environment is in pending state
  When  user calls isConnectionOpened with the envKey A
  Then  user receives "false"

Scenario: Call isConnectionOpened with invalid request
  When user calls isConnectionOpened with an invalid isConnectedRequest
  Then a relevant error is returned


