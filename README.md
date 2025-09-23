# Cleo Dashboard

The dashboard & management surface for the Cleo Discord bot.

## Stack

- **Next.js (App Router)**
- **Better Auth** (Discord OAuth only) with Prisma adapter
- **Prisma + Accelerate** (edge client variant)
- **jstack** for typed API routers & client
- **Stripe** (subscriptions + message bundle top‑ups)
- **React Query** for client state/fetching
- **Tailwind / Radix UI** for styling + components

## Auth Model

Better Auth provides the session + account data. A provisioning hook claims / links a domain `Users` record by Discord ID (migrated from Clerk).

Patterns:

| Scenario               | Use                                                 | Example                  |
| ---------------------- | --------------------------------------------------- | ------------------------ |
| Server Component / RSC | `auth.api.getSession({ headers: await headers() })` | `app/(root)/page.tsx`    |
| Client Component       | `const { useSession } = authClient; useSession()`   | `app/dashboard/page.tsx` |
| API / Router (jstack)  | Middleware attaches session & domain user           | `server/jstack.ts`       |

Never call the React client (`authClient`) from a server component. Never import the server `auth` inside a file marked with `"use client"` unless you are only exporting constants (avoid it entirely for clarity).

## Directory Highlights

- `src/app/(auth)` – Auth related pages (sign-in, sign-up, account, welcome)
- `src/server` – jstack initialization + routers
- `src/lib/betterAuth` – Better Auth factory & helpers (token refresh)
- `prisma/schema.prisma` – Domain + Better Auth models

## Session Flow

1. User hits `/auth/sign-in` → Discord OAuth via Better Auth social provider.
2. On first successful login the Better Auth `events.user.created` hook links/creates `Users` row.
3. Client components reactively consume session from `authClient.useSession()`.
4. Server components request the session on demand (no client hook usage).

## Development

Install & seed (Stripe products):

```bash
pnpm install
pnpm dev
```

The `postinstall` script pushes the schema, generates the client and seeds Stripe product templates.

Environment (minimum):

```
DATABASE_URL=
BETTER_AUTH_SECRET=
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_BOT_TOKEN=
STRIPE_SECRET_KEY=
STRIPE_PUBLIC_KEY=
NEXT_PUBLIC_SITE_URL=
# COOKIE_DOMAIN only in production and without protocol/port, e.g.
# COOKIE_DOMAIN=cleoai.cloud
# (omit entirely in local dev; never use localhost or include https://)
```

### Auth Cookie Domain (Important)

To share Better Auth cookies between the frontend at `https://cleoai.cloud` and the API at `https://api.cleoai.cloud` you must:

1. Set `COOKIE_DOMAIN=cleoai.cloud` (exact registrable domain; no protocol, no port) in production environments (Vercel + Cloudflare Worker env).
2. Ensure `NEXT_PUBLIC_SITE_URL` matches the browser origin of the Next.js app (e.g. `https://cleoai.cloud`).
3. Do NOT set `COOKIE_DOMAIN` for localhost development. Browsers reject a Domain attribute containing `localhost`; the code auto‑omits it when detected.
4. Keep `sameSite=lax` (safe and still sends cookies to the subdomain). `secure` is automatically enforced in production.

If the domain is misconfigured (e.g. includes `https://`, a port, or a subdomain like `api.cleoai.cloud`) the auth factory logs a warning: `[auth:cookies] ...` in server logs and falls back to a safer behavior to avoid completely losing login capability.

Verify after deploy:

- Inspect any Better Auth session cookie in DevTools → Application → Cookies → https://cleoai.cloud
- It should show `Domain=.cleoai.cloud` (browser may display without leading dot) and `Secure ✓`, `SameSite Lax`.
- Requests from the browser to `https://api.cleoai.cloud` should now include that cookie automatically.

## Coding Conventions

- Use cookie‑based auth for jstack client calls — no manual bearer except for bot ↔ API.
- Keep dashboard pages as client components only if they need live interactivity (React Query, optimistic UI, etc.).
- Prefer server components for static/SEO or landing content (e.g. root page) with `auth.api.getSession`.

## Adding New Protected Pages

Server Component:

```ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function ProtectedPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/auth/sign-in");
  return <div>Hi {session.user.name}</div>;
}
```

Client Component:

```tsx
"use client";
import { authClient } from "@/lib/authClient";

export function UserBadge() {
  const { useSession } = authClient;
  const { data } = useSession();
  return <span>{data?.user.name}</span>;
}
```

## Migrated From Clerk

- Removed all Clerk middleware, providers, token calls.
- Replaced bearer token fetches with cookie‑based session access.
- Added Discord token refresh helper for API routes.

## Future Enhancements

- Multi-session management UI (revoke others)
- Role caching in session payload to avoid DB lookup in middleware for staff routes
- Additional analytics dashboards

---

Built with ❤️ on [jstack](https://jstack.app) + Better Auth.
