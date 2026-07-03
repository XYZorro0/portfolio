import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Serve the apex→www redirect from the deployment instead of a Vercel
// domain-level redirect. A next.config `redirects()` entry can't carry
// response headers, and hstspreload.org requires the full HSTS directive
// set on the apex redirect itself.
export function proxy(request: NextRequest) {
  // Vercel's proxy layer can surface the visitor-facing host in
  // x-forwarded-host rather than host, so check both (and ignore ports).
  const hosts = [
    request.headers.get("x-forwarded-host"),
    request.headers.get("host"),
    request.nextUrl.hostname,
  ].map((h) => h?.split(":")[0]);
  if (hosts.includes("niketgupta.com")) {
    const url = new URL(request.url);
    url.protocol = "https:";
    url.host = "www.niketgupta.com";
    url.port = "";
    const response = NextResponse.redirect(url, 308);
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
    return response;
  }
  return NextResponse.next();
}
