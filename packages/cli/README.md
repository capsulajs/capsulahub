[![Build Status](https://travis-ci.com/capsulajs/capsulahub.svg?branch=develop)](https://travis-ci.com/capsulajs/capsulahub)

# Capsula Hub

## Description

CapsulaHub is part of CapsulaJS project, it is one of CapsulaJS pillars but it can be used stand alone.
It is an CLI tool to help you to develop and test your micro-frontend services!

## Local development

```bash
# from the root
npm link packages/cli
cd packages/cli/node_modules
find . -maxdepth 1 -type d \! \( -name ".bin" -o -name ".cache" \) -exec rm -rf "{}" \;
# now you can use capsulahub binary anywhere in the repository
# for example:
capsulahub --help
capsulahub run --token=http://localhost:3000/configuration --configProvider=httpFile --port=8888
```

## Install

### NPM

```bash
npm install --save-dev @capsulajs/capsulahub-cli
```

### Yarn

```bash
yarn add -D @capsulajs/capsulahub-cli
```

## Usage

```shell
capsulahub --help
Usage: capsulahub [options] [command]

Options:
  -h, --help       output usage information

Commands:
  run [options]    Run a Capsulahub application locally in development mode
  build [options]  Build Capsulahub application files in a specific folder (ready to deploy)

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

capsulahub run --help
 Usage: run [options]
 
 Run a Capsulahub application locally in development mode
 
 Options:
   -t, --token <token>                    The token that will be used to get the configuration (required)
   -c, --configProvider <configProvider>  The type of configuration provider (optional - default is "httpFile"). Possible options: 'localFile', 'httpFile', 'scalecube', 'httpServer', 'localStorage'
   -p, --port <port>                      The port on which the application will run locally (for instance, http://localhost:55555/) (optional - default is "55555")
   -d, --dispatcherUrl <dispatcherUrl>    The url of the dispatcher for those providers that use dispatcher (optional)
   -h, --help                             output usage information

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

capsulahub build --help
    Usage: build [options]
    
    Build Capsulahub application files in a specific folder (ready to deploy)
    
    Options:
      -t, --token <token>                    The token that will be used to get the configuration (required)
      -c, --configProvider <configProvider>  The type of configuration provider (optional - default is "httpFile"). Possible options: 'localFile', 'httpFile', 'scalecube', 'httpServer', 'localStorage'
      -o, --output <output>                  Relative path to the output folder (optional - default is "./dist")
      -d, --dispatcherUrl <dispatcherUrl>    The url of the dispatcher for those providers that use dispatcher (optional)
      -h, --help                             output usage information
```

## Example

### HttpFile

Make sure, that you have httpServer running on the port 1111 and you have
a configuration file in `./configuration/workspace.json` (the path is relative to the root of your server).

In order to run the application locally run:

```bash
capsulahub run --token=http://localhost:1111/configuration --port=8888
```

If you want to generate a build with html and js file in it, you should run:

```bash
capsulahub build --token=http://localhost:1111/configuration
```

## Configuration

The configuration should be a `.json` file which
match this [API](https://github.com/capsulajs/capsulahub-core/blob/develop/packages/workspace/src/api/WorkspaceConfig.ts).

This file should be accessible following the `configProvider` that you choose to use 
([docs](https://github.com/capsulajs/capsulahub/tree/develop/packages/service-configuration)).  
The url to reach it is passed as the `token`.

Example: _config.json_

```json
{
  "name": "baseWorkspace",
  "services": [
    {
      "serviceName": "ServiceA",
      "path": "http://localhost:1111/services/serviceA.js",
      "definition": {
        "serviceName": "ServiceA",
        "methods": {
          "getMessage": { "asyncModel": "requestResponse" }
        }
      },
      "config": { "message": "Message from ServiceA from PORT 1111 HTTP File" }
    },
    {
      "serviceName": "ServiceFlows",
      "path": "http://localhost:1111/services/serviceFlows.js",
      "definition": {
        "serviceName": "ServiceFlows",
        "methods": {}
      },
      "config": {
        "componentName": "web-component-a"
      }
    },
    {
      "serviceName": "RendererService",
      "path": "https://capsulajs.s3.amazonaws.com/develop/capsulahub-service-renderer/index.js",
      "definition": {
        "serviceName": "RendererService",
        "methods": {
          "renderLayouts": { "asyncModel": "requestResponse" },
          "renderItems": { "asyncModel": "requestResponse" },
          "renderItem": { "asyncModel": "requestResponse" }
        }
      },
      "config": {}
    }
  ],
  "components": {
    "layouts": {
      "capsulahub-root": {
        "componentName": "web-grid",
        "path": "http://localhost:1111/widgets/Grid.js",
        "config": {
          "title": "Base Grid from PORT 1111 HTTP File",
          "innerComponentId": "web-component-a"
        }
      }
    },
    "items": {
      "web-component-a": {
        "componentName": "web-component-a",
        "path": "http://localhost:1111/widgets/ComponentA.js",
        "config": { "name": "ComponentA(PORT 1111 HTTP File)" }
      }
    }
  }
}
```

### Mount point

Please notice, that the first component, that is supposed to be mounted on the application, should
have the key **"capsulahub-root"** (as it is in configuration example).

<!-- To put back later for local dev
Run it locally
--------------
|        What to do    |   Command   |
|----------------------|-------------|
| To run the linter:   | `yarn lint` |
| To run the tests:    | `yarn test` |
| To generate the doc: | `yarn doc`  |


Development
-----------
- Clone the project then do `yarn` or `npm i`
- Create a `capsulahub.json` file at the root with the following structure:
    ```json
    {
      "token": "your_token"
    }
    ```
- Run `yarn start` or `npm run start`.
-->

## License

[CapsulaHub](https://github.com/capsulajs/capsula-hub) is released under [MIT License](./LICENSE).
