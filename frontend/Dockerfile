FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV DOCKER_BUILD=1
ENV NEXT_PUBLIC_SITE_URL=http://localhost:13000
ENV API_PROXY_URL=http://backend:8000

RUN npm run build

EXPOSE 3000

CMD ["npx", "next", "start", "-p", "3000"]
