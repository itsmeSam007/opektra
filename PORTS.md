# FounderOS — Local Port Allocation

Dedicated host ports to avoid conflicts with other projects (Next.js 3000, FastAPI 8000, PostgreSQL 5432, Redis 6379).

| Service | Host port | Container port | URL / connection |
|---------|-----------|----------------|------------------|
| Frontend (Next.js) | **13000** | 3000 | http://localhost:13000 |
| Backend API (FastAPI) | **18000** | 8000 | http://localhost:18000 |
| API docs | **18000** | 8000 | http://localhost:18000/docs |
| PostgreSQL | **15432** | 5432 | `localhost:15432` |
| Redis | **16379** | 6379 | `localhost:16379` |

## Docker Compose

Host ports are mapped in `docker-compose.yml`. Services communicate on the internal Docker network using standard container ports (`db:5432`, `redis:6379`, etc.).

## Local development (without full Docker)

```bash
# Database + Redis only
docker compose up -d db redis

# Backend on host
cd backend && uvicorn app.main:app --reload --port 18000

# Frontend on host
cd frontend && npm run dev   # binds to 13000
```

## Environment variables

See `.env.example` for `FOS_PORT_*` overrides.
