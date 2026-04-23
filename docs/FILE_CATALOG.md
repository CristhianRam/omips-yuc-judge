<!--
@file docs/FILE_CATALOG.md
@description Catalogo global de archivos del repositorio y estrategia de documentacion.
@symbols N/A
-->

# Catalogo de Archivos

Este documento registra todos los archivos del repositorio y su estrategia de documentacion.

| Archivo | Estrategia | Descripcion |
| --- | --- | --- |
| `.env.example` | Header inline | Variables de entorno de referencia para configuracion. |
| `.env.prod.example` | Header inline | Variables de entorno de referencia para configuracion. |
| `.github/workflows/deploy.yml` | Header inline | Workflow de CI/CD para automatizaciones de GitHub Actions. |
| `.gitignore` | Header inline | Archivo de configuracion o soporte del proyecto. |
| `backend/.env.template.env` | Header inline | Variables de entorno de referencia para configuracion. |
| `backend/docker-compose.yml` | Header inline | Orquestacion de servicios y dependencias en contenedores. |
| `backend/judge/.dockerignore` | Header inline | Archivo de configuracion o soporte del proyecto. |
| `backend/judge/app/api/auth_endpoints.py` | Header inline | Endpoints REST del backend Judge y dependencias de API. |
| `backend/judge/app/api/contest_endpoints.py` | Header inline | Endpoints REST del backend Judge y dependencias de API. |
| `backend/judge/app/api/deps.py` | Header inline | Endpoints REST del backend Judge y dependencias de API. |
| `backend/judge/app/api/dev_endpoints.py` | Header inline | Endpoints REST del backend Judge y dependencias de API. |
| `backend/judge/app/api/problem_endpoints.py` | Header inline | Endpoints REST del backend Judge y dependencias de API. |
| `backend/judge/app/api/submission_endpoints.py` | Header inline | Endpoints REST del backend Judge y dependencias de API. |
| `backend/judge/app/api/testcase_endpoints.py` | Header inline | Endpoints REST del backend Judge y dependencias de API. |
| `backend/judge/app/api/user_endpoints.py` | Header inline | Endpoints REST del backend Judge y dependencias de API. |
| `backend/judge/app/core/redis.py` | Header inline | Componentes nucleares de seguridad, almacenamiento y runtime. |
| `backend/judge/app/core/security.py` | Header inline | Componentes nucleares de seguridad, almacenamiento y runtime. |
| `backend/judge/app/core/testcase_storage.py` | Header inline | Componentes nucleares de seguridad, almacenamiento y runtime. |
| `backend/judge/app/create_admin.py` | Header inline | Modulo Python del backend Judge. |
| `backend/judge/app/db.py` | Header inline | Modulo Python del backend Judge. |
| `backend/judge/app/main.py` | Header inline | Modulo Python del backend Judge. |
| `backend/judge/app/models/__init__.py` | Header inline | Modelo de datos ORM del backend Judge. |
| `backend/judge/app/models/contest.py` | Header inline | Modelo de datos ORM del backend Judge. |
| `backend/judge/app/models/contest_problem.py` | Header inline | Modelo de datos ORM del backend Judge. |
| `backend/judge/app/models/contest_user.py` | Header inline | Modelo de datos ORM del backend Judge. |
| `backend/judge/app/models/email_verification.py` | Header inline | Modelo de datos ORM del backend Judge. |
| `backend/judge/app/models/problem.py` | Header inline | Modelo de datos ORM del backend Judge. |
| `backend/judge/app/models/scoreboard.py` | Header inline | Modelo de datos ORM del backend Judge. |
| `backend/judge/app/models/submission.py` | Header inline | Modelo de datos ORM del backend Judge. |
| `backend/judge/app/models/testcase.py` | Header inline | Modelo de datos ORM del backend Judge. |
| `backend/judge/app/models/user.py` | Header inline | Modelo de datos ORM del backend Judge. |
| `backend/judge/app/schemas/contest_schemas.py` | Header inline | Esquemas de validacion y serializacion del backend Judge. |
| `backend/judge/app/schemas/problem_schemas.py` | Header inline | Esquemas de validacion y serializacion del backend Judge. |
| `backend/judge/app/schemas/scoreboard_schemas.py` | Header inline | Esquemas de validacion y serializacion del backend Judge. |
| `backend/judge/app/schemas/submission_schemas.py` | Header inline | Esquemas de validacion y serializacion del backend Judge. |
| `backend/judge/app/schemas/testcase_schemas.py` | Header inline | Esquemas de validacion y serializacion del backend Judge. |
| `backend/judge/app/schemas/user_schemas.py` | Header inline | Esquemas de validacion y serializacion del backend Judge. |
| `backend/judge/app/services/contest_services.py` | Header inline | Servicios de negocio del backend Judge. |
| `backend/judge/app/services/email_services.py` | Header inline | Servicios de negocio del backend Judge. |
| `backend/judge/app/services/problem_services.py` | Header inline | Servicios de negocio del backend Judge. |
| `backend/judge/app/services/submission_services.py` | Header inline | Servicios de negocio del backend Judge. |
| `backend/judge/app/services/testcase_services.py` | Header inline | Servicios de negocio del backend Judge. |
| `backend/judge/app/services/user_services.py` | Header inline | Servicios de negocio del backend Judge. |
| `backend/judge/Dockerfile` | Header inline | Definicion de imagen Docker del servicio correspondiente. |
| `backend/judge/requirements.txt` | Header inline | Archivo de configuracion o soporte del proyecto. |
| `backend/rekarel-worker/.dockerignore` | Header inline | Archivo de configuracion o soporte del proyecto. |
| `backend/rekarel-worker/Dockerfile` | Header inline | Definicion de imagen Docker del servicio correspondiente. |
| `backend/rekarel-worker/package.json` | Catalogo (sin header inline) | Archivo de configuracion o soporte del proyecto. |
| `backend/rekarel-worker/package-lock.json` | Catalogo (sin header inline) | Archivo de configuracion o soporte del proyecto. |
| `backend/rekarel-worker/src/db.ts` | Header inline | Modulo del worker para evaluacion asincrona de envios. |
| `backend/rekarel-worker/src/evaluator/compare.ts` | Header inline | Modulo del worker para evaluacion asincrona de envios. |
| `backend/rekarel-worker/src/index.ts` | Header inline | Modulo del worker para evaluacion asincrona de envios. |
| `backend/rekarel-worker/src/loader/testcases.ts` | Header inline | Modulo del worker para evaluacion asincrona de envios. |
| `backend/rekarel-worker/src/redis.ts` | Header inline | Modulo del worker para evaluacion asincrona de envios. |
| `backend/rekarel-worker/src/types.ts` | Header inline | Modulo del worker para evaluacion asincrona de envios. |
| `backend/rekarel-worker/src/worker.ts` | Header inline | Modulo del worker para evaluacion asincrona de envios. |
| `backend/rekarel-worker/tsconfig.json` | Catalogo (sin header inline) | Archivo de configuracion o soporte del proyecto. |
| `docker-compose.prod.yml` | Header inline | Orquestacion de servicios y dependencias en contenedores. |
| `docker-compose.yml` | Header inline | Orquestacion de servicios y dependencias en contenedores. |
| `docs/FILE_CATALOG.md` | Header inline | Documentacion de alto nivel del repositorio o modulo. |
| `frontend/.dockerignore` | Header inline | Archivo de configuracion o soporte del proyecto. |
| `frontend/.gitignore` | Header inline | Archivo de configuracion o soporte del proyecto. |
| `frontend/app/[locale]/dashboard/contests/[id]/edit/page.tsx` | Header inline | Pagina de Next.js para la ruta '/dashboard/contests/[id]/edit'. |
| `frontend/app/[locale]/dashboard/contests/[id]/page.tsx` | Header inline | Pagina de Next.js para la ruta '/dashboard/contests/[id]'. |
| `frontend/app/[locale]/dashboard/contests/[id]/problem/[problemId]/page.tsx` | Header inline | Pagina de Next.js para la ruta '/dashboard/contests/[id]/problem/[problemId]'. |
| `frontend/app/[locale]/dashboard/contests/create/page.tsx` | Header inline | Pagina de Next.js para la ruta '/dashboard/contests/create'. |
| `frontend/app/[locale]/dashboard/contests/page.tsx` | Header inline | Pagina de Next.js para la ruta '/dashboard/contests'. |
| `frontend/app/[locale]/dashboard/layout.tsx` | Header inline | Layout de Next.js para la ruta '/dashboard'. |
| `frontend/app/[locale]/dashboard/page.tsx` | Header inline | Pagina de Next.js para la ruta '/dashboard'. |
| `frontend/app/[locale]/dashboard/problems/[id]/edit/page.tsx` | Header inline | Pagina de Next.js para la ruta '/dashboard/problems/[id]/edit'. |
| `frontend/app/[locale]/dashboard/problems/[id]/page.tsx` | Header inline | Pagina de Next.js para la ruta '/dashboard/problems/[id]'. |
| `frontend/app/[locale]/dashboard/problems/create/page.tsx` | Header inline | Pagina de Next.js para la ruta '/dashboard/problems/create'. |
| `frontend/app/[locale]/dashboard/problems/page.tsx` | Header inline | Pagina de Next.js para la ruta '/dashboard/problems'. |
| `frontend/app/[locale]/dashboard/submissions/page.tsx` | Header inline | Pagina de Next.js para la ruta '/dashboard/submissions'. |
| `frontend/app/[locale]/dashboard/users/[id]/edit/page.tsx` | Header inline | Pagina de Next.js para la ruta '/dashboard/users/[id]/edit'. |
| `frontend/app/[locale]/dashboard/users/[id]/page.tsx` | Header inline | Pagina de Next.js para la ruta '/dashboard/users/[id]'. |
| `frontend/app/[locale]/dashboard/users/page.tsx` | Header inline | Pagina de Next.js para la ruta '/dashboard/users'. |
| `frontend/app/[locale]/layout.tsx` | Header inline | Modulo TypeScript del proyecto. |
| `frontend/app/[locale]/login/page.tsx` | Header inline | Pagina de Next.js para la ruta '/login'. |
| `frontend/app/[locale]/page.tsx` | Header inline | Modulo TypeScript del proyecto. |
| `frontend/app/[locale]/signup/page.tsx` | Header inline | Pagina de Next.js para la ruta '/signup'. |
| `frontend/app/[locale]/signup/verify/page.tsx` | Header inline | Pagina de Next.js para la ruta '/signup/verify'. |
| `frontend/app/api/submissions/[id]/route.ts` | Header inline | Ruta API del frontend para operaciones del cliente. |
| `frontend/app/layout.tsx` | Header inline | Modulo TypeScript del proyecto. |
| `frontend/app/lib/actions.ts` | Header inline | Modulo de utilidades y logica de datos del frontend. |
| `frontend/app/lib/data.ts` | Header inline | Modulo de utilidades y logica de datos del frontend. |
| `frontend/app/lib/definitions.ts` | Header inline | Modulo de utilidades y logica de datos del frontend. |
| `frontend/app/lib/placeholder-data.ts` | Header inline | Modulo de utilidades y logica de datos del frontend. |
| `frontend/app/lib/utils.ts` | Header inline | Modulo de utilidades y logica de datos del frontend. |
| `frontend/app/ui/acme-logo.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/button.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/codemirror/code-editor.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/codemirror/rekarel-lang.ts` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/contests/add-problem-form.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/contests/buttons.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/contests/contest-submit-form.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/contests/contest-tabs.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/contests/create-form.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/contests/edit-form.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/contests/join-leave-button.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/contests/participants-tab.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/contests/problems-tab.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/contests/scoreboard-tab.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/contests/table.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/dashboard/cards.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/dashboard/nav-links.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/dashboard/recent-activity.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/dashboard/sidenav.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/fonts.ts` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/global.css` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/language-switcher.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/login-form.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/markdown-renderer.css` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/markdown-renderer.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/omips-icon.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/pagination.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/problems/breadcrumbs.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/problems/buttons.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/problems/create-form.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/problems/edit-form.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/problems/filters.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/problems/submissions-list.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/problems/submit-form.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/problems/table.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/search.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/signup-form.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/skeletons.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/submissions/filters.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/submissions/submission-detail-modal.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/submissions/submissions-table-body.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/submissions/table.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/users/buttons.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/users/edit-form.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/users/filters.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/users/table.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/app/ui/verify-email-form.tsx` | Header inline | Componente de interfaz de usuario del frontend. |
| `frontend/auth.config.ts` | Header inline | Modulo TypeScript del proyecto. |
| `frontend/auth.ts` | Header inline | Modulo TypeScript del proyecto. |
| `frontend/Dockerfile` | Header inline | Definicion de imagen Docker del servicio correspondiente. |
| `frontend/frontend-README.md` | Header inline | Documentacion de alto nivel del repositorio o modulo. |
| `frontend/i18n/navigation.ts` | Header inline | Configuracion de internacionalizacion del frontend. |
| `frontend/i18n/request.ts` | Header inline | Configuracion de internacionalizacion del frontend. |
| `frontend/i18n/routing.ts` | Header inline | Configuracion de internacionalizacion del frontend. |
| `frontend/messages/en.json` | Catalogo (sin header inline) | Archivo de configuracion o soporte del proyecto. |
| `frontend/messages/es.json` | Catalogo (sin header inline) | Archivo de configuracion o soporte del proyecto. |
| `frontend/next.config.ts` | Header inline | Modulo TypeScript del proyecto. |
| `frontend/package.json` | Catalogo (sin header inline) | Archivo de configuracion o soporte del proyecto. |
| `frontend/pnpm-lock.yaml` | Catalogo (sin header inline) | Archivo de configuracion o soporte del proyecto. |
| `frontend/postcss.config.js` | Header inline | Archivo de configuracion o soporte del proyecto. |
| `frontend/proxy.ts` | Header inline | Modulo TypeScript del proyecto. |
| `frontend/public/customers/amy-burns.png` | Catalogo (sin header inline) | Archivo de configuracion o soporte del proyecto. |
| `frontend/public/customers/balazs-orban.png` | Catalogo (sin header inline) | Archivo de configuracion o soporte del proyecto. |
| `frontend/public/customers/delba-de-oliveira.png` | Catalogo (sin header inline) | Archivo de configuracion o soporte del proyecto. |
| `frontend/public/customers/evil-rabbit.png` | Catalogo (sin header inline) | Archivo de configuracion o soporte del proyecto. |
| `frontend/public/customers/lee-robinson.png` | Catalogo (sin header inline) | Archivo de configuracion o soporte del proyecto. |
| `frontend/public/customers/michael-novotny.png` | Catalogo (sin header inline) | Archivo de configuracion o soporte del proyecto. |
| `frontend/public/favicon.ico` | Catalogo (sin header inline) | Archivo de configuracion o soporte del proyecto. |
| `frontend/public/hero-desktop.png` | Catalogo (sin header inline) | Archivo de configuracion o soporte del proyecto. |
| `frontend/public/hero-mobile.png` | Catalogo (sin header inline) | Archivo de configuracion o soporte del proyecto. |
| `frontend/public/omips.svg` | Catalogo (sin header inline) | Archivo de configuracion o soporte del proyecto. |
| `frontend/public/opengraph-image.png` | Catalogo (sin header inline) | Archivo de configuracion o soporte del proyecto. |
| `frontend/tailwind.config.ts` | Header inline | Modulo TypeScript del proyecto. |
| `frontend/tsconfig.json` | Catalogo (sin header inline) | Archivo de configuracion o soporte del proyecto. |
| `frontend/types/next-auth.d.ts` | Header inline | Modulo TypeScript del proyecto. |
| `git` | Catalogo (sin header inline) | Archivo auxiliar presente en la raiz del repositorio. |
| `nginx/nginx.conf` | Header inline | Configuracion de Nginx para enrutamiento y proxy reverso. |
| `README.MD` | Header inline | Documentacion de alto nivel del repositorio o modulo. |
