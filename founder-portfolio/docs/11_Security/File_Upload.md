# File Upload Security

| Field | Value |
|-------|-------|
| **Document ID** | SEC-UPLOAD-001 |
| **Product** | Founder Portfolio Platform (FounderOS v1.0) |
| **Status** | Approved |
| **Last Updated** | 2026-06-29 |
| **Related** | [Validation](./Validation.md) · [Media API](../08_API/Media_API.md) · [CSP](./CSP.md) |

---

## Purpose

Define security controls for file uploads across the Media API, CMS blocks, and contact forms — preventing malicious files, storage abuse, and XSS via uploaded content.

## Scope

| In Scope | Out of Scope |
|----------|--------------|
| Image, video, PDF uploads via Media API | Virus scanning (v1.5) |
| MIME type and extension validation | DRM for media |
| Size limits | User-uploaded executables |

## Business Context

Media uploads are a primary attack vector for web applications. FounderOS tenants upload brand assets and content images; compromised uploads affect all site visitors.

## Goals

1. Allow only whitelisted file types.
2. Enforce size limits per file category.
3. Store uploads outside webroot with controlled serving.
4. Strip EXIF metadata from images (privacy).

## Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-UP-001 | Validate MIME type via magic bytes, not extension alone | P0 |
| FR-UP-002 | Reject executable types (`.exe`, `.sh`, `.php`, `.js` uploads) | P0 |
| FR-UP-003 | Enforce max size: 10MB images, 100MB video | P0 |
| FR-UP-004 | Generate random UUID filenames; never use user filename | P0 |
| FR-UP-005 | SVG uploads sanitized or disallowed in v1.0 | P1 |
| FR-UP-006 | Rate limit uploads: 30/hour per admin user | P0 |

## Non-functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-UP-001 | Upload validation overhead | < 100 ms |
| NFR-UP-002 | Storage quota per tenant | 50 GB v1.0 |

## User Stories

| ID | As a… | I want… | So that… |
|----|-------|---------|----------|
| US-UP-001 | Admin | safe image uploads | my site isn't compromised |
| US-UP-002 | Security auditor | MIME validation | spoofed files are rejected |
| US-UP-003 | DevOps | storage quotas | VPS disk isn't exhausted |

## UX Requirements

- Clear error when file type or size rejected.
- Progress indicator for large video uploads.
- Alt text required before publish (accessibility).

## Technical Considerations

### Allowed Types (v1.0)

| Category | MIME Types | Extensions |
|----------|------------|------------|
| Image | `image/jpeg`, `image/png`, `image/webp`, `image/gif` | jpg, png, webp, gif |
| Video | `video/mp4` | mp4 |
| Document | `application/pdf` | pdf |

### Storage Path

`/data/media/{tenant_id}/{year}/{month}/{uuid}.{ext}` per [Storage](../13_Deployment/Storage.md).

### Serving

Files served via Nginx with `Content-Disposition: inline` for images, `X-Content-Type-Options: nosniff`.

## Security Considerations

- Never execute uploaded files.
- Scan file content for embedded scripts in SVG (if allowed v1.1).
- Log upload events in audit trail.
- CSRF protection on upload endpoints.

## Acceptance Criteria

- [ ] Rejected MIME types return 422
- [ ] Oversized files return 413
- [ ] UUID filenames on all uploads
- [ ] No path traversal via filename
- [ ] Upload rate limit enforced

## Future Enhancements

- ClamAV virus scanning (v1.5)
- S3 signed URLs (v1.5)

## Open Questions

| ID | Question | Owner |
|----|----------|-------|
| OQ-UP-01 | Allow SVG in v1.0? | Security — default no |

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-06-29 | Initial file upload security specification |

## Dependencies

- [Media API](../08_API/Media_API.md)
- [Rate Limits](./Rate_Limits.md)
- [Audit](./Audit.md)

## Glossary

| Term | Definition |
|------|------------|
| MIME | Multipurpose Internet Mail Extensions type identifier |
