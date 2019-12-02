# CDN-Emulator

Allows to serve services, widgets, configuration for Workspace on <http://localhost:3000/> to imitate CDN functionality.

## Usage

This package is used in [workspace](../workspace) package in order to imitate cdn for configuration and extensions, that
will be loaded dynamically while the creation of **Workspace**.

You can put a new extension in [./src](src) folder in an appropriate folder (widgets or services) and register it
in [Workspace configuration](webpack.config.js).

Configuration can be changed in [./src/configurations/workspace.json](webpack.config.js), but the name of the file should stay the same.

In order to build extensions and serve them on localhost you should run

    yarn start

## Licence

[CapsulaHub](https://github.com/capsulajs/capsulahub) and related services are released under MIT Licence.

## [Back to the Main Page](../../README.md)
