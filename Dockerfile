FROM oven/bun AS base
WORKDIR /app

FROM base AS install
WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

FROM oven/bun AS build
WORKDIR /app

COPY --from=install /app/node_modules ./node_modules
COPY . .

RUN bun run build

ENV NODE_ENV=production

EXPOSE 3000

ENTRYPOINT [ "bun", "run", "start" ]