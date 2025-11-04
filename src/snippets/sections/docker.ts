import { RawSection } from "../../types/types";

const section: RawSection = {
  id: "docker",
  label: "Docker",
  identifier: "bash",
  snippets: [
    // ===== Docker CLI Basics =====
    {
      title: "Build image",
      description: "Build from a Dockerfile in current dir and tag it:",
      markdown: `docker build -t myapp:latest .`,
    },
    {
      title: "Run container (port + env)",
      description: "Publish a port and pass an env var:",
      markdown: `docker run --rm -it -p 8080:8080 -e NODE_ENV=production myapp:latest`,
    },
    {
      title: "List, stop, remove",
      description: "See containers/images and clean up:",
      markdown: `docker ps -a
docker images
docker stop <container>
docker rm <container>
docker rmi <image>`,
    },
    {
      title: "Logs, exec, copy",
      description: "Tail logs, open a shell, copy files:",
      markdown: `docker logs -f <container>
docker exec -it <container> sh
docker cp <container>:/app/logs ./logs`,
    },
    {
      title: "Prune",
      description: "Remove dangling images/containers/networks/volumes:",
      markdown: `docker system df
docker system prune -af --volumes`,
    },
    {
      title: "Tag + push to registry",
      description: "Tag for a registry and push:",
      markdown: `docker tag myapp:latest ghcr.io/owner/myapp:1.0.0
docker login ghcr.io
docker push ghcr.io/owner/myapp:1.0.0`,
    },
    {
      title: "Buildx multi-arch",
      description: "Build for Apple Silicon and x64:",
      markdown: `docker buildx create --use --name multi
docker buildx build --platform linux/amd64,linux/arm64 -t ghcr.io/owner/myapp:latest --push .`,
    },

    // ===== Dockerfiles =====
    {
      title: "Dockerfile (Node.js, multi-stage)",
      description: "Small prod image with dependency caching:",
      markdown: `# syntax=docker/dockerfile:1.6
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
USER node
COPY --from=build /app/dist ./dist
COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules
EXPOSE 8080
CMD ["node", "dist/server.js"]`,
    },
    {
      title: ".dockerignore",
      description: "Speed up builds and keep images small:",
      markdown: `node_modules
dist
.git
.gitignore
Dockerfile*
docker-compose*.yml
*.log
*.env
coverage
.cache`,
    },
    {
      title: "Dockerfile (Python, slim, non-root)",
      description: "Pinned deps + wheels cache, non-root user:",
      markdown: `# syntax=docker/dockerfile:1.6
FROM python:3.12-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app

# System deps (as needed)
RUN apt-get update && apt-get install -y --no-install-recommends build-essential \\
 && rm -rf /var/lib/apt/lists/*

# Cache deps
COPY requirements.txt .
RUN pip install --upgrade pip \\
 && pip wheel --no-cache-dir --no-deps -r requirements.txt -w /wheels

FROM python:3.12-slim
WORKDIR /app
RUN useradd -m appuser
COPY --from=base /wheels /wheels
RUN pip install --no-cache-dir /wheels/*

COPY . .
USER appuser
EXPOSE 8000
CMD ["python", "app.py"]`,
    },
    {
      title: "ENTRYPOINT vs CMD",
      description: "Combine fixed entrypoint with default args:",
      markdown: `# ENTRYPOINT is the executable, CMD are default args:
ENTRYPOINT ["python", "-m", "myapp"]
CMD ["--help"]  # docker run myimg -> runs with --help by default`,
    },
    {
      title: "Healthcheck (curl)",
      description: "Mark container unhealthy if endpoint fails:",
      markdown: `HEALTHCHECK --interval=10s --timeout=2s --retries=3 \\
  CMD curl -fsS http://localhost:8080/health || exit 1`,
    },

    // ===== Docker Compose v2 =====
    {
      title: "Compose up/down",
      description: "Start/stop services defined in compose file:",
      markdown: `docker compose up -d
docker compose ps
docker compose logs -f
docker compose down`,
    },
    {
      title: "Compose (web + Postgres)",
      identifier: "yaml",
      description: "App with DB, volumes, healthcheck, env:",
      markdown: `# docker-compose.yml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
      POSTGRES_DB: appdb
    volumes:
      - db_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d appdb"]
      interval: 5s
      timeout: 3s
      retries: 10

  web:
    build: .
    environment:
      DATABASE_URL: postgresql://app:app@db:5432/appdb
      PORT: "8080"
    ports:
      - "8080:8080"
    depends_on:
      db:
        condition: service_healthy

volumes:
  db_data: {}`,
    },
    {
      title: "Compose overrides",
      description: "Use an extra file for dev-only changes:",
      identifier: "yaml",
      markdown: `# docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# docker-compose.dev.yml
services:
  web:
    environment:
      NODE_ENV: development
    volumes:
      - ./:/app
    command: ["npm", "run", "dev"]`,
    },
    {
      title: "Compose profiles",
      identifier: "yaml",
      description: "Optionally start extra services (e.g., monitoring):",
      markdown: `# docker compose --profile monitor up -d

services:
  web:
    image: myapp:latest

  prometheus:
    image: prom/prometheus
    profiles: ["monitor"]`,
    },
    {
      title: "Named networks",
      description: "Communicate across multiple stacks safely:",
      identifier: "yaml",
      markdown: `# docker-compose.yml
networks:
  backend:
    driver: bridge

services:
  api:
    image: myorg/api
    networks: ["backend"]
  worker:
    image: myorg/worker
    networks: ["backend"]`,
    },

    // ===== Data & Backup =====
    {
      title: "Volume backup & restore",
      description: "Quick tar backup of a named volume:",
      markdown: `# Backup volume "db_data" to db_backup.tar
docker run --rm -v db_data:/data -v "$PWD":/backup alpine \\
  sh -c "cd /data && tar -czf /backup/db_backup.tar.gz ."

# Restore into empty volume
docker run --rm -v db_data:/data -v "$PWD":/backup alpine \\
  sh -c "cd /data && tar -xzf /backup/db_backup.tar.gz"`,
    },
    {
      title: "Inspect container & network",
      description: "Get IPs, env, mounts, etc.:",
      markdown: `docker inspect <container>
docker inspect <network>`,
    },

    // ===== Testing & CI Tips =====
    {
      title: "Test image locally",
      description: "Run tests inside an ephemeral container:",
      markdown: `docker run --rm -it -v "$PWD":/work -w /work myapp:latest npm test`,
    },
    {
      title: "Small Alpine debug toolbox",
      description: "Ephemeral shell with common tools:",
      markdown: `docker run --rm -it alpine sh
# apk add --no-cache curl bash jq`,
    },
  ],
};

export default section;
