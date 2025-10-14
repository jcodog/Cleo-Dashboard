# Cleo Dashboard — AI agent instructions

These notes make you productive immediately in this repo. Keep changes small, follow the established patterns below, and reference the cited files.

## Big picture

- Two runtimes:
  - Next.js App Router UI at `src/app/**` (served at https://cleoai.cloud).
  - Cloudflare Worker API using jstack/Hono at `src/server/**` (served at https://api.cleoai.cloud, base path `/api`). See `wrangler.json` and `src/server/index.ts`.
- Auth: Better Auth (Discord + Twitch) with Prisma adapter. Cookie-based sessions are shared across subdomains via normalized cookie domain logic in `src/lib/betterAuth/factory.ts`.
- Data: Postgres via Prisma Accelerate edge client (`src/lib/prisma.ts`, schema in `prisma/schema.prisma`).
- Payments: Stripe. Customer creation/backfill happens during Better Auth account linking (see hooks in the auth factory).

## Architecture & data flow

- Server session (RSC/middleware): `auth.api.getSession({ headers })`. Never use `authClient` on the server.
- Client session: `authClient.useSession()` from `src/lib/authClient.ts` inside client components only.
- App → API calls: use the typed jstack client (`src/lib/client.ts`), base URL `${NEXT_PUBLIC_API_URL}/api`, `credentials: "include"` so cookies flow cross-domain via `SameSite=Lax`.
- API context (see `src/server/jstack.ts`):
  - `publicProcedure` injects `{ db, kv, stripe }`.
  - `authProcedure` adds Better Auth `{ auth, session, authUser }` from headers (cookie or bearer).
  - `dashProcedure` adds domain `ctx.user` (row in `Users`) and a fresh Discord `accessToken` (handles refresh); also auto-heals `discordId` linking.
  - `botProcedure` is bot-only; requires headers `Authorization: Bearer ${CLEO_API_KEY}` and `X-Discord-ID`; ensures/creates a `Users` row and includes `limits`/subs.
- Routers live in `src/server/routers/*` and are merged in `src/server/index.ts`. CORS is configured with `credentials: true` and common headers.

## Conventions & gotchas

- Do not import the server `auth` into client code or use `authClient` on the server.
- Cookies: `sameSite=lax`, `secure` in prod, and `cookies.domain` must be the registrable domain (e.g. `cleoai.cloud`). Never set `COOKIE_DOMAIN` locally (browsers reject `localhost`). See README “Auth Cookie Domain (Important)” and the normalization in `createAuth()`.
- Choose the right procedure when adding API routes:
  - Public read: `publicProcedure.get(...)`
  - User-required: `dashProcedure.get/post(...)` (gives `ctx.user` and a valid Discord token)
  - Bot-only: `botProcedure.post(...)` (with required headers)
- After creating a new router file, manually add it to the object in `src/server/index.ts`.
- Prisma: always use `ctx.db` inside procedures. The edge client is cached per-URL in `globalThis` (`getDb`); many reads use `cacheStrategy: { ttl: 60 }`.
- Stripe: use `ctx.stripe` injected by the base middleware. Account linking hooks already contain the customer create/backfill logic.
- KV: access via `ctx.kv` (`CLEO_KV` binding in `wrangler.json`).
- WebSockets: jstack sockets require Upstash Redis; set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` on the Worker.
- Staff routes: `src/middleware.ts` enforces session + DB role check (`Users.role === "staff"`).

## Develop & run

- Install: `pnpm install` (postinstall runs `prisma db push`, client generate, and seeds Stripe product templates).
- Run UI only: `pnpm dev` (Next at 3000). Run API only: `pnpm wrangler dev` (Worker at 8080). Run both: `pnpm start:dev` (see `mprocs.yaml`).
- Required env (see README): `DATABASE_URL`, `BETTER_AUTH_SECRET`, `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `DISCORD_BOT_TOKEN`, `STRIPE_SECRET_KEY`, `STRIPE_PUBLIC_KEY`, `NEXT_PUBLIC_SITE_URL`.
  - Critical: set `NEXT_PUBLIC_API_URL` to the API origin (e.g. `http://localhost:8080` in dev, `https://api.cleoai.cloud` in prod).
  - Only set `COOKIE_DOMAIN` in prod (registrable domain like `cleoai.cloud`, no protocol/port/subdomain).

## Quick examples

- Add a protected GET route:
  - `src/server/routers/example-router.ts`: `export const exampleRouter = j.router({ me: dashProcedure.get(({ c, ctx }) => c.json({ id: ctx.user.id })) });`
  - Merge in `src/server/index.ts`: add `example: exampleRouter`.
- Use session in an RSC page: `const s = await auth.api.getSession({ headers: await headers() }); if (!s) redirect("/sign-in");`
- Call API from a client component: `const res = await client.dash.profile.$get()` (cookies sent automatically).

## Where things live

- Next pages/layouts: `src/app/**`
- Auth server: `src/lib/betterAuth/*`, `src/lib/auth.ts`
- API composition: `src/server/index.ts`, procedures/middleware in `src/server/jstack.ts`, routers in `src/server/routers/*`
- Prisma: `prisma/schema.prisma`, client bootstrap in `src/lib/prisma.ts`
- Infra: `wrangler.json` (Workers + KV), `mprocs.yaml` (run UI+API together)

## Troubleshooting

- Auth cookies not sticking across domains:
  - Ensure `COOKIE_DOMAIN` is unset in local dev, and set to `cleoai.cloud` (no protocol/port/subdomain) in prod.
  - Verify `NEXT_PUBLIC_SITE_URL` matches the browser origin of the Next.js app and `NEXT_PUBLIC_API_URL` points to the API origin.
- API requests missing cookies:
  - Confirm the jstack client uses `credentials: "include"` and the API enables `credentials: true` CORS (see `src/server/index.ts`).
- “Unauthorized: Discord token invalid” from `dashProcedure`:
  - The Discord access token may be stale. The dash middleware auto-refreshes via `getDiscordAccessToken`; ensure Discord provider is linked and tokens exist on the Better Auth Account row.
- Local dev 3000 ↔ 8080 WebSockets:
  - WebSockets require the Worker (8080) and Upstash env; Next at 3000 doesn’t host WS. If needed, add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to Worker env.
- Stripe customer missing after login:
  - Check auth factory hooks and `STRIPE_SECRET_KEY`. Backfill runs on provider account creation/link; see console warnings if key is missing.
- Staff page redirects to dashboard:
  - Ensure the session resolves and `Users.role` is `staff` in the DB. Middleware performs an authoritative DB check.

## Context7 usage (MCP)

Always use context7 when I need code generation, setup or configuration steps, or library/API documentation. This means you should automatically use the Context7 MCP tools to resolve library id and get library docs without me having to explicitly ask.

---

If anything here is unclear (e.g., preferred procedure for a new endpoint, env expectations for a feature, or how cookies should be set in a new flow), tell me and I’ll refine this file right away.
