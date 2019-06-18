# Capsulahub
The main repository of CapsulaJS.

## Packages

The list of all the packages that are included in the repository.

### Core

Core packages, that are used for the internal implementation of Capsulahub.

1) workspace
2) rendered

### CLI

The packages, that implement an ability to run Capsulahub from CLI (from a terminal).

1) cli

### Service extensions

The packages, that provide service extensions for Workspace (they should be included in **services**) prop in **Workspace** configuration.

These extensions add some logic to an application, don't have a UI representation and have to register itself in **Workspace**, if they want to be available later within **Workspace**.

1) configuration-service
2) env-registry-service
3) selector-service

### Component extensions

The packages, that provide component extensions for Workspace (they should be included in **components**) prop in **Workspace** configuration (can be **layout**, that will be mounted firstly, or **items**, that will be loaded after the layout).

These extensions have UI representation and can be connected to the data within **setProps** method.

1) canvas-component
2) env-selection-component
3) logger-component
4) modal-component
5) request-form-component
6) table-component

### Helper packages

Additional packages, that provide useful common utilities.

1) ui
2) utils


