Scenario: Page is loaded and includes all containers
Given application layout with webComponent
When  I run the application
Then  the page is loaded
And   there are displayed containers for envSelection, catalog, requestForm, logger and documentation
