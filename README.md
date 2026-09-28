# nimbusdesk-web

Admin/booking dashboard for the [NimbusDesk](https://github.com/eliangilsierra/nimbusdesk-infra) system. Talks to the backend **only through the API Gateway** — it never calls a backend service directly.

## Stack

- Angular 17 (standalone components, functional interceptors/guards, no NgModules)
- Plain `HttpClient` + a functional interceptor that attaches the JWT to every request
- Served through Nginx in Docker

## Screens

- **Login** (`/login`) — sign in or register against `nimbusdesk-identity-service` (via the gateway's public `/api/identity/auth/**` routes)
- **Bookings** (`/bookings`, guarded) — check a room's availability, create a booking, look one up by id, cancel it

Rooms are hardcoded from the fixed seed in `nimbusdesk-booking-service` (`Aurora`/`Borealis`/`Comet`, ids `1`/`2`/`3`) — there is no "list rooms" endpoint yet, so this stays a small, honest limitation of v1 rather than a fake dropdown backed by nothing.

## Configuration

The gateway's base URL is set at build time in `src/environments/environment.ts` (`apiBaseUrl`, defaults to `http://localhost:8080/api`). There is no runtime env-var override in this v1 — that's a Config Server-shaped problem, deliberately left for v2 (see `nimbusdesk-infra` ROADMAP.md).

## Run locally

Requires the backend stack up (see `nimbusdesk-infra`'s `docker-compose.yml`), then:

```bash
npm install
npm start
```

Or with Docker:

```bash
docker build -t nimbusdesk-web .
docker run -p 4200:80 nimbusdesk-web
```

## Tests

```bash
npm test -- --watch=false --browsers=ChromeHeadless
```

## How it fits in

Part of the NimbusDesk v1 system. See [`nimbusdesk-infra`](https://github.com/eliangilsierra/nimbusdesk-infra) for the full architecture, ADRs and roadmap.
