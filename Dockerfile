# ============================================================
# Stage 1: DEPS — Install dependencies only (maximizes cache)
# ============================================================
FROM node:22-alpine AS deps

WORKDIR /app

# Copy only package manifests first for optimal layer caching
COPY package.json package-lock.json ./

# Install production + dev dependencies (needed for build)
# Use ci for deterministic installs from lockfile
RUN npm ci --ignore-scripts

# ============================================================
# Stage 2: BUILDER — Build the production bundle
# ============================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy cached node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code and config files
COPY package.json tsconfig.json vite.config.ts index.html ./
COPY index.tsx ./
COPY App.tsx ./
COPY types.ts constants.ts ./
COPY components/ ./components/
COPY hooks/ ./hooks/
COPY services/ ./services/
COPY public/ ./public/

# Build-time environment variables (injected via --build-arg)
ARG VITE_GEMINI_API_KEY=""
ARG VITE_API_URL=""

ENV VITE_GEMINI_API_KEY=${VITE_GEMINI_API_KEY}
ENV VITE_API_URL=${VITE_API_URL}

# Build the production bundle
RUN npm run build

# ============================================================
# Stage 3: RUNNER — Serve with Nginx (minimal image ~40MB)
# ============================================================
FROM nginx:1.27-alpine AS runner

# Labels for image metadata
LABEL maintainer="riwi"
LABEL description="DevLabs M1-S1 - Moodle Integration Frontend"
LABEL version="1.0.0"
LABEL domain="devlabs-m1-s1.riwi.io"

# Remove default Nginx static assets and config
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf

# Custom Nginx config for SPA routing + security headers
COPY <<'EOF' /etc/nginx/conf.d/default.conf
server {
    listen 80;
    listen [::]:80;
    server_name devlabs-m1-s1.riwi.io;

    root /usr/share/nginx/html;
    index index.html;

    # ── Security Headers ──
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # ── Gzip Compression ──
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_types
        text/plain
        text/css
        text/javascript
        application/javascript
        application/json
        application/xml
        image/svg+xml;

    # ── Static Assets with aggressive caching ──
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # ── SPA Fallback: serve index.html for all routes ──
    location / {
        try_files $uri $uri/ /index.html;
    }

    # ── Health check endpoint ──
    location /healthz {
        access_log off;
        return 200 'ok';
        add_header Content-Type text/plain;
    }
}
EOF

# Copy built static files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create non-root user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup && \
    # Nginx needs write access to certain directories
    chown -R appuser:appgroup /var/cache/nginx /var/log/nginx /var/run && \
    # Create pid file directory
    touch /var/run/nginx.pid && \
    chown appuser:appgroup /var/run/nginx.pid

# Switch to non-root user
USER appuser

# Expose only the necessary port
EXPOSE 80

# Production environment
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:80/healthz || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
