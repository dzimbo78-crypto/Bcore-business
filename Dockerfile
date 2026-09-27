FROM node:22-slim
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json tsconfig.base.json ./
COPY artifacts ./artifacts
COPY lib ./lib
RUN pnpm install --frozen-lockfile
ENV BASE_PATH=/
RUN pnpm run build:deploy
ENV PORT=10000
EXPOSE 10000
CMD ["pnpm", "start"]
