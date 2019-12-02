Feature: Build and Run commands for CapsulaHub CLI

  Background:
    Given an npm package called @capsulajs/capsulahub
    And   a default configProvider httpFile
    And   a default path to the output folder "./dist"
    And   a default repository 'workspace'

#______________________________________POSITIVE______________________________________

  #1
  Scenario: Run `capsulahub build` with specifying valid arguments (check for HttpFile provider)
    Given configuration A
    And   token B that allow access to this configuration using HttpFile config provider
    When  I run the command `capsulahub build --token="tokenB" --configProvider="HttpFile" --output="output"`
    Then  the app is built in the specified output path
    And   HttpFile is the provider used to get configuration A

  #2
  Scenario: Run `capsulahub build` with specifying valid arguments (check for LocalFile, Scalecube, HttpServer and LocalStorage provider)
    Given configuration A
    And   token B that allow access to this configuration using <configProvider> and <dispatcherUrl>
          |<configProvider>                   |<dispatcherUrl>        |
          |LocalFileConfigurationProvider     |(empty)                |
          |ScalecubeConfigurationProvider     |'http://localhost:3000'|
          |HttpServerConfigurationProvider    |(empty)                |
          |LocalStorageConfigurationProvider  |(empty)                |
    When  I run the command `capsulahub build --token="tokenB" --configProvider="<configProvider>" --output="output" --dispatcherUrl="<dispatcherUrl>" --repository="customRepository"`# add dispatcherUrl argument in the command only for Scalecube
    Then  the app is built in the specified output path using right configuration provider and repository

   #3
  Scenario: Run `capsulahub build` without specifying the output and configProvider
    Given configuration A
    And   token B that allow access to this configuration
    When  I run the command `capsulahub build --token="tokenB"`
    Then  the app is built in the default output path "./dist"
    And   HttpFile is the provider used to get configuration A

   #4
  Scenario: Run `capsulahub build` without specifying the repository
    Given configuration A
    And   token B that allow access to this configuration
    And   a default repository 'workspace'
    When  I run the command `capsulahub build --token="tokenB" --configProvider="scalecube" --dispatcherUrl="http://localhost:3000" --output="output"`
    Then  the app is built in the specified output path using right configuration provider
    And   default repository is applied

#______________________________________NEGATIVE______________________________________

  #1
  Scenario: Run `capsulahub build` with a non-existent configProvider throws an error
    Given configuration A
    And   token B that allow access to this configuration
    When  I run the command `capsulahub build --token="tokenB" --configProvider="configProvider" `
    And   "configProvider" is not in the list of available configuration types
    Then  a relevant error is received
  #2
  Scenario: Run `capsulahub build` with `--configProvider=` argument and without providing configProvider - throws an error
    Given configuration A
    And   token B that allow access to this configuration
    When  I run the command `capsulahub build --token="tokenB" --configProvider=`
    Then  a relevant error is received
  #3
  Scenario: Run `capsulahub build` with `--token=` argument and without providing token - throws an error
    Given configuration A
    And   token B that allow access to this configuration
    When  I run the command `capsulahub build --token=` without token
    Then  a relevant error is received

  #4
  Scenario: Run `capsulahub build` with `--output=` argument and without providing an output path - throws an error
    Given configuration A
    And   token B that allow access to this configuration
    When  I run the command `capsulahub build --token="tokenB" --output= `
    Then  a relevant error is received

