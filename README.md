# node-express-backend-component

- [vite-node](https://github.com/vitest-dev/vitest/tree/main/packages/vite-node)
- [esbuild](https://esbuild.github.io/)
- [eslint](https://eslint.org/)
- [prettier](https://prettier.io/)
- [typescript](https://www.typescriptlang.org/)
- [vitest](https://vitest.dev/)

A few things to understand

1. building with esbuild
2. building with the typescript compiler

Importing the package.json makes the tsc compiler bundle the /src folder into the /dist folder. To keep these two build options working together esbuild is configured to nest the output in /src folder too.

Have a play around with the configuration and build options to suit the project.

This is a work in progress template and welcome to feedback.

## Requirements

This project requires node.js to be installed. This project uses volta to manage node versions.

To install volta run the following command in the terminal.

```
curl https://get.volta.sh | bash
```

### ESM Node

https://www.typescriptlang.org/docs/handbook/esm-node.html

### Install

Build and install the package globally so you have access in your cli terminal.

1. build `npm run build:es`
2. install `npm install -g .`

Then test the package is working and installed by calling the package name `pkg-name` in your terminal.

### Testing

This project uses [vitest](https://vitest.dev/) for testing.

1. run the unit tests with `npm run test`

It's also recommended to install the [vitest extension for vscode](https://marketplace.visualstudio.com/items?itemName=ZixuanChen.vitest-explorer).
