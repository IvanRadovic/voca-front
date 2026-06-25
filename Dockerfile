# syntax=docker/dockerfile:1.7
#
# BIP TECH frontend (Vite + React) - production Dockerfile.
# Pass VITE_API_URL as a build arg in Coolify ("Build args" section) so the
# correct API base URL is baked into the bundle; SPAs cannot read env at
# runtime.

FROM node:22-alpine AS builder
WORKDIR /app

# Build-time configuration. The default keeps `docker build` working without
# args; Coolify should override this for prod.
ARG VITE_API_URL=http://localhost:8000/api
ENV VITE_API_URL=${VITE_API_URL}

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --include=dev

COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS runtime

RUN apk add --no-cache curl && \
    addgroup -S app && adduser -S -G app app && \
    rm -rf /var/cache/apk/*

WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN chown -R app:app /usr/share/nginx/html /var/cache/nginx /var/run /var/log/nginx /etc/nginx/conf.d && \
    chmod -R 755 /usr/share/nginx/html

USER app
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --spider http://127.0.0.1:8080/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
