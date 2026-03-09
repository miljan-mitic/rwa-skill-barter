FROM node:20-slim AS base
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

FROM base AS build
RUN --mount=type=cache,target=/root/.npm npm ci
RUN rm -rf dist
RUN npm run build

FROM gcr.io/distroless/nodejs20-debian11

COPY --from=base /app/images /app/images
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
COPY --from=build /app/package.json /app/package.json

WORKDIR /app

ENV PORT=3000
EXPOSE 3000

CMD [ "dist/src/main.js"]