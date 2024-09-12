import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"; // Untuk mendapatkan token dari next-auth

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  if (request.nextUrl.pathname.startsWith("/api/services")) {
    if (!token) {
      return NextResponse.json({
        status: 401,
        message: "Unauthorized",
      });
    }
  }

  // Lanjutkan ke middleware default next-auth
  return NextResponse.next();
}
