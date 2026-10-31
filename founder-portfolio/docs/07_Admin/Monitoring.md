# Admin — Monitoring

| Field | Value |
|-------|-------|
| **Document ID** | ADMIN-MON-001 |
| **Route** | `/admin/monitoring` |
| **Product** | Founder Portfolio Platform (FounderOS v1.0) |
| **Status** | Approved |
| **Last Updated** | 2026-06-29 |
| **Related** | [Logs](./Logs.md) · [Deployment Monitoring](../13_Deployment/Monitoring.md) · [Observability](../04_Architecture/Observability.md) · [Dashboard](./Dashboard.md) |

---

## Purpose

Document the Admin Monitoring view — operational health of FounderOS services (API, database, Redis, disk) for tenant administrators and operators.

---

## Scope

| In Scope | Out of Scope |
|----------|--------------|
| Health status dashboard in admin | Full Datadog/Grafana setup |
| Uptime and latency snapshots | On-call paging configuration |
| Link to external monitoring | |

---

## Business Context

Enterprise SLAs require visibility into uptime. Solo founders on Hostinger VPS need a simple green/red dashboard without learning Prometheus.

---

## Goals

1. Service health visible within 60s of degradation.
2. Last 24h uptime percentage displayed.
3. Clear escalation path when red.
4. Complement external monitoring (UptimeRobot, etc.).

---

## Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-AMON-001 | Status cards: API, PostgreSQL, Redis, Frontend | P0 |
| FR-AMON-002 | Poll health endpoints every 60s when page open | P0 |
| FR-AMON-003 | Display response time sparkline (24h) | P1 |
| FR-AMON-004 | Link to external status page if configured | P2 |
| FR-AMON-005 | Admin-only access | P0 |
| FR-AMON-006 | Show deployment version/git sha | P1 |

---

## Non-functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-AMON-001 | Health check timeout | 5s |
| NFR-AMON-002 | Poll interval | 60s |

---

## User Stories

| ID | As a… | I want… | So that… |
|----|-------|---------|----------|
| US-AMON-001 | Operator | see if API is down | I restart services |
| US-AMON-002 | Founder | uptime percentage | I report to investors |
| US-AMON-003 | Support | version sha | I match docs to deploy |

---

## UX Requirements

- **Status colors**: green healthy, yellow degraded, red down.
- **Cards**: Service name, status, last check time, latency ms.
- **Degraded**: Show which dependency failed in subtitle.
- **Actions**: Link to Logs tab; doc link for [Docker](../13_Deployment/Docker.md) restart.

```mermaid
flowchart TB
    Admin[Admin Monitoring] --> HC[/health aggregated]
    HC --> API[FastAPI /health]
    HC --> PG[PostgreSQL ping]
    HC --> Redis[Redis ping]
    HC --> FE[Frontend optional]
```

---

## Technical Considerations

- FastAPI `/health` returns `{ status, db, redis, version }`.
- Historical metrics from Redis time-series or external API.
- Do not expose internal hostnames in public health endpoint.

---

## Security Considerations

- Monitoring page requires authentication.
- Public `/health` minimal info only; detailed in admin auth route.
- Rate limit health endpoint to prevent abuse.

---

## Acceptance Criteria

- [ ] Service list and status semantics documented
- [ ] Poll interval and timeout specified
- [ ] Health endpoint response shape defined
- [ ] RBAC admin-only stated
- [ ] Cross-link to Deployment Monitoring

---

## Future Enhancements

- Email/SMS alert configuration in UI
- Incident timeline
- Synthetic checks from multiple regions

---

## Open Questions

| # | Question | Owner |
|---|----------|-------|
| OQ-1 | Store 24h metrics in Redis or Postgres? | Engineering |
| OQ-2 | Show disk/memory on VPS? | DevOps |
| OQ-3 | Public status page subdomain? | Product |
