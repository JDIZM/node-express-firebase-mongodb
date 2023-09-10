# node-express-backend-component

- [tsx](https://github.com/esbuild-kit/tsx)
- [pkgroll](https://github.com/privatenumber/pkgroll)
- [esbuild](https://esbuild.github.io/)
- [eslint](https://eslint.org/)
- [prettier](https://prettier.io/)
- [typescript](https://www.typescriptlang.org/)
- [vitest](https://vitest.dev/)

A simple node/express backend api template.

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

1. build `npm run build`
2. install `npm run dev`

Then test the package is working and installed by calling the package name `pkg-name` in your terminal.

### Testing

This project uses [vitest](https://vitest.dev/) for testing.

1. run the unit tests with `npm run test`

It's also recommended to install the [vitest extension for vscode](https://marketplace.visualstudio.com/items?itemName=ZixuanChen.vitest-explorer).

### Build with docker

```
# build the app
`npm run build`

# build with docker
`docker build . --tag node-express`

# start the docker container
`docker run -d -p 3000:3000 node-express`

# view it running on localhost
`curl localhost:3000`
```
