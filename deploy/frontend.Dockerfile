FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Public configuration and rewrites must be correct during next build.
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_NOINDEX=false
ENV NEXT_TELEMETRY_DISABLED=1 \
    DOCKER_BUILD=1 \
    API_PROXY_URL=http://backend:8000 \
    NEXT_PUBLIC_API_URL=/api/v1 \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_NOINDEX=$NEXT_PUBLIC_NOINDEX
RUN test -n "$NEXT_PUBLIC_SITE_URL" && npm run build
RUN npm prune --omit=dev

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 DOCKER_BUILD=0
COPY --from=build --chown=node:node /app/package*.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/.next ./.next
COPY --from=build --chown=node:node /app/public ./public
USER node
EXPOSE 3000
CMD ["node", "node_modules/next/dist/bin/next", "start", "--hostname", "0.0.0.0", "--port", "3000"]
