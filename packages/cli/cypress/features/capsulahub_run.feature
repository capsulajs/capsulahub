Feature: Build and Run commands for CapsulaHub CLI

  Background:
    Given an npm package called @capsulajs/capsulahub
    And   a default port 55555
    And   a default configProvider httpFile

#______________________________________POSITIVE______________________________________

  #1
  Scenario: Run CapsulaHub instance with specifying valid arguments (check for HttpFile provider)
    Given a configuration that includes component A
    And   token B that allow access to this configuration using HttpFile config provider
    When  I run the command `capsulahub run --token="tokenB" --configProvider="HttpFile"  --port="8888"`
    And   the app is running on the specified port "8888"
    And   I open the app in the browser
    Then  I see component A rendered in the app
    And   HttpFile is the provider used to get configuration of token B

  #2
  Scenario: Run CapsulaHub instance with specifying valid arguments (check for LocalFile, Scalecube, HttpServer and LocalStorage provider)
    Given a configuration that includes component A
    And   token B that allow access to this configuration using <configProvider> and <dispatcherUrl>
          |<configProvider>                   |<dispatcherUrl>        |
          |LocalFileConfigurationProvider     |(empty)                |
          |ScalecubeConfigurationProvider     |'http://localhost:3000'|
          |HttpServerConfigurationProvider    |(empty)                |
          |LocalStorageConfigurationProvider  |(empty)                |
    When  I run the command `capsulahub run --token="tokenB" --configProvider="<configProvider>"  --port="8888" --dispatcherUrl="<dispatcherUrl>"`# add dispatcherUrl argument in the command only for Scalecube
    Then  an workspace is created using the right configuration provider

  #3
  Scenario: Run CapsulaHub instance without specifying the port and configProvider
    Given a configuration that includes component A
    And   token B that allow access to this configuration
    When  I run the command `capsulahub run --token="tokenB"`
    And   the app is running on the default port "55555"
    And   I open the app in the browser
    Then  I see component A rendered in the app
    And   HttpFile is the provider used to get configuration of token B

  #4
  Scenario: Run CapsulaHub instance with the same token on two different ports
    Given a configuration that includes component A
    And   token B that allow access to this configuration
    And   two valid ports "1234" and "4321"
    When  I run the command `capsulahub run --token="tokenB" --port="1234"`
    And   I run the command `capsulahub run --token="tokenB" --port="4321"`
    And   two apps are running on two different ports "1234" and "4321"`
    And   I open the apps in the browser
    Then  I see component A rendered in the app on port "1234"
    And   I see component A rendered in the other app on port "4321"
    And   HttpFile is the provider used to get configuration of token B for both workspaces

   #5
  Scenario: Run CapsulaHub instance with two different tokens on two different ports
    Given a configuration that includes component A1
    And   a configuration that includes component A2
    And   token B1 that allow access to configuration with component A1
    And   token B2 that allow access to configuration with component A2
    And   two valid ports "1234" and "4321"
    When  I run the command `capsulahub run --token="tokenB1" --port="1234"`
    And   I run the command `capsulahub run --token="tokenB2" --port="4321"`
    And   two apps are running on two different ports "1234" and "4321"`
    And   I open the apps in the browser
    Then  I see component A1 rendered in the app on port "1234"
    And   I see component A2 rendered in the other app on port "4321"
    And   HttpFile is the provider used to get configuration of token B for both workspaces

#______________________________________NEGATIVE______________________________________

  #1
  Scenario: Run CapsulaHub instance without token throws an error
    Given a configuration that includes component A
    And   token B that allow access to this configuration
    When  I run the command `capsulahub run`
    Then  a relevant error is received

  #2
  Scenario: Run CapsulaHub instance with invalid port
    Given a configuration that includes component A
    And   token B that allow access to this configuration
    When  I run the command `capsulahub run --token="tokenB" --port="invalidPort" `
    Then  a relevant error is received

   #3
  Scenario: Run CapsulaHub instance with a non-existent configProvider throws an error
    Given a configuration that includes component A
    And   token B that allow access to this configuration
    When  I run the command `capsulahub run --token="token" --configProvider="invalidProvider" `
    And   "configProvider" is not in the list of available configuration types
    Then  a relevant error is received

  #4
  Scenario: Run CapsulaHub instance twice on the same port
    Given a configuration that includes component A
    And   token B that allow access to this configuration
    And   a port "8888"
    When  I run the command `capsulahub run --token="tokenB" --port="8888" `
    And   I run the command `capsulahub run --token="tokenB" --port="8888" `
    Then  a relevant error is received
