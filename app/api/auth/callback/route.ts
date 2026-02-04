import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/auth/signin?error=no_code", request.url));
  }

  // The actual OAuth handling is done by NextAuth
  // This is just a fallback/logging route
  return NextResponse.redirect(new URL("/dashboard", request.url));
}