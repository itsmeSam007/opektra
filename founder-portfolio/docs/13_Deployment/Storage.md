# Storage — FounderOS v1.0

| Field | Value |
|-------|-------|
| **Document ID** | DEP-STORAGE-001 |
| **Product** | Founder Portfolio Platform (FounderOS v1.0) |
| **Status** | Approved |
| **Last Updated** | 2026-06-29 |
| **Related** | [Docker](./Docker.md) · [Media API](../08_API/Media_API.md) · [Backup](./Backup.md) |

---

## Purpose

Define filesystem storage layout, Docker volume configuration, backup scope, and migration path to object storage for FounderOS v1.0 media assets.

## Scope

| In Scope | Out of Scope |
|----------|--------------|
| VPS filesystem media storage | S3/R2 implementation (v1.5) |
| Docker volume mounts | CDN origin configuration |
| Backup inclusion | Database storage (see Backup.md) |

## Business Context

Media files are tenant brand assets. Consistent storage paths enable backups, Nginx serving, and future S3 migration without URL breakage.

## Goals

1. Standardize media path across API, SRS, and deployment.
2. Persist media across container restarts via Docker volumes.
3. Include media in daily backup procedures.
4. Support 50 GB per tenant in v1.0.

## Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-ST-001 | Media stored at `/data/media/{tenant_id}/{year}/{month}/` | P0 |
| FR-ST-002 | Docker volume `founderos_media` mounted at `/data/media` | P0 |
| FR-ST-003 | Nginx serves `/media/files/*` from storage path | P0 |
| FR-ST-004 | Default `tenant_id` = `default` for single-tenant v1.0 | P0 |
| FR-ST-005 | Daily backup includes `/data/media` | P0 |

## Non-functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-ST-001 | Disk I/O for image upload | < 500 ms |
| NFR-ST-002 | Quota enforcement | 50 GB soft limit |

## User Stories

| ID | As a… | I want… | So that… |
|----|-------|---------|----------|
| US-ST-001 | DevOps | documented volume mounts | deploy is reproducible |
| US-ST-002 | Admin | uploaded files persist | restarts don't lose media |
| US-ST-003 | Operator | media in backups | DR restores assets |

## UX Requirements

- Upload failures show disk quota message when limit reached.
- Broken image URLs show placeholder in admin.

## Technical Considerations

### Directory Layout

```
/data/media/
└── {tenant_id}/
    └── {year}/
        └── {month}/
            └── {uuid}.{ext}
```

### Docker Compose Volume

```yaml
volumes:
  founderos_media:
services:
  api:
    volumes:
      - founderos_media:/data/media
  nginx:
    volumes:
      - founderos_media:/data/media:ro
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MEDIA_ROOT` | `/data/media` | Filesystem root |
| `TENANT_ID` | `default` | v1.0 single-tenant ID |
| `MEDIA_MAX_GB` | `50` | Quota soft limit |

### Migration to S3 (v1.5)

Documented in [Media_Architecture](../04_Architecture/Media_Architecture.md). v1.0 URLs remain stable via redirect layer.

## Security Considerations

- Storage directory not writable by Nginx process.
- File permissions: `640` files, `750` directories.
- See [File_Upload](../11_Security/File_Upload.md) for upload validation.

## Acceptance Criteria

- [ ] Upload writes to `/data/media/default/YYYY/MM/`
- [ ] Container restart preserves files
- [ ] Nginx serves files with cache headers
- [ ] Backup script includes media volume
- [ ] Paths match Media API documentation

## Future Enhancements

- S3-compatible object storage (v1.5)
- Cloudflare R2 integration (v1.5)
- Image CDN transformation (v1.5)

## Open Questions

| ID | Question | Owner |
|----|----------|-------|
| OQ-ST-01 | Cloudflare Images vs self-hosted? | DevOps — Week 4 |

## Dependencies

- [Docker](./Docker.md)
- [Media API](../08_API/Media_API.md)
- [SRS](../../SOFTWARE_REQUIREMENTS_SPECIFICATION.md)

## Glossary

| Term | Definition |
|------|------------|
| tenant_id | Deployment instance identifier |
