Feature: SocketConnectionService. events method

Scenario: Subscribe to events and receive all the existing events + the new events
  Given SocketConnectionService with events method
  And   the following events have been recorded
      |events                |
		  |connectionStarted     |
		  |connectionCompleted   |
		  |disconnectionStarted  |
		  |disconnectionCompleted|
		  |error                 |
		  |messageSent           |
		  |messageReceived       |
  When  user subscribes to events method with a valid request
  Then  subscription is opened and it emits all the listed events
  And   the new events that occur afterwards are emitted from the subscription

Scenario: Subscribe to events when there are no events
  Given SocketConnectionService with events method
  And   no events have been recorded
  When  user subscribes to events method with a valid request
  Then  subscription is opened and it doesn't emit anything
