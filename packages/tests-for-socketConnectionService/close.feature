Feature: ConnectionService. Tests related to close method

Background:
  Given ConnectionService with close and events method
  And   a valid closeConnectionRequest has the following model
        |<property> |<type>  |
        |envKey     |string  |
  And   an environment with envKey 'develop'
  And   user subscribes to events method with a valid request

Scenario: Calling close with a valid request
  Given a socket connection is established for envKey 'develop'
  When  user calls close method with a valid closeConnectionRequest and with envKey 'develop'
  Then  closing of the connection is in a pending state
  And   'disconnectionStarted' event is emitted
  And   disconnection from the socket connection is provided for 'develop'
  And   the promise, that was returned from close method has been resolved with void
  And   'disconnectionCompleted' event is emitted

Scenario: Calling close with an invalid request
  Given a socket connection is established for envKey 'develop'
  When  user calls close method with the following <closeConnectionRequest>
        |<closeConnectionRequest>  |
        |null                      |
        |undefined                 |
        |123                       |
        |' '                       |
        |true                      |
        |[]                        |
        |['test']                  |
        |{}                        |
        |{ test: [] }              |
  Then  the promise, that is returned from the call of the close method, rejects with an error
  And   the socket connection for 'develop' is still established

Scenario: Calling close when no connection has been currently established 
  Given there is no socket connection established
  When  user calls close method with a valid closeConnectionRequest
  Then  the promise, that is returned from the call of the close method, rejects with an error
  And   'disconnectionStarted' event is not emitted

Scenario: Calling close when there is a "pending closing of connection"
  Given a socket connection is established for envKey 'develop'
  And   user calls close method with a valid closeConnectionRequest and with envKey 'develop'
  And   'disconnectionStarted' event is emitted
  And   closing of the connection is in a pending state
  When  user calls close method with a valid closeConnectionRequest and with envKey 'develop'
  Then  the promise, that is returned from the second call of close method, rejects with an error
  And   the promise, that was returned from the first call of close method has been resolved with void
  And   'disconnectionCompleted' event is emitted
  And   disconnection from the socket connection is provided
