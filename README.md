# Capsulahub

An awesome toolkit to develop and test your micro-frontend services!

## Packages

The list of all the packages that are included in the repository.

### Core

Core packages, that are used for the internal implementation of Capsulahub.

| Package name                    | Description                                                                                                                                                    |
|---------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [workspace](packages/workspace) | The core package of Capsulahub. Includes the implementation of Workspace, that inits the application and keeps track of service and widgets extensions.        |

### CLI

The packages, that implement an ability to run Capsulahub from CLI (from a terminal).

| Package name          | Description                                                                                                                                                    |
|-----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| cli                   | The package, that provides an ability to use CLI to run and build Capsulahub application.                                                                                                                                 |

### Service extensions

The packages, that provide service extensions for Workspace (they should be included in **services**) prop in **Workspace** configuration.

These extensions add some logic to an application, don't have a UI representation and have to register itself in **Workspace**, if they want to be available later within **Workspace**.

| Package name                                            | Description                                                                                                                                                    |
|---------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [service-renderer](packages/service-renderer)           | Service extension, that renders all the web-components, that are registered in Workspace.                                                                      |
| [service-configuration](packages/service-configuration) | Service extension, that providers an ability to use ConfigurationService, that you can use for managing different configurations across your projects.         |
| service-env-registry                                    | Service extension, that providers an ability to use EnvironmentRegistry, that allows to register and load different versions of a project/service environment. |
| [service-selector](packages/service-selector)           | Service extension, that allows a user to select a specific item inside a collection of data.                                                                   |

### Widget extensions

The packages, that provide component extensions for Workspace (they should be included in **components**) prop in **Workspace** configuration (can be **layout**, that will be mounted firstly, or **items**, that will be loaded after the layout).

These extensions have UI representation and can be connected to the data within **setProps** method.

| Package name                                          | Description                                                                                                                                                    |
|-------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [widget-canvas](packages/widget-canvas)               | Widget layout extension, that provides the canvas web-component, where all the other elements can be flexibly situated.                                        |
| widget-env-selection                                  | Widget item extension, that provides a web-component with the list of environments and an ability to select an env and connect/disconnect.                     |
| [widget-logger](packages/widget-logger)               | Widget item extension, that provides a web-component with the logs of all the events, that happen in the application.                                          |
| widget-modal                                          | Widget item extension, that provides a web-component with the modal, that can include any given content.                                                       |
| widget-request-form                                   | Widget item extension, that provides a web-component with an editor, that allows to create JS or JSON code snippets.                                           |
| widget-table                                          | Widget item extension, that provides a web-component with a table of data.                                                                                     |

### Helper packages

Additional packages, that provide useful common utilities.

| Package name                            | Description                                                                                                                                                    |
|-----------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [ui](packages/ui)                       | Common reusable ui components.                                                                                                                                 |
| [utils](packages/utils)                 | Common reusable helpers, consts, types.                                                                                                                        |
| [cdn-emulator](packages/cdn-emulator)   | Util package, that includes separate files, that will be served on localhost to imitate cdn links.                                                             |
