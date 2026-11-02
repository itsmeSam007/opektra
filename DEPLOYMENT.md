# Local and live Docker environments

Run commands from the repository root. Use Docker Engine with Docker Compose v2.20+ (or newer); the compatibility `docker-compose.yml` uses Compose `include`.

| Setting | Local | Live |
| --- | --- | --- |
| Command | `./docker-local` | `./docker-prod` |
| Compose file | `docker-compose.local.yml` | `docker-compose.prod.yml` (standalone) |
| Env file | root `.env.local`, optional | root `.env.prod`, required |
| Project | `portfolio` (preserves existing local data) | `opektra-prod` |
| Application mode | `development` | `production` |
| Source | Local folders mounted into containers | Source baked into images; no application bind mounts |
| Published ports | 13000, 18000, 15432, 16379 by default | Only proxy 80/443 |
| Data | `portfolio_postgres_data`, `portfolio_founderos_media` | `opektra-prod_postgres_data`, `opektra-prod_media_data`, `opektra-prod_redis_data` |
| Content bootstrap | Developer examples on an empty DB | Administrator and permissions only; no example content |

The commands resolve paths relative to this checkout, even when invoked from another folder. They never implicitly load the root `.env` or the other environment's env file. Exported shell variables still take precedence over env-file values under standard Compose rules; unset conflicting exports before deployment. Do not merge the local and live Compose files with multiple `-f` arguments.

## Local

```sh
cp .env.local.example .env.local  # optional; preserve an existing file
./docker-local up -d --build
./docker-local ps
```

Website: `http://localhost:13000`; API docs: `http://localhost:18000/docs`.
Readiness: `http://localhost:18000/api/v1/ready`.
The root `.env.local` contains Compose port settings; `frontend/.env.local` and `backend/.env` are for running those applications on the host. Production Docker build contexts exclude all of these env files.

## First live deployment

Use a Linux server with Docker and Compose installed. Point the `SITE_HOST` and `SITE_APEX` DNS records to it and allow inbound TCP 80/443 (UDP 443 is optional for HTTP/3). Ensure existing web servers do not occupy those ports. Caddy obtains and renews HTTPS certificates for the configured domains; DNS and public reachability are needed for issuance.

The 2026-11-02 security update pins Next.js 16.4.3, Zod 4.6.7 and matching patched test tooling. The production npm audit reports zero findings; the complete dependency tree has no high/critical findings (16 moderate development-only findings remain). CI checks both audit gates on every change. Successful Docker health checks establish startup and connectivity; rerun audits before future releases as advisories change.

```sh
./scripts/init-prod-env.sh
```

The initializer requires OpenSSL, creates `.env.prod` with mode 600 and three distinct random 256-bit secrets, and refuses to overwrite an existing file. It never prints secrets. Run it on the live server, not on your laptop for later committing. If `.env.prod` already exists, preserve it and review its values instead.

Edit `.env.prod` with the real domain names, certificate email and admin email. The generated admin password is stored in this private file. Keep the database password hexadecimal so it is safe in the connection URL. Do not reuse local credentials or copy the local database to live. Configure SMTP/integration credentials only for services you use. Never commit `.env.prod` or paste it into deployment logs.

```sh
./docker-prod config --quiet
./docker-prod up -d --build --wait --wait-timeout 180
./docker-prod ps
curl --fail https://www.opektra.com/api/v1/ready  # replace with SITE_HOST
curl --fail --head https://opektra.com/  # apex should redirect to SITE_HOST
```

`config --quiet` validates required values without printing secrets. Production also rejects the default signing keys, admin passwords outside 16–72 UTF-8 bytes, and non-HTTPS site URLs. Both applications run as non-root users. Health checks gate startup on the database, Redis, API and website. Migrations run on backend startup; the media directory, database, Redis and HTTPS certificates use persistent volumes. Containers restart automatically unless explicitly stopped.

Admin login is at `https://SITE_HOST/admin/login`, using the credentials from `.env.prod`. Bootstrap creates the admin only if that email does not exist. Changing `ADMIN_PASSWORD` later does not change an existing account's password. Changing `POSTGRES_PASSWORD` in the file also does not rotate the password inside an existing PostgreSQL volume; coordinate any credential rotation with the database/account itself.

Optional `NEXT_PUBLIC_NOINDEX=true` prevents indexing a staging deployment. Public URL and indexing values are compiled into the frontend image: rebuild after changing them. TLS issuance and the actual server's firewall/DNS need verification on the destination server; a local container check cannot establish them.

The public company's canonical URL is currently `https://www.opektra.com` in its brand configuration. Staging pages keep that live canonical. Changing `SITE_HOST` alone does not change this brand canonical; moving the company to a different public domain also requires updating its frontend brand configuration.

## Update and backup

Before an update, save the database and uploaded media to a private backup location, then copy those backups off the server. Keep `.env.prod` separately secured for recovery.

```sh
backup_dir="backups/$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$backup_dir"
chmod 700 backups "$backup_dir"
./docker-prod exec -T db pg_dump -U opektra -d opektra --format=custom > "$backup_dir/database.dump"
./docker-prod run --rm --no-deps --entrypoint tar backend -C /data/media -czf - . > "$backup_dir/media.tar.gz"
chmod 600 "$backup_dir/database.dump" "$backup_dir/media.tar.gz"
git pull --ff-only
./docker-prod up -d --build --wait --wait-timeout 180
./docker-prod logs --tail 100 backend frontend proxy
```

For consistent backups while content is being changed, pause writes during backup. Arrange regular off-server backups and a restore rehearsal before relying on live data. Roll back code to a known release and rebuild if needed; database migrations may require restoring the matching backup rather than simply using older code.

Use `./docker-prod down` to stop the stack while retaining data. **Do not use `down -v` on live:** it deletes the project's persistent data and certificates. Local commands operate on `portfolio` and do not manage the live volumes.
