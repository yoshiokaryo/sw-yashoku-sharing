import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getToken } from "next-auth/jwt";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

async function proxy(request: NextRequest, path: string[], method: string) {
  if (!API_BASE) {
    return NextResponse.json({ error: "API URL not configured" }, { status: 502 });
  }
  let token: string | null = null;
  try {
    const session = await auth();
    if (session) token = await getToken({ req: request, raw: true }) as string | null;
  } catch {
    // Auth 未設定時はトークンなしで続行
  }
  const url = `${API_BASE}/api/${path.join("/")}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const body = method !== "GET" && method !== "HEAD" ? await request.text() : undefined;
  const res = await fetch(url, { method, headers, body });
  const data = await res.text();
  return new NextResponse(data, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") ?? "application/json" },
  });
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await params;
  return proxy(request, path, "GET");
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await params;
  return proxy(request, path, "POST");
}
