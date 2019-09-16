Feature: SocketConnectionService. Tests related to send method

Background:
  Given SocketConnection with send method
  And   a valid sendMessageRequest has the following model
        |property |type  |
        |envKey   |string|
	|data     |any   |
        |model    |'request/response' or 'request/stream'|

Scenario: Calling send with a valid request (rsocket/websocket)
  Given a socket connection is established for 'develop' envKey
  When  user calls send method with a valid sendMessageRequest
  Then  the message is sent successfully to the connected environment

Scenario: Calling send with a valid request (websocket)
  Given a socket connection is established for 'develop' envKey
  When  user calls send method with a valid sendMessageRequest and without providing the model
  Then  the message is sent successfully to the connected environment

Scenario: Calling send when the connection is in "pending" state
  Given user called open method and the connection is in a pending state
  When  user calls send method with a valid sendMessageRequest
  Then  the method is waiting for the connection to be established
  And   once connection is established the message is sent successfully to the connected environment

Scenario: Calling send with a invalid request
  Given a socket connection is established for 'develop' envKey
  When  user calls send method with an invalid sendMessageRequest
  Then  the promise, that is returned from the call of the send method, rejects with an error

Scenario: Calling send when there is no open connection and "pending" state of connection
  Given there is no "pending connection" or socket connection established
  When  user calls send method with a valid sendMessageRequest
  Then  the promise, that is returned from the call of the send method, rejects with an error

Scenario: Calling send when "pending" state of connection failed
  Given user called open method and the connection is in a pending state
  When  user calls send method with a valid sendMessageRequest
  And   connection to the socket failed
  Then  the promise, that is returned from the call of the send method, rejects with an error

Scenario: Calling send when "pending closing of connection" exists
  Given user called close method when was a socket connection established
  And   closing of the connection is in a pending state
  When  user calls send method with a valid sendMessageRequest
  Then  the promise, that is returned from the call of the send method, rejects with an error
