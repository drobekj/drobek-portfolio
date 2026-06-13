import { NextRequest, NextResponse } from "next/server";

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="AI Job Agent Admin"',
    },
  });
}

export function proxy(request: NextRequest) {
  const adminUser = process.env.ADMIN_USER;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUser || !adminPassword) {
    return new NextResponse("Admin credentials are not configured", {
      status: 500,
    });
  }

  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Basic ")) {
    return unauthorized();
  }

  const encodedCredentials = authHeader.slice("Basic ".length);
  const decodedCredentials = atob(encodedCredentials);

  const separatorIndex = decodedCredentials.indexOf(":");

  if (separatorIndex === -1) {
    return unauthorized();
  }

  const username = decodedCredentials.slice(0, separatorIndex);
  const password = decodedCredentials.slice(separatorIndex + 1);

  if (username !== adminUser || password !== adminPassword) {
    return unauthorized();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
  "/ml-ds/job-agent/admin/:path*",
  "/api/job-agent/:path*",
],
};