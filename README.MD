# OMIPS Yucatán – Juez Virtual 🏆

Plataforma web de **juez virtual y gestión de problemas y concursos** para la **Olimpiada Mexicana de Informática para Primaria y Secundaria (OMIPS) – Delegación Yucatán**.

Este sistema permite:
- Administrar y crear problemas.
- Ejecutar envíos de código automáticamente.
- Crear concursos.
- Gestionar participantes.
- Calificar en tiempo real.

---

## 🧠 Arquitectura General

El sistema está basado en **microservicios desacoplados**, usando **Docker** para la virtualización ligera de los servicios:

```
Frontend  ───► Backend API ───► Redis Queue ───► Worker (Judge)
                             │
                             └──► Base de datos
```

### Contenedores principales:

| Servicio | Descripción |
|-----------|--------------|
| **Frontend** | Interfaz web para usuarios, jueces y administradores |
| **Backend (Judge API)** | API REST para manejo de usuarios, problemas y envíos |
| **Redis** | Cola de trabajos para los envíos |
| **rekarel-worker** | Motor de evaluación que ejecuta y califica los programas |

Todo el sistema corre dentro de **contenedores Docker interconectados mediante una red interna**.

---

## 🐳 Docker y Orquestación

Este proyecto utiliza:

- **Docker** → Virtualización ligera por contenedores  
- **Docker Compose** → Orquestación de múltiples contenedores

### Servicios levantados:

- `redis`
- `judge-backend`
- `rekarel-worker`
- `frontend`

Se comunican mediante **Docker Networking**, usando los nombres de servicio como host.

---

## 🚀 Instalación y Ejecución

### Requisitos

- Docker
- Docker Compose
- Git

---

### Clonar el repositorio

```bash
git clone https://github.com/TU-USUARIO/NOMBRE-DEL-REPO.git
cd NOMBRE-DEL-REPO
```

---

### Configurar variables de entorno

Crear archivo `.env` basado en `.env.template`:

---

### Levantar todo el sistema

```bash
docker compose up --build
```

O en segundo plano:

```bash
docker compose up -d --build
```

---

### Ver contenedores activos

```bash
docker ps
```

---

### Detener todo

```bash
docker compose down
```

---

## 📂 Estructura del Proyecto

```
.
├── backend/
│   ├── judge/             # API principal
│   └── rekarel-worker/   # Worker de evaluación
├── frontend/              # Interfaz web
├── docker-compose.yml
├── .env
└── README.md
```

---

## 🛠 Tecnologías

### Backend
- Python (FastAPI)
- Redis

### Worker
- TypeScript
- Redis

### Database
- PostgreSQL

### Frontend
- Node.js
- Typescript
- Taildwind CSS
- NextJS

### Infraestructura
- Docker
- Docker Compose

---

## 🔐 Seguridad

Este repositorio **NO incluye**:

- `.env`
- Credenciales
- Tokens
- Claves privadas
- Archivos compilados
- Entornos virtuales

Todo esto está excluido mediante `.gitignore`.

---

## 🏫 Uso Educativo

Este proyecto está diseñado para apoyar a la:

> **Olimpiada Mexicana de Informática para Primaria y Secundaria – Yucatán (OMIPS Yucatán)**

Facilitando:
- Entrenamiento
- Concursos locales
- Selección estatal
- Práctica continua

---

## 👨‍💻 Autores

**Cristhian Ramírez**  
Estudiante & Desarrollador Backend  
Miembro del Competitive Programming Club UADY  

**Saul Canché**  
Estudiante & Desarrollador Fullstack  
Miembro del Competitive Programming Club UADY  
