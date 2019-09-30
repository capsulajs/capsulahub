Feature: Create Connection service extension for CapsulaHub

  Background:
    Given Workspace
    And   ConnectionService extension
    And   WorkspaceConfig with ConnectionService extension with the property serviceName: "ConnectionService" in its config

  Scenario: ConnectionService extension bootstrap function resolves correctly and triggers the registration of an instance of WebSocketConnectionService in Workspace
    When  ConnectionService extension bootstrap function is called
    And   serviceConfig is { provider: 'websocket', serviceName: 'WebSocketConnectionService' }
    And   The registration of ConnectionService in Workspace is triggered with the correct arguments
    Then  The promise, that is returned from the call of the bootstrap function, resolves with no args
    And   The returned promise from a call of registration function is resolved (only after the resolve of bootstrap function)
    And   An instance of WebSocketConnectionService is available

  Scenario: ConnectionService extension bootstrap function resolves correctly and triggers the registration of an instance of RSocketConnectionService in Workspace
    When  ConnectionService extension bootstrap function is called
    And   serviceConfig is { provider: 'rsocket', serviceName: 'RSocketConnectionService' }
    And   The registration of ConnectionService in Workspace is triggered with the correct arguments
    Then  The promise, that is returned from the call of the bootstrap function, resolves with no args
    And   The returned promise from a call of registration function is resolved (only after the resolve of bootstrap function)
    And   An instance of RSocketConnectionService is available

  Scenario: ConnectionService extension bootstrap function rejects with an error if "provider" is not in configuration
    When  ConnectionService extension bootstrap function is called
    And   The registration of ConnectionService in Workspace is triggered without any provider in config
    Then  The promise, that is returned from the call of the bootstrap function, rejects with an error "noProvider"
    And   he registration of the ConnectionService in Workspace was not triggered
