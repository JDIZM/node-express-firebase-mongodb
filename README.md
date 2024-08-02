# node-express-backend-component

- [tsx](https://github.com/esbuild-kit/tsx)
- [pkgroll](https://github.com/privatenumber/pkgroll)
- [eslint](https://eslint.org/)
- [prettier](https://prettier.io/)
- [typescript](https://www.typescriptlang.org/)
- [vitest](https://vitest.dev/)
- [prisma](https://www.prisma.io/)
- [mongodb](https://www.mongodb.com/)
- [zod](https://zod.dev/)
- [zod-prisma-types](https://github.com/chrishoermann/zod-prisma-types)
- [firebase auth](https://firebase.google.com/docs/auth/admin)
- [gcp](https://cloud.google.com/)
- [digitalocean](https://www.digitalocean.com/)

A simple node/express backend api template.

## Requirements

This project requires node.js to be installed. This project uses volta to manage node versions.

To install volta run the following command in the terminal.

```
curl https://get.volta.sh | bash
```

This will require a mongodb database to be setup. You can set one up at https://cloud.mongodb.com/

This project also uses firebase auth for authentication. You can set one up at https://firebase.google.com/ and deployment is handled with DigitalOcean. See the [Firebase Auth](#firebase-auth) section for more info on setting up your credentials and project.

## ESM Node

https://www.typescriptlang.org/docs/handbook/esm-node.html

This project has been setup to use ESM Node. This allows us to use ES6 imports in Node.

This uses [tsx](https://github.com/esbuild-kit/tsx) as a dev server and [pkgroll](https://github.com/privatenumber/pkgroll) to bundle and build the project.

Note: Prisma does not support ESM by default and [have an open issue](https://github.com/prisma/prisma/issues/5030) -- looking to migrate this to another ORM (drizzle) for ESM support.

"the Prisma client relies on globals like `__dirname` that used to be part of Node but in ESM have been moved to import.meta.dirname. See: https://stackoverflow.com/questions/46745014/alternative-for-dirname-in-node-js-when-using-es6-modules"

As a result of this it's best to stick to the `.cjs` format when running in production.

## Setup

```
# install dependencies
npm i

# start the dev server
npm run dev

# view it running on localhost
curl localhost:3000
```

Be sure to configure the .env file with the correct values and make sure you have a mongodb database setup and firebase application credentials.

## Testing

This project uses [vitest](https://vitest.dev/) for testing.

1. run the unit tests with `npm run test`

It's also recommended to install the [vitest extension for vscode](https://marketplace.visualstudio.com/items?itemName=ZixuanChen.vitest-explorer).

## Build with docker

### locally

The `GOOGLE_APPLICATION_CREDENTIALS` env variable is mapped to the docker container from your home directory. This is required for the firebase admin sdk to verify the token and decode the claims. see the [Firebase Auth](#firebase-auth) section for more info on the service account key file and Google Application Credentials.

```
docker compose up -d
```

### production

```
# build the app
npm run build

# build with docker
docker build . --tag node-express

# or to build with a specific platform
docker build . --tag node-express --platform linux/amd64

# start the docker container
docker run -d -p 3000:3000 node-express

# view it running on localhost
curl localhost:3000
```

When building with Docker locally it will require the service account key to be set; this is because the Dockerfile is copying the service account key file into the image. See the [Firebase Auth](#firebase-auth) section for more info on the service account key file and Google Application Credentials.

## Database

This is setup to use MongoDB with Prisma. If you want to use a different database you can change the db provider in Prisma schema and use a different Database.

Note: when using Prisma the MongoDB database connector uses transactions to support nested writes. Transactions require a replica set deployment. The easiest way to deploy a replica set is with Atlas. It's free to get started.

https://www.prisma.io/docs/concepts/database-connectors/mongodb

### env

create a .env file in the root of the project and copy the contents of .env.example into it.

You can replace `DATABASE_URL` with your mongodb connection string whether that be cloud or locally hosted.

### seed the db

run the seed script to seed the db the first time.

```bash
npx prisma db seed
```

### updating db schema

```
# after updating the model you want to generate the schema
npx prisma generate
```

## Import aliases

Aliases can be configured in the import map, defined in package.json#imports.

see: https://github.com/privatenumber/pkgroll#aliases

## Authentication

This project uses JWT bearer token for authentication. The claims, id and sub must be set on the token and the token can be verified and decoded using the configured auth provider.

You can sign in an retrieve user tokens without having to use the client sdk.

See the [Firebase REST API docs for more info on how to sign in with email and password.](https://firebase.google.com/docs/reference/rest/auth#section-sign-in-email-password)

Sign in with email and password is supported out of the box with Firebase Auth.

```js
# sign in with email and password by posting
https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

# refresh token
https://securetoken.googleapis.com/v1/token?key=[API_KEY]
```

## Permissions

How permissions work.

A resource will have a permission level. A user will have a role/claim.

Routes will have their permission level defined in `./src/helpers/permissions.ts`

When a user makes a request to a route the route will check the user's role/claim against the permission level of the resource.

Permissions for the user can be set using the /auth/set-permissions endpoint which sets the database userId and claims on the firebase user. The token will have access to this data to verify the user's permissions.

### Route permission levels

1. Owner - Route can only be accessed by the owner of the resource. Defined by the id of the resource being accessed matching the id of the user making the request.
2. User - Can access all resources with user permissions.
3. Admin - Can access all resources.

### Claims

A claim is defined when the user is created which defines the user's role and permissions level.

1. User - default user permissions
2. Admin - admin permissions

## Firebase Auth

This project uses Firebase Auth for authentication. The firebase admin sdk is used to verify the token and decode the claims.

Because we are not running in a google environment we need to initialize the firebase admin sdk with a service account key file. see the [Firebase Admin SDK docs](https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments) for more info.

This requires a service account key file at `$HOME/gcloud.json`. The `GOOGLE_APPLICATION_CREDENTIALS` env variable must be set to the path of the service account key file.

You can create a service account from the firebase console and place in your home directory and set the environment variable like so:

```
export GOOGLE_APPLICATION_CREDENTIALS=$HOME/gcloud.json
```

You can also set this in the `.env` file but if you have set the env variable in your shell it will take precedence.

When running in CI/CD the service account key file is stored as a secret and the env variable is set in the Dockerfile using the copied service account key file fron secrets.

## Deployment with DigitalOcean

A docker image can be built and deployed to a [container registry](https://docs.digitalocean.com/products/container-registry/getting-started/quickstart/). We can configure DigitalOcean to deploy the image once the registry updates using their [App Platform](https://docs.digitalocean.com/products/app-platform/)

The following secrets will need to be added to Github Actions for a successful deployment to DigitalOcean.

- `DIGITALOCEAN_ACCESS_TOKEN` https://docs.digitalocean.com/reference/api/create-personal-access-token/
- `REGISTRY_NAME` eg registry.digitalocean.com/my-container-registry
- `SERVICE_ACCOUNT_DEV` The GOOGLE_APPLICATION_CREDENTIALS Service Account file for development env.
- `SERVICE_ACCOUNT_PROD` The GOOGLE_APPLICATION_CREDENTIALS Service Account file for production env.
- `IMAGE_NAME_DEV` the name of the DEV image we are pushing to the repository eg `express-api` it will be tagged with the latest version and a github sha.
- `IMAGE_NAME_PROD` the name of the PROD image we are pushing to the repository eg `express-api` it will be tagged with the latest version and a github sha.
