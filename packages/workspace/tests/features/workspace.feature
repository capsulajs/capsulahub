
#______________________________________POSITIVE______________________________________

#1
Scenario: Call createWorkspace when a Workspace is created creates new instance of Workspace
    Given WorkspaceFactory instance with createWorkspace method
    And  Configuration for token 123 that includes service A and B and components 1 and 2
    And  I run createWorkspace method with token 123 and Workspace is created
    When I run createWorkspace method again with same token
    Then I receive a new instance of Workspace

#2
Scenario: Call services method returns a map of promises to each service loaded in Workspace
    Given WorkspaceFactory instance with createWorkspace method
    And   Configuration for token 123 that includes service A and B and components 1 and 2
    And   Service A and service B include a bootstrap that calls registerService
    And   the bootstrap includes CAPSULAHUB_WORKSPACE and CAPSULAHUB_CONFIGURATION variable
    When  I run createWorkspace method with token 123 and Workspace is created
    And   I call services method
    Then  I expect to receive a map of promises to service A and B having the following <property>s
          |<property> |
          |serviceName|
          |proxy      |
    And   each of the promises is resolved with corresponding service

#2.1
  Scenario: Call services method when no path is provided (the service with no path has not been registered)
    Given WorkspaceFactory instance with createWorkspace method
    And   Configuration for token 123 that includes service A and B and components 1 and 2
    And   No path is provided for service A
    And   A path is provided for service B
    And   Service B includes a bootstrap that calls registerService for service B
    And   the bootstrap includes CAPSULAHUB_WORKSPACE and CAPSULAHUB_CONFIGURATION variable
    When  I run createWorkspace method with token 123 and Workspace is created
    And   I call services method
    Then  I expect to receive a map of promises to service A and B having the following <property>
          |<property> |
          |serviceName|
          |proxy      |
    And   Service B promise is resolved with service B
    And   Service A promise stays in pending state

#2.2
 Scenario: Call services method when no path is provided (a service with no path is registered by another service)
    Given WorkspaceFactory instance with createWorkspace method
    And   Configuration for token 123 that includes service A and B and components 1 and 2
    And   no path is provided for service A
    And   there is a path provided for service B
    And   Service B includes a bootstrap that calls registerService for both service A and B
    And   the bootstrap includes CAPSULAHUB_WORKSPACE and CAPSULAHUB_CONFIGURATION variable
    When  I run createWorkspace method with token 123 and Workspace is created
    And   I call services method
    Then  I expect to receive a map of promises to service A and B having the following <property>
          |<property> |
          |serviceName|
          |proxy      |
    And   each of the promises is resolved with corresponding service

#3
Scenario: Call components method returns a map of promises to each component loaded in Workspace
    Given WorkspaceFactory instance with createWorkspace method
    And   Configuration for token 123 that includes service A and B and components 1 and 2
    When  I run createWorkspace method with token 123 and Workspace is created
    And   I call workspace components method
    Then  I expect to receive a map of promises to component 1 and 2 with the following <property>s
          |<property>   |
          |componentName|
          |nodeId       |
          |reference    |

#4
Scenario: Workspace is created with the correct configProvider
    Given WorkspaceFactory instance with createWorkspace method
    And  Configuration for token 123 that includes service A and B and components 1 and 2
    And  Service A and service B include a bootstrap that calls registerService
    When I run createWorkspace method with token 123 and with one of the following values for <configProvider>
          |<configProvider>   |
          | httpServer        |
          | scalecube         |
          | httpFile          |
          | localFile         |
          | localStorage      |
    Then I expect workspace to be created with the correct <configProvider>

#4.1
Scenario: Call createWorkspace without providing configProvider should create workspace with default type of configuration provider
    Given WorkspaceFactory instance with createWorkspace method
    And  Configuration for token 123 that includes service A and B and components 1 and 2
    And  Service A and service B include a bootstrap that calls registerService
    And  "httpFile" is a default type of configuration provider
    When I run createWorkspace method with token 123 and without providing configProvider
    Then I expect workspace to be created with "httpFile" configuration provider

#5
Scenario: DispatcherUrl is applied correctly while the creation of ConfigurationService for scalecube configProvider
    Given WorkspaceFactory instance with createWorkspace method
    And  Configuration for token 123 that includes service A and B and components 1 and 2
    And  Service A and service B include a bootstrap that calls registerService
    When I run createWorkspace method with token 123, with "scalecube" configProvider and a valid dispatcherUrl
    Then I expect workspace to be created with "scalecube" configuration provider
    And  DispatcherUrl is applied correctly

#6
Scenario: Repository is applied correctly while the creation of Workspace
    Given WorkspaceFactory instance with createWorkspace method
    And  Configuration for token 123 that includes service A and B and components 1 and 2
    And  Service A and service B include a bootstrap that calls registerService
    When I run createWorkspace method with token 123 and a valid repository
    Then Workspace configuration has been taken from the correct repository

#7
Scenario: If no repository is provided while the creation of Workspace, default repository is applied
    Given WorkspaceFactory instance with createWorkspace method
    And  Configuration for token 123 that includes service A and B and components 1 and 2
    And  Service A and service B include a bootstrap that calls registerService
    And  Default repository is 'workspace'
    When I run createWorkspace method with token 123
    Then Workspace configuration has been taken from the default repository
#______________________________________NEGATIVE______________________________________

#1
Scenario: Call createWorkspace with a token with no configuration available is rejected with error
   Given WorkspaceFactory instance with createWorkspace method
   And   A token 123 which has no configuration available
   When  I call createWorkspace method with token 123
   Then  I expect to receive an error

#1.1
Scenario: Call createWorkspace with a token with invalid configuration is rejected with error
   Given WorkspaceFactory instance with createWorkspace method
   And   A token 123 which has a configuration with wrong format
   When  I call createWorkspace method with token 123
   Then  I expect to receive an error

#1.2
Scenario: Call createWorkspace with a token with invalid format is rejected with error
   Given WorkspaceFactory instance with createWorkspace method
   When  I call createWorkspace with invalid <token> values
         |<token>   |
         |' '       |
         |{}        |
         |{ test: 'test' }|
         |[]        |
         |['test']  |
         |null      |
         |undefined |
         |true      |
         |false     |
         |0         |
         |-1        |
    Then  I expect to receive an error

#2
Scenario: An error with importing a service occurs after calling createWorkspace
    Given WorkspaceFactory instance with createWorkspace method
    And  Configuration for token 123 that includes service A and B and components 1 and 2
    And  Service A and service B include a bootstrap that calls registerService
    When I run createWorkspace method with token 123
    And  an error with importing service A occurs
    Then I expect workspace to be created
    And  a console error that importing of service A failed is displayed
    And  calling services method I expect service B promise to be resolved with service B and pending promise for service A

#2.1
Scenario: An error with importing a component occurs after calling createWorkspace
    Given WorkspaceFactory instance with createWorkspace method
    And  Configuration for token 123 that includes service A and B and components 1 and 2
    When I run createWorkspace method with token 123
    And  An error with importing component 2 occurs
    Then I expect workspace to be created
    And  a console error that importing of component 2 failed is displayed
    And  calling components method I expect component 1 promise to be resolved and pending promise for component 2

#3
Scenario: An error with bootstrapping a service occurs after calling createWorkspace (error in promise)
    Given WorkspaceFactory instance with createWorkspace method
    And  Configuration for token 123 that includes service A and B and components 1 and 2
    And  Service A and service B include a bootstrap that calls registerService
    When I run createWorkspace method with token 123
    And  An error with bootstrapping service B occurs in promise
    Then I expect workspace to be created
    And  a console error that bootstrapping of service B failed is displayed
    And  calling services method I expect service A promise to be resolved with service A and pending promise for service B

#3.1
Scenario: An error with bootstrapping a service occurs after calling createWorkspace (error outside of promise)
    Given WorkspaceFactory instance with createWorkspace method
    And  Configuration for token 123 that includes service A and B and components 1 and 2
    And  Service A and service B include a bootstrap that calls registerService
    When I run createWorkspace method with token 123
    And  An error with bootstrapping service B occurs outside of the promise
    Then I expect workspace to be created
    And  a console error that bootstrapping of service B failed is displayed
    And  calling services method I expect service A promise to be resolved with service A and pending promise for service B

#3.2
Scenario: An error with bootstrapping a component occurs after calling createWorkspace (error in promise)
    Given WorkspaceFactory instance with createWorkspace method
    And  Configuration for token 123 that includes service A and B and components 1 and 2
    When I run createWorkspace method with token 123
    And  An error with bootstrapping a component 2 occurs in the promise
    Then I expect workspace to be created
    And  a console error that bootstrapping of component 2 failed is displayed
    And  calling components method I expect component 1 promise to be resolved and pending promise for component 2

#3.3
Scenario: An error with bootstrapping a component occurs after calling createWorkspace (error outside of promise)
    Given WorkspaceFactory instance with createWorkspace method
    And  Configuration for token 123 that includes service A and B and components 1 and 2
    When I run createWorkspace method with token 123
    And  An error with bootstrapping a component 2 occurs outside of the promise
    Then I expect workspace to be created
    And  a console error that bootstrapping of component 2 failed is displayed
    And  calling components method I expect component 1 promise to be resolved and pending promise for component 2

#4
Scenario: An error with registering a component occurs after calling createWorkspace
    Given WorkspaceFactory instance with createWorkspace method
    And  Configuration for token 123 that includes service A and B and components 1 and 2
    When I run createWorkspace method with token 123
    And  An error with registering a component 1 occurs
    Then I expect workspace to be created
    And  a console error that registering of component 1 failed is displayed
    And  calling components method I expect component 2 promise to be resolved and pending promise for component 1
#4.1
Scenario: Call registerService method with a service already registered is rejected with error
    Given WorkspaceFactory instance with createWorkspace method
    And   Configuration for token 123 that includes service A and B and components 1 and 2
    And   Service A and service B include a bootstrap that calls registerService
    And   I run createWorkspace with token 123 and Workspace is created
    When  I call registerService method with service A that was registered
    Then  I expect to receive an error

#4.2
Scenario: Call registerService method with an invalid serviceName is rejected with error
    Given WorkspaceFactory instance with createWorkspace method
    And   Configuration for token 123 that includes service A and B and components 1 and 2
    And   Service A and service B includes a bootstrap that call registerService
    When  I run createWorkspace with token 123 and Workspace is created
    And   I call workspace registerService method with invalid values for <serviceName> and valid displayName
          |<serviceName> |
          |''        |
          |{}        |
          |{ test: 'test' }|
          |[]        |
          |['test']  |
          |null      |
          |undefined |
          |true      |
          |false     |
          |0         |
          |-1        |
    Then  I expect to receive an error

#4.3
Scenario: Call registerService method with a service that doesnt's exist in configuration is rejected with error
    Given WorkspaceFactory instance with createWorkspace method
    And   Configuration for token 123 that includes service A and B and components 1 and 2
    And   Service A and service B include a bootstrap that calls registerService
    When  I run createWorkspace with token 123 and Workspace is created
    And   I call registerService method with service C
    Then  I expect to receive an error

#4.4
Scenario: Call registerService method with invalid reference rejects servicePromise in ServicesMap
    Given WorkspaceFactory instance with createWorkspace method
    And   Configuration for token 123 that includes service A and B and components 1 and 2
    And   Service A and service B include a bootstrap that calls registerService
    When  I run createWorkspace with token 123 and Workspace is created
    And   I call services method
    And   I call workspace registerService method with invalid reference
    Then  I expect servicePromise to be rejected with an error

#4.5
Scenario: If scalecube error happens while registering a service, the promise for this service should be rejected with an error
    Given WorkspaceFactory instance with createWorkspace method
    And  Configuration for token 123 that includes service A, B and D and components 1 and 2
    When I run createWorkspace method with token 123
    And  A scalecube error occurs while registering service D
    And  I try to get the data from the promise from service D
    Then I expect to receive an error with the name of the corresponding service

#5
Scenario: Call createWorkspace with providing non-existing configProvider is rejected with error
    Given WorkspaceFactory instance with createWorkspace method
    And  Configuration for token 123 that includes service A and B and components 1 and 2
    And  Service A and service B include a bootstrap that calls registerService
    And  Following types of configuration provider are available
          |<configProvider>   |
          | httpServer        |
          | scalecube         |
          | httpFile          |
          | localFile         |
          | localStorage      |
    When I run createWorkspace method with token 123 and with non-existing <configProvider>
    Then I expect to receive an error

#5.1
Scenario: Call createWorkspace with an invalid configProvider is rejected with error
    Given WorkspaceFactory instance with createWorkspace method
    And  Configuration for token 123 that includes service A and B and components 1 and 2
    And  Service A and service B include a bootstrap that calls registerService
    When I run createWorkspace method with token 123 with invalid values for <configProvider>
        |<configProvider> |
        |''        |
        |{}        |
        |{ test: 'test' }|
        |[]        |
        |['test']  |
        |null      |
        |true      |
        |false     |
        |0         |
        |-1        |
    Then I expect to receive an error

#6
Scenario: Call createWorkspace for "scalecube" configProvider with a dispatcherUrl with invalid format is rejected with error
    Given WorkspaceFactory instance with createWorkspace method
    And  Configuration for token 123 that includes service A and B and components 1 and 2
    And  Service A and service B include a bootstrap that calls registerService
    When I run createWorkspace method with token 123, with "scalecube" configProvider and invalid values for <dispatcherUrl>
        |<dispatcherUrl> |
        |''        |
        |{}        |
        |{ test: 'test' }|
        |[]        |
        |['test']  |
        |null      |
        |true      |
        |false     |
        |0         |
        |-1        |
    Then I expect to receive an error

#7
Scenario: Call createWorkspace with invalid "repository" is rejected with error
    Given WorkspaceFactory instance with createWorkspace method
    And  Configuration for token 123 that includes service A and B and components 1 and 2
    And  Service A and service B include a bootstrap that calls registerService
    When I run createWorkspace method with token 123 and invalid values for <repository>
        |<repository> |
        |''        |
        |{}        |
        |{ test: 'test' }|
        |[]        |
        |['test']  |
        |null      |
        |true      |
        |false     |
        |0         |
        |-1        |
    Then I expect to receive an error
