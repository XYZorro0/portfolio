import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Serve the apex→www redirect from the deployment instead of a Vercel
// domain-level redirect. A next.config `redirects()` entry can't carry
// response headers, and hstspreload.org requires the full HSTS directive
// set on the apex redirect itself.
export function proxy(request: NextRequest) {
  const host = request.headers.get("host");
  if (host === "niketgupta.com") {
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
