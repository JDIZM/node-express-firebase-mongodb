# use a slimmer alpine image to consume less memory
# https://viralganatra.com/docker-nodejs-production-secure-best-practices/
FROM node:20-alpine AS base

ENV PNPM_VERSION=9.4.0

RUN npm install -g pnpm@$PNPM_VERSION

WORKDIR /app

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

# required for gcloud; will require a service account key to be copied to the path location
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/gcloud.json

# install deps first so we can cache them
COPY package*.json pnpm-lock.yaml ./
COPY prisma ./prisma/
RUN pnpm install --frozen-lockfile
RUN npx prisma generate

FROM base AS builder

WORKDIR /app

COPY . .

RUN mkdir dist

RUN pnpm build

FROM base AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 express
RUN adduser --system --uid 1001 express

COPY --from=builder --chown=express:express /app/prisma /app/prisma
COPY --from=builder --chown=express:express /app/node_modules /app/node_modules
COPY --from=builder --chown=express:express /app/dist /app/dist
COPY --from=builder --chown=express:express /app/package.json /app/package.json

USER express

EXPOSE 4000

# --- Development ---

FROM runner AS dev

WORKDIR /app

COPY --from=builder --chown=express:express /app/.env /app/.env

CMD ["node", "./dist/server.cjs"]

# --- Production ---

FROM runner AS prod

WORKDIR /app

CMD ["node", "./dist/server.cjs"]
