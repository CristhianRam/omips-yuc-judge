<!--
@file README.MD
@description Documentacion principal del monorepo OMIPS Yucatan Judge.
@symbols N/A
-->

# OMIPS Yucatan Judge

Plataforma de juez virtual para entrenamiento y concursos de OMIPS Yucatan.

## 1. Que es este proyecto

Este repositorio contiene un stack completo para:
- Gestion de usuarios con roles (`STUDENT`, `COACH`, `ADMIN`).
- Gestion de problemas y testcases.
- Gestion de concursos y scoreboard.
- Recepcion de envios de codigo Karel.
- Evaluacion asincrona de envios con worker dedicado.

## 2. Arquitectura

```text
Browser
  |
  v
Frontend (Next.js, puerto 3000)
  |
  v
API (FastAPI, puerto host 8080 -> contenedor 8000)
  |
  +--> PostgreSQL (puerto host 5433 -> contenedor 5432)
  |
  +--> Redis (cola de submissions)
            |
            v
      Worker (TypeScript + @rekarel/core)
```

Flujo de evaluacion:
1. El frontend crea un envio via `POST /submissions`.
2. La API guarda el envio con estado inicial y publica un job en Redis (`submission_queue`).
3. El worker consume la cola, compila y evalua contra testcases.
4. El worker actualiza el resultado final en PostgreSQL (`AC`, `WA`, `TLE`, `RE`, `CE`).
5. Si el envio pertenece a concurso, se actualiza el scoreboard.

## 3. Stack tecnico

- Frontend: Next.js (App Router), React, TypeScript, NextAuth v5, next-intl, Tailwind.
- API: FastAPI, SQLModel/SQLAlchemy, PostgreSQL, Redis, RQ utilities.
- Worker: TypeScript, `@rekarel/core`, Redis, PostgreSQL (`pg`).
- Infra: Docker, Docker Compose, GitHub Actions, Nginx (config en `nginx/nginx.conf`).

## 4. Estructura del repo

```text
.
|-- backend/
|   |-- judge/                 # API FastAPI
|   |-- rekarel-worker/        # Worker de evaluacion
|   |-- .env.template.env      # Variables base backend/worker
|   `-- docker-compose.yml
|-- frontend/                  # App Next.js
|-- nginx/                     # Proxy/Nginx config
|-- docker-compose.yml         # Entorno local full-stack
|-- docker-compose.prod.yml    # Entorno productivo basado en imagenes GHCR
|-- .env.example
|-- .env.prod.example
`-- docs/FILE_CATALOG.md       # Catalogo global de archivos y estrategia de doc
```

## 5. Requisitos

- Docker Engine 24+.
- Docker Compose v2.
- Git.

Para desarrollo sin Docker (opcional):
- Python 3.12+.
- Node.js 20+.
- pnpm (frontend).
- npm o pnpm (worker).

## 6. Arranque rapido local (recomendado)

1. Clona el repo.

```bash
git clone <tu-repo>
cd omips-yuc-judge
```

2. Crea variables de entorno.

```bash
cp backend/.env.template.env backend/.env
```

3. Levanta todo.

```bash
docker compose up --build
```

4. Verifica servicios.

```bash
docker compose ps
```

5. URLs locales.
- Frontend: `http://localhost:3000`
- API: `http://localhost:8080`
- Swagger/OpenAPI: `http://localhost:8080/docs`
- PostgreSQL host: `localhost:5433`
- Redis host: `localhost:6379`

## 7. Variables de entorno

### 7.1 Base backend/worker (`backend/.env`)

Variables importantes:
- `REDIS_HOST`
- `REDIS_PORT`
- `REDIS_PASSWORD` (opcional local, recomendado en prod)
- `DATABASE_URL`
- `SECRET_KEY`
- `ALGORITHM`
- `ACCESS_TOKEN_EXPIRE_MINUTES`
- `TESTCASES_DIR` (default esperado: `/data/problems`)
- `ADMIN_USER`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_FROM`
- `EMAIL_VERIFICATION_TTL_MINUTES`

### 7.2 Frontend

Variables usadas por contenedor frontend en `docker-compose.yml`:
- `AUTH_SECRET`
- `AUTH_TRUST_HOST`

Argumento build frontend:
- `NEXT_PUBLIC_API` (en compose local usa `http://api:8000` para red interna Docker).

### 7.3 Produccion

Usa `.env.prod.example` como plantilla para el archivo `.env` productivo junto a `docker-compose.prod.yml`.

## 8. Servicios de Docker Compose local

`docker-compose.yml` define:
- `frontend`: Next.js en puerto `3000`.
- `api`: FastAPI en puerto host `8080`.
- `worker`: evaluador asincrono.
- `db`: PostgreSQL 15 en puerto host `5433`.
- `redis`: Redis 7 en puerto host `6379`.

Volumenes:
- `problem_data`: almacenamiento compartido de testcases entre API y worker.

## 9. Endpoints principales de la API

Prefijos registrados en `backend/judge/app/main.py`:
- `/auth`
- `/users`
- `/problems`
- `/contests`
- `/testcases`
- `/submissions`

Rutas relevantes por modulo:
- Auth: registro, verificacion de email, reenvio de verificacion, token.
- Users: perfil propio (`/users/me`), lectura y gestion de roles.
- Problems: CRUD completo.
- Contests: CRUD, asociacion de problemas, join/leave, scoreboard.
- Testcases: crear/listar/obtener/eliminar testcases por problema.
- Submissions: crear envio, consultar envio, listar envios del usuario o globales.

## 10. Worker: reglas de evaluacion

El worker (`backend/rekarel-worker/src/worker.ts`) ejecuta este pipeline:
1. `BRPOP submission_queue` en Redis.
2. Cambia estado del envio a `JUDGING`.
3. Compila codigo fuente Karel.
4. Corre cada testcase y evalua:
- Error de compilacion -> `CE`.
- Runtime error -> `RE`.
- Exceso de tiempo/instrucciones -> `TLE`.
- Salida incorrecta -> `WA`.
- Todo correcto -> `AC`.
5. Persiste resultado final y metricas.
6. Si aplica, actualiza scoreboard del concurso.

## 11. Desarrollo por modulo (sin Docker)

### 11.1 Backend API

```bash
cd backend/judge
python -m venv .venv
source .venv/bin/activate  # En Windows usa .venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 11.2 Worker

```bash
cd backend/rekarel-worker
npm install
npm run start
```

### 11.3 Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

## 12. Produccion

`docker-compose.prod.yml` usa imagenes desde GHCR:
- `ghcr.io/<owner>/omips-frontend:latest`
- `ghcr.io/<owner>/omips-api:latest`
- `ghcr.io/<owner>/omips-worker:latest`

Pasos base:
1. Copia `.env.prod.example` a `.env` y rellena secretos reales.
2. Ejecuta `docker compose -f docker-compose.prod.yml up -d`.
3. Verifica salud de contenedores y logs.
4. Configura reverse proxy/TLS (Nginx externo o similar).

## 13. Observabilidad y operacion

Comandos utiles:

```bash
# Estado
docker compose ps

# Logs en tiempo real
docker compose logs -f api
docker compose logs -f worker
docker compose logs -f frontend

# Reiniciar solo worker
docker compose restart worker

# Entrar al contenedor API
docker compose exec api sh
```

## 14. Troubleshooting rapido

- `Connection refused` API->DB: valida `DATABASE_URL` y salud de `db`.
- Worker no procesa cola: valida `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`.
- Submissions se quedan en `QUEUED`: revisa logs de `worker` y conectividad Redis.
- Error SMTP: valida credenciales y puerto TLS (`587`) en variables de correo.
- Problemas de testcases: confirma volumen `problem_data` y `TESTCASES_DIR`.

## 15. Seguridad minima recomendada

- Nunca commitear `.env` reales.
- Rotar `SECRET_KEY`, `AUTH_SECRET`, `REDIS_PASSWORD`, passwords DB.
- Exponer al internet solo el frontend/proxy, no DB ni Redis.
- Usar HTTPS en produccion.
- Aplicar principio de menor privilegio en roles de usuario.

## 16. Estado de documentacion del codigo

Este repo ya incluye:
- Cabeceras de documentacion por archivo en modulos soportados.
- Inventario global en `docs/FILE_CATALOG.md` para cubrir el 100% de archivos, incluyendo los que no permiten comentarios inline (JSON, lockfiles, binarios).

## 17. Autores

- Cristhian Ramirez
- Saul Canche
- Yahir

---

Si quieres, como siguiente paso te puedo generar tambien un `docs/API_REFERENCE.md` con cada endpoint, payload, response y ejemplos curl listos para Postman.