Feature: Create AuthService extension for CapsulaHub

  Background:
    Given Workspace
    And   AuthService extension
    And   WorkspaceConfig with AuthService extension 

  Scenario: AuthService extension bootstrap function resolves correctly and triggers the registration of an instance of AuthService in Workspace
    When  AuthService extension bootstrap function is called
    And   serviceConfig is { domain: 'domain', clientId: 'clientId', serviceName: 'AuthService' }
    And   The registration of AuthService in Workspace is triggered with the correct arguments
    Then  The promise, that is returned from the call of the bootstrap function, resolves with no args
    And   The returned promise from a call of registration function is resolved (only after the resolve of bootstrap function)
    And   An instance of AuthService is available

  Scenario: AuthService extension bootstrap function rejects with an error if "serviceName" is invalid or is not in configuration
    When  AuthService extension bootstrap function is called
    And   The registration of AuthService in Workspace is triggered with valid domain and clientId and the following <serviceName>
          |<serviceName>   |
          |null            |
          |undefined       |
          |123             |
          |' '             |
          |''              |
          |true            |
          |false           |
          |[]              |
          |['test']        |
          |{}              |
          |{ test: 'test' }|
    Then  The promise, that is returned from the call of the bootstrap function, rejects with an error "invalidServiceName"
    And   The registration of the AuthService in Workspace was not triggered

  Scenario: AuthService extension bootstrap function rejects with an error if "domain" is invalid or is not in configuration
    When  AuthService extension bootstrap function is called
    And   The registration of AuthService in Workspace is triggered with valid serviceName and clientId and the following <domain>
          |<domain>    |
          |null        |
          |undefined   |
          |123         |
          |' '         |
          |''          |
          |true        |
          |false       |
          |[]          |
          |['test']    |
          |{}          |
          |{ test: 'test' }|
    Then  The promise, that is returned from the call of the bootstrap function, rejects with an error "invalidDomain"
    And   The registration of the AuthService in Workspace was not triggered

  Scenario: AuthService extension bootstrap function rejects with an error if "clientId" is invalid or is not in configuration
    When  AuthService extension bootstrap function is called
    And   The registration of AuthService in Workspace is triggered with valid serviceName and domain and the following <clientId>
          |<clientId>  |
          |null        |
          |undefined   |
          |123         |
          |' '         |
          |''          |
          |true        |
          |false       |
          |[]          |
          |['test']    |
          |{}          |
          |{ test: 'test' }|
    Then  The promise, that is returned from the call of the bootstrap function, rejects with an error "clientId"
    And   The registration of the AuthService in Workspace was not triggered

  Scenario: AuthService extension bootstrap function rejects with an error if "lockOptions" is invalid or is not in configuration
    When  AuthService extension bootstrap function is called
    And   The registration of AuthService in Workspace is triggered with valid serviceConfig and the following <lockOptions>
          |<lockOptions>|
          |null        |
          |test        |
          |555         |
          |' '         |
          |''          |
          |true        |
          |false       |
          |[]          |
          |['test']    |
    Then  The promise, that is returned from the call of the bootstrap function, rejects with an error "lockOptions"
    And   The registration of the AuthService in Workspace was not triggered

Scenario: Bootstrap promise is rejected with an error if an error occurs while the creation of AuthService instance
  Given A valid AuthService configuration
  When  AuthService extension bootstrap function is called with a Workspace as a first argument and AuthService configuration as a second argument
  And   The creation of AuthService instance fails with an error "Error1"
  Then  The promise, that is returned from the call of the bootstrap function, rejects with an error "Error1"
  And   The registration of the service in Workspace was not triggered
