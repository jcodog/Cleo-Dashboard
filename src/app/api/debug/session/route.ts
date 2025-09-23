import { cookies, headers } from "next/headers";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const hdrs = await headers();
  const session = await auth.api.getSession({ headers: hdrs });
  const all = cookies().getAll();
  const filtered = all.filter((c) => c.name.toLowerCase().includes("auth"));
  return new Response(
    JSON.stringify(
      {
        hasSession: !!session,
        userId: session?.user?.id || null,
        cookieNames: all.map((c) => c.name),
        authLikeCookies: filtered,
      },
      null,
      2
    ),
    {
      status: 200,
      headers: { "content-type": "application/json" },
    }
  );
}
