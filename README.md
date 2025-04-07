## Running and configuring the app

App is distributed as a docker image. Here you can find information about the [package](https://github.com/blockscout/frontend/pkgs/container/frontend) and its recent [releases](https://github.com/blockscout/frontend/releases).

You can configure your app by passing necessary environment variables when starting the container. See full list of ENVs and their description [here](./docs/ENVS.md).

```sh
docker run -p 3000:3000 --env-file <path-to-your-env-file> ghcr.io/blockscout/frontend:latest
```

Alternatively, you can build your own docker image and run your app from that. Please follow this [guide](./docs/CUSTOM_BUILD.md).

For more information on migrating from the previous frontend, please see the [frontend migration docs](https://docs.blockscout.com/for-developers/frontend-migration).
