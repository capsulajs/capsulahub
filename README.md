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
| [cli](packages/cli)   | The package, that provides an ability to use CLI to run and build Capsulahub application.                                                                                                                                 |

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
| [widget-modal](packages/widget-modal)                 | Widget item extension, that provides a web-component with the modal, that can include any given content.                                                       |
| [widget-request-form](packages/widget-request-form)   | Widget item extension, that provides a web-component with an editor, that allows to create JS or JSON code snippets.                                           |
| [widget-table](packages/widget-table)                 | Widget item extension, that provides a web-component with a table of data.                                                                                     |

### Helper packages

Additional packages, that provide useful common utilities.

| Package name                            | Description                                                                                                                                                    |
|-----------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [ui](packages/ui)                       | Common reusable ui components.                                                                                                                                 |
| [utils](packages/utils)                 | Common reusable helpers, consts, types.                                                                                                                        |
| [cdn-emulator](packages/cdn-emulator)   | Util package, that includes separate files, that will be served on localhost to imitate cdn links.                                                             |

## CI/CD

The CI/CD will perform: 
* deployment on [S3 Bucket](https://capsulajs.s3.amazonaws.com/) 
* publishing on [npm registry](https://www.npmjs.com/org/capsulajs)

### Deploy
In order to deploy to S3, you need to add this npm script to the `package.json`

    "deploy": "SERVICE=$(echo $npm_package_name | cut -d '/' -f 2) && ../../scripts/deploy.sh -s $SERVICE"
It will deploy all the content from `dist/` folder which is built during the CI.  
If you want to add some specific directories in it (`doc/`, `configuration/`, `example/`, ...), 
you can add those npm scripts to the `package.json`

    "build:dist": "<your command> && yarn dist:configuration && yarn dist:doc && yarn dist:example",
    "dist:configuration": "cpy --parents configuration/ dist/",
    "dist:doc": "cpy --parents doc/ dist/",
    "dist:example": "cpy --parents example/ dist/"

#### Publish
The npm publishing will be performed automatically during the CI/CD process.  
However, you need to **manually publish it for the first time**.  
If you don't, you will get this error: `lerna ERR! E402 You must sign up for private packages` 
because of the scoped package name.

This script will create a new package version each time, according to the CI CD built branch:
* on PR, it will publish a `snapshot` version `x.x.x-<branch_name>.<timestamp>`
* on develop, it will publish a `next` version `x.x.x-beta`
* on master, it will publish a `latest` version `x.x.x` (only `patch` for now)

If you want, you can enable comments after publishing on npm by adding this npm script to your `package.json`

    "publish:comment": "bash ../../scripts/publish_comment.sh $(echo $npm_package_name)"
In this case, a bot will comment after publishing the package and will update this comment each time 
a new package is built for your PR.
