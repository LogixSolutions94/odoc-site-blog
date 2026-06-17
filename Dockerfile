FROM oven/bun:1.3-alpine AS builder
WORKDIR /app

# Public Vite env vars (VITE_* est compilé dans le bundle → publiquement
# observable côté client par design). .env est exclu du contexte Docker
# (cf. .dockerignore, audit sécu 16/06) → on injecte ces valeurs publiques
# explicitement comme ARG. Sans ça, `createClient(undefined, undefined)`
# explose au chargement du module et toute page touchant @supabase devient
# un écran noir (post-mortem 17/06).
ARG VITE_SUPABASE_URL="https://api.odocpilot.com"
ARG VITE_SUPABASE_PROJECT_ID="zcc44owwgoc48c0w8k8kgocs"
ARG VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzgwNTMyMDQ2LCJleHAiOjQ5MTk3MDA0ODB9.TA4krWhaC4us2hA8Dz-GLUxUuxZ-IPKo92P24X6_9_E"
ARG VITE_APP_URL="https://app.odocpilot.com"
ARG VITE_UMAMI_SRC="https://analytics.odocpilot.com/script.js"
ARG VITE_UMAMI_WEBSITE_ID="8d6ac049-8bbb-452a-a55f-d1ac8a838c76"
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_PROJECT_ID=$VITE_SUPABASE_PROJECT_ID \
    VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY \
    VITE_APP_URL=$VITE_APP_URL \
    VITE_UMAMI_SRC=$VITE_UMAMI_SRC \
    VITE_UMAMI_WEBSITE_ID=$VITE_UMAMI_WEBSITE_ID

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
