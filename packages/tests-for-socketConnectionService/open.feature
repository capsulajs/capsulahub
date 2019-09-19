Feature: ConnectionService. Tests related to open method

Background:
  Given ConnectionService with open and events methods
  And   a valid openConnectionRequest has the following model
        |<property> |<type>|
        |envKey     |string|
        |endpoint   |string|
  And   an environment with envKey 'develop' and endpoint 'wss://develop.com'
  And   user subscribes to events method with a valid request

Scenario: Calling open with a valid request
 Given  there is no "pending connection" or socket connection established
  When  user calls open method with a valid openConnectionRequest with envKey 'develop' and endpoint 'wss://develop.com'
  Then  'connectionStarted' event is emitted
  And   the connection is in a pending state
  And   a socket connection is established for envKey 'develop'
  And   the promise, that was returned from close method has been resolved with void
  And   'connectionCompleted' event is emitted

Scenario: Calling open with an invalid envKey
 Given  there is no "pending connection" or socket connection established
  When  user calls open method with invalid openConnectionRequest by providing following <envKey>
        |<envKey>    |
        |null        |
        |undefined   |
        |123         |
        |' '         |
        |true        |
        |[]          |
        |['test']    |
        |{}          |
        |{ test: [] }|
  Then  the promise, that is returned from the call of the open method, rejects with an error
  And   socket connection is not established

Scenario: Calling open with an invalid endpoint
 Given  there is no "pending connection" or socket connection established
  When  user calls open method with invalid openConnectionRequest by providing following <endpoint>
        |<endpoint>  |
        |null        |
        |undefined   |
        |123         |
        |' '         |
        |true        |
        |[]          |
        |['test']    |
        |{}          |
        |{ test: [] }|
  Then  the promise, that is returned from the call of the open method, rejects with an error
  And   socket connection is not established
  
Scenario: Calling open with a valid request and an error while establishing the connection occurs
 Given  there is no "pending connection" or socket connection established
  When  user calls open method with a valid openConnectionRequest and with envKey 'develop' and endpoint 'wss://develop.com'
  And   the connection is in a pending state
  And  'connectionStarted' event is emitted
  And   an error occurs while establishing the connection
  And  'error' event is emitted
  Then  the promise, that is returned from the call of the open method, rejects with an error
  And   no "pending connection" or socket connection is established

Scenario: Calling open when there is a "pending connection"
  Given user calls open method with a valid openConnectionRequest with envKey 'develop' and endpoint 'wss://develop.com'
  And   the connection is in a pending state
  And   'connectionStarted' event is emitted
  When  user calls open method with a valid openConnectionRequest with envKey 'develop' and endpoint 'wss://develop.com'
  Then  the promise, that is returned from the second call of the open method, rejects with an error
  And   'connectionStarted' event is emitted
  And   the promise, that was returned from the first call of open method has been resolved with void
  And   'connectionCompleted' event is emitted
  And   socket connection is established for 'develop' envKey

Scenario: Calling open when connection is already established for `envKey`
  Given socket connection is established for 'develop' envKey
  When  user calls open method with a valid openConnectionRequest with envKey= 'develop' and endpoint 'wss://develop.com'
  Then  the promise, that is returned from the second call of the open method, rejects with an error
  And   socket connection is still established for 'develop' envKey
