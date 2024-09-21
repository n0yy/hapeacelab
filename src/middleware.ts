// File: src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware({
  locales: ["en", "id"],
  defaultLocale: "en",
});

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  // Check for authentication on specific routes
  if (request.nextUrl.pathname.startsWith("/api/services")) {
    if (!token) {
      return NextResponse.json({
        status: 401,
        message: "Unauthorized",
      });
    }
  }

  // Apply the internationalization middleware
  return intlMiddleware(request);
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
