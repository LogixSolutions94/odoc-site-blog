FROM oven/bun:1.3-alpine AS builder
WORKDIR /app
# bun.lock est l'unique source de vérité (cf. CLAUDE.md, on bosse en bun en local).
# package-lock.json est obsolète depuis le lot E (bun update). On l'ignore.
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
