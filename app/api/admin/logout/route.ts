import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin";

export const runtime = "nodejs";

export async function POST() {
  const res = NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
