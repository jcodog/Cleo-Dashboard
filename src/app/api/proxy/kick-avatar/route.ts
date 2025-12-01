import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = new Set(["files.kick.com"]);
const DEFAULT_CACHE_HEADER = "public, max-age=300, stale-while-revalidate=900";

export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get("url");
  if (!urlParam) {
    return NextResponse.json(
      { error: "Missing url parameter" },
      { status: 400 }
    );
  }

  let target: URL;
  try {
    target = new URL(urlParam);
  } catch {
    return NextResponse.json({ error: "Invalid target URL" }, { status: 400 });
  }

  if (!ALLOWED_HOSTS.has(target.hostname)) {
    return NextResponse.json({ error: "Host not permitted" }, { status: 403 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      headers: { Accept: "image/avif,image/webp,image/*" },
      cache: "no-store",
      redirect: "follow",
    });
  } catch (error) {
    console.error("[kick-avatar-proxy] upstream fetch failed", error);
    return NextResponse.json(
      { error: "Unable to reach upstream" },
      { status: 502 }
    );
  }

  if (!upstream.ok) {
    return NextResponse.json(
      { error: `Upstream responded with ${upstream.status}` },
      { status: upstream.status }
    );
  }

  const contentType =
    upstream.headers.get("content-type") ?? "application/octet-stream";
  const buffer = await upstream.arrayBuffer();

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "content-type": contentType,
      "cache-control": DEFAULT_CACHE_HEADER,
      "access-control-allow-origin": "*",
    },
  });
}
