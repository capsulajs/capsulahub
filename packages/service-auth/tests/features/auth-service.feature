Feature: Auth service

Scenario: Calling init method with a valid request when user has previously an auth session
  Given AuthService with init and authStatus methods
  And   user has previously an auth session
  And   user subscribes to authStatus method with a valid request
  When  user calls init method with a valid request
  Then  the promise that was returned from init method is resolved with user data of the previous auth session
  And   authStatus emits an update that includes the information about the user from previous auth session

Scenario: Calling init method with a valid request when user hasn't previously an auth session
  Given AuthService with init and authStatus methods
  And   user hasn't previously an auth session
  And   user subscribes to authStatus method with a valid request
  When  user calls init method with a valid request
  Then  the promise that was returned from init method is resolved with an empty object
  And   authStatus emits an empty object

Scenario: Calling init method with a valid request and a server error occurs (while checking session and getting user data)
  Given AuthService with init method
  And   user has previously an auth session
  When  user calls init method with a valid request
  And   a server error occurs
  Then  init promise is rejected with an error

Scenario: Calling login method when user has previously an auth session and init promise is in a pending state
  Given AuthService with login and init method
  And   user is not authenticated
  And   user has previously an auth session
  And   user calls init method and the init promise is in a pending state
  When  user calls login method with a valid request
  Then  the promise that was returned from init method is resolved with data of the user of the previous auth session
  And   login promise is rejected with an error
  And   user is authenticated

Scenario: Calling login method when user hasn't previously an auth session and init promise is in a pending state
  Given AuthService with login and init method
  And   user hasn't previously an auth session
  And   user calls init method and the init promise is in a pending state
  When  user calls login method with a valid request
  Then  the promise that was returned from init method is resolved with an empty object
  And   auth0 modal is rendered on the screen
  And   if user sign up in the auth0 modal the promise that was returned from login method will be resolved with current user data

Scenario: Calling login method with a valid request when user is authenticated
  Given AuthService with login method
  And   user is authenticated
  When  user calls login method with a valid request
  Then  login promise is rejects with an error

Scenario: Calling login method with a valid request when user is not authenticated and authorizes through sign in
  Given AuthService with login, init and authStatus methods
  And   user is not authenticated
  And   user hasn't previously an auth session
  And   user calls init method and the promise that was returned from init method is resolved with an empty object
  And   user subscribes to authStatus method and authStatus emits an empty object
  When  user calls login method with a valid request
  And   auth0 modal is rendered on the screen
  And   user clicks sign in in the auth0 modal
  Then  the promise that was returned from login method is resolved with user data
  And   authStatus emits an update about the current auth status that will include the information that user is not a new one
  And   auth0 modal is removed from the screen

Scenario: Calling login method with a valid request when user is not authenticated and authorizes through sign up
  Given AuthService with login and authStatus methods
  And   user is not authenticated
  And   user hasn't previously an auth session
  And   user calls init method and the promise that was returned from init method is resolved with an empty object
  And   user subscribes to authStatus method and authStatus emits an empty object
  When  user calls login method with a valid request
  And   auth0 modal is rendered on the screen
  And   user clicks sign up in the auth0 modal
  Then  the promise that was returned from login method is resolved with user data
  And   authStatus emits an update about the current auth status that will include the information that user is a new one
  And   auth0 modal is removed from the screen

Scenario: Calling login method with a valid request and a server error occurs while getting user data
  Given AuthService with login and authStatus methods
  And   user is not authenticated
  And   user hasn't previously an auth session
  And   user calls init method and the promise that was returned from init method is resolved with an empty object
  And   user subscribes to authStatus method with a valid request and authStatus emits an empty object
  When  user calls login method with a valid request
  And   auth0 modal is rendered on the screen
  And   user clicks sign up in the auth0 modal
  And   a server error occurs
  Then  login promise is rejected with an error
  And   auth0 modal is removed from the screen

Scenario: Closing auth0 modal when login promise is in a pending state
  Given AuthService with login and authStatus methods
  And   user is not authenticated
  And   user hasn't previously an auth session
  And   user calls init method and the promise that was returned from init method is resolved with an empty object
  And   user calls login method and login promise is in a pending state
  And   auth0 modal is rendered on the screen
  When  user closes auth0 modal
  Then  login promise is rejected with an error

Scenario: Calling logout method with a valid request when user is authenticated
  Given AuthService with logout and authStatus methods
  And   user is authenticated
  And   user subscribes to authStatus method with a valid request
  When  user calls logout method with a valid request
  Then  the promise that was returned from logout method is resolved with void
  And   user is not authenticated
  And   authStatus emits an update about the current auth status

Scenario: Calling AuthService methods when a critical error from auth0 occurs
  Given AuthService with init, login, logout and authStatus methods
  When  a critical error from auth0 occurs
  And   user calls one of the AuthService <method>s
        | <method>   |
        | init       |
        | login      |
        | logout     |
  And   user subscribes to authStatus method
  Then  <method> promise is rejected with an error
  And   authStatus stream receive an error
