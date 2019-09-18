Feature: ConnectionService. Tests related to send method

Background:
  Given ConnectionService with send and events method
  And   a valid sendMessageRequest has the following model
        |property |type  |
        |envKey   |string|
        |data     |any   |
        |model    |'request/response' or 'request/stream'|

Scenario: Calling send with a valid request (rsocket/websocket)
  Given a socket connection is established for 'develop' envKey
  When  user calls send method with a valid sendMessageRequest
  And   'messageSent' event is emitted
  And   the promise, that was returned from send method has been resolved with void
  Then  the message is sent successfully to the connected environment
  And   'messageReceived' event is emitted

Scenario: Calling send with a valid request (websocket)
  Given a socket connection is established for 'develop' envKey
  When  user calls send method with a valid sendMessageRequest and without providing the model
  And   'messageSent' event is emitted
  And   the promise, that was returned from send method has been resolved with void
  Then  the message is sent successfully to the connected environment
  And   'messageReceived' event is emitted
  
Scenario: Calling send without providing model for rsocket
  Given a rsocket connection is established for 'develop' envKey
  When  user calls send method with a valid sendMessageRequest and without providing the model
  Then  the promise, that is returned from the call of the send method, rejects with an error
  
Scenario: Calling send when the connection is in "pending" state
  Given the socket connection is in a pending state
  When  user calls send method with a valid sendMessageRequest
  And   'messageSent' event is emitted
  Then  the method is waiting for the connection to be established
  And   once connection is established the message is sent successfully to the connected environment
  And   the promise, that was returned from send method will be resolved with void
  And   'messageReceived' event will be emitted
  
Scenario: Calling send with a invalid envKey
  Given a socket connection is established for 'develop' envKey
  When  user calls send method with a valid request and with the following <envKey>
        |<envKey>    |
        |null        |
        |undefined   |
        |123         |
        |'test test' |
        |true        |
        |[]          |
        |['test']    |
        |{}          |
        |{ test: [] }|
  Then  the promise, that is returned from the call of the send method, rejects with an error
  
Scenario: Calling send with a invalid data
  Given a socket connection is established for 'develop' envKey
  When  user calls send method with a valid request and with the following <data>
        |<data>      |
        |null        |
        |undefined   |
        |123         |
        |'test test' |
        |true        |
        |[]          |
        |['test']    |
        |{}          |
        |{ test: [] }|
  Then  the promise, that is returned from the call of the send method, rejects with an error
 
Scenario: Calling send with a invalid model
  Given a socket connection is established for 'develop' envKey
  When  user calls send method with a valid request and with the following <model>
        |<model>      |
        |null        |
        |undefined   |
        |123         |
        |'test test' |
        |true        |
        |[]          |
        |['test']    |
        |{}          |
        |{ test: [] }|
  Then  the promise, that is returned from the call of the send method, rejects with an error
  
Scenario: Calling send when there is no open connection and "pending" state of connection
  Given there is no "pending connection" or socket connection established
  When  user calls send method with a valid sendMessageRequest
  Then  the promise, that is returned from the call of the send method, rejects with an error

Scenario: Calling send when "pending" state of connection failed
  Given the socket connection is in a pending state
  When  user calls send method with a valid sendMessageRequest
  And   'messageSent' event is emitted
  And   connection to the socket failed
  And   'error' event is emitted
  Then  the promise, that is returned from the call of the send method, rejects with an error

Scenario: Calling send when "pending closing of connection" exists
  Given closing of the connection is in a pending state
  When  user calls send method with a valid sendMessageRequest
  Then  the promise, that is returned from the call of the send method, rejects with an error
