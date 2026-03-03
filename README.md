<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# DevLab Pro — Moodle Integration

Laboratorio virtual de programación interactivo con evaluación de código impulsada por **Gemini AI** e integración nativa con **Moodle LTI 1.3**.

> View in AI Studio: [ai.studio/apps/drive/...](https://ai.studio/apps/drive/1sXP3fNEkFIHqV2mpatV4Bv8cIz_Rs8_I)

---

## 📋 Tabla de Contenidos

- [Tech Stack](#-tech-stack)
- [Prerrequisitos](#-prerrequisitos)
- [Instalación Local](#-instalación-local)
- [Containerización con Docker](#-containerización-con-docker)
- [Variables de Entorno](#-variables-de-entorno)
- [Arquitectura Docker](#-arquitectura-docker)
- [Comandos Útiles](#-comandos-útiles)
- [Documentación](#-documentación)

---

## 🛠 Tech Stack

| Categoría | Tecnología |
|---|---|
| **Frontend** | React 19, TypeScript, Vite 6 |
| **Estilos** | Tailwind CSS |
| **Editor de Código** | Ace Editor (`react-ace`) |
| **IA** | Google Gemini AI (`@google/genai`) |
| **Autenticación** | LTI 1.3 + JWT |
| **Containerización** | Docker, Docker Compose |
| **Servidor Producción** | Nginx Alpine |

---

## 📦 Prerrequisitos

- **Node.js** >= 22
- **npm** >= 10
- **Docker** >= 24 y **Docker Compose** >= 2.20 *(para containerización)*

---

## 🚀 Instalación Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/leoguevaraparra/devlabs-ai.git
   cd devlabs-ai
   ```

2. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   ```
   Edita `.env` y configura tu `VITE_GEMINI_API_KEY`.

3. **Instalar dependencias:**
   ```bash
   npm install
   ```

4. **Ejecutar en desarrollo:**
   ```bash
   npm run dev
   ```
   La app estará disponible en `http://localhost:5173`

---

## 🐳 Containerización con Docker

El proyecto incluye una configuración completa de Docker con **multi-stage build** y perfiles para **desarrollo** y **producción**.

### Estructura de Archivos Docker

```
devlabs-ai/
├── Dockerfile            # Multi-stage build (3 etapas)
├── docker-compose.yml    # Orquestación de servicios
├── .dockerignore         # Exclusiones del contexto de build
├── .env                  # Variables de entorno (no versionado)
└── .env.example          # Template de variables de entorno
```

### Configuración Inicial

```bash
# 1. Crear el archivo de variables de entorno
cp .env.example .env

# 2. Editar .env con tus valores reales
nano .env
```

### Levantar en Producción

```bash
docker compose --profile prod up --build -d
```

La app estará disponible en `http://localhost:8080` *(puerto configurable vía `APP_PORT` en `.env`)*.

### Levantar en Desarrollo

```bash
docker compose --profile dev up --build
```

La app estará disponible en `http://localhost:5173` con **Hot Module Replacement (HMR)** activado.

### Detener Servicios

```bash
# Detener producción
docker compose --profile prod down

# Detener desarrollo
docker compose --profile dev down
```

---

## 🔐 Variables de Entorno

| Variable | Descripción | Requerida | Default |
|---|---|---|---|
| `VITE_GEMINI_API_KEY` | API Key de Google Gemini AI | ✅ | — |
| `VITE_API_URL` | URL del backend LTI | ✅ | — |
| `APP_PORT` | Puerto de producción (host) | ❌ | `80` |
| `DEV_PORT` | Puerto de desarrollo (host) | ❌ | `5173` |
| `REDIS_PORT` | Puerto de Redis (host) | ❌ | `6379` |

> ⚠️ **Importante:** Las variables `VITE_*` son inyectadas en **build time** por Vite. Deben estar definidas en `.env` **antes** de construir la imagen de producción.

---

## 🏗 Arquitectura Docker

### Multi-Stage Build (Dockerfile)

El Dockerfile utiliza **3 etapas** para producir una imagen final mínima (~40MB):

```
┌──────────────────────────────────────────────────────────┐
│  Stage 1: deps (node:22-alpine)                          │
│  └─ npm ci → instala dependencias desde el lockfile      │
├──────────────────────────────────────────────────────────┤
│  Stage 2: builder (node:22-alpine)                       │
│  └─ vite build → genera el bundle estático en dist/      │
├──────────────────────────────────────────────────────────┤
│  Stage 3: runner (nginx:1.27-alpine)                     │
│  └─ Sirve dist/ con Nginx (~40MB imagen final)           │
│     ✔ Gzip habilitado                                    │
│     ✔ SPA fallback routing                               │
│     ✔ Security headers                                   │
│     ✔ Cache agresivo en assets estáticos                 │
│     ✔ Usuario non-root (appuser:1001)                    │
│     ✔ Health check en /healthz                           │
└──────────────────────────────────────────────────────────┘
```

### Servicios (docker-compose.yml)

| Servicio | Imagen | Perfil | Puerto | Descripción |
|---|---|---|---|---|
| `app` | `Dockerfile` → Nginx | `prod` | `APP_PORT:80` | Frontend optimizado para producción |
| `app-dev` | `node:22-alpine` | `dev` | `DEV_PORT:5173` | Vite dev server con HMR + bind mount |
| `redis` | `redis:7-alpine` | `dev`, `prod` | `REDIS_PORT:6379` | Cache en memoria (opcional) |

### Red y Volúmenes

- **Red:** `devlabs-network` (bridge) — aísla la comunicación entre servicios
- **Volúmenes:**
  - `devlabs_node_modules` — persiste `node_modules` en desarrollo
  - `devlabs_redis_data` — persiste datos de Redis

---

## 🔧 Comandos Útiles

```bash
# Ver logs en tiempo real
docker compose --profile prod logs -f

# Ver estado y health checks
docker compose ps

# Reconstruir sin caché
docker compose --profile prod build --no-cache

# Acceder al contenedor de producción
docker exec -it devlabs-frontend sh

# Ver tamaño de la imagen
docker images devlabs-ai-app

# Limpiar todo (contenedores, redes, volúmenes)
docker compose --profile prod down -v
```

---

## 📚 Documentación

Para documentación detallada sobre la arquitectura del sistema, fases de desarrollo, integración LTI 1.3 y guía de escalabilidad, consulta [DOCUMENTATION.md](DOCUMENTATION.md).

---

<div align="center">
  <sub>Built with ❤️ by the DevLab Pro team</sub>
</div>
