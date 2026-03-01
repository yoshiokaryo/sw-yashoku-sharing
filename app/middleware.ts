import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 認証はモックのため /app は未ログインでもアクセス可能
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"],
};
