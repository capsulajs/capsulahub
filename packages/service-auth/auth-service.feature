Feature: Auth service

Scenario: Calling init method with a valid request when user has previously an auth session
  Given AuthService with init and authStatus methods
  And   user has previously an auth session
  And   user subscribes to authStatus method with a valid request
  When  user calls init method with a valid request
  Then  the promise, that was returned from init method has been resolved with current auth status
  And   authStatus emits an update about the current auth status

Scenario: Calling init method with a valid request when user wasn't previously authenticated
  Given AuthService with init and authStatus methods
  And   user wasn't previously authenticated
  And   user subscribes to authStatus method with a valid request
  When  user calls init method with a valid request
  Then  the promise, that was returned from init method has been resolved with an empty object
  And   authStatus emits an empty object

Scenario: Calling login method with a valid request when user is authenticated
  Given AuthService with login method
  And   user is authenticated
  When  user calls login method with a valid request
  Then  an error that user is already authenticated is returned

Scenario: Calling login method with a valid request when user is not authenticated
  Given AuthService with login and authStatus methods
  And   user is not authenticated
  And   user subscribes to authStatus method with a valid request
  When  user calls login method with a valid request
  Then  the promise, that was returned from login method has been resolved with user data
  And   authStatus emits an update about the current auth status

Scenario: Calling logout method with a valid request when user is authenticated
  Given AuthService with login and authStatus methods
  And   user is authenticated
  And   user subscribes to authStatus method with a valid request
  When  user calls logout method with a valid request
  Then  the promise, that was returned from logout method has been resolved with void
  And   authStatus emits an update about the current auth status

Scenario: Calling logout method with a valid request when user is not authenticated
  Given AuthService with logout method
  And   user is not authenticated
  When  user calls logout method with a valid request
  Then  an error that user is not authenticated is returned
  
