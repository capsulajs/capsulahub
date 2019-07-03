
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
    And  An error with importing a service occurs
    Then I expect to receive an error

#2.1
Scenario: An error with importing a component occurs after calling createWorkspace
    Given WorkspaceFactory instance with createWorkspace method
    And  Configuration for token 123 that includes service A and B and components 1 and 2
    When I run createWorkspace method with token 123
    And  An error with importing a component occurs
    Then I expect to receive an error

#3
Scenario: An error with bootstrapping a service occurs after calling createWorkspace
    Given WorkspaceFactory instance with createWorkspace method
    And  Configuration for token 123 that includes service A and B and components 1 and 2
    And  Service A and service B include a bootstrap that calls registerService
    When I run createWorkspace method with token 123
    And  An error with bootstrapping a service occurs
    Then I expect to receive an error with the name of the corresponding service

#3.1
Scenario: An error with bootstrapping a component occurs after calling createWorkspace
    Given WorkspaceFactory instance with createWorkspace method
    And  Configuration for token 123 that includes service A and B and components 1 and 2
    When I run createWorkspace method with token 123
    And  An error with bootstrapping a component occurs
    Then I expect to receive an error with the name of the corresponding component

#4
Scenario: An error with registering a component occurs after calling createWorkspace
    Given WorkspaceFactory instance with createWorkspace method
    And  Configuration for token 123 that includes service A and B and components 1 and 2
    When I run createWorkspace method with token 123
    And  An error with registering a component occurs
    Then I expect to receive an error

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