import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthorized } from "@/lib/admin";

export const runtime = "nodejs";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!isAdminAuthorized()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const allowed = [
    "fullName",
    "goal",
    "preferredTone",
    "language",
    "timezone",
    "dailyMessageTime",
    "isActive",
    "subscriptionStatus",
    "currentSituation",
    "age",
  ] as const;

  const data: Record<string, any> = {};
  for (const k of allowed) {
    if (k in body) data[k] = body[k];
  }

  const user = await prisma.user.update({ where: { id: params.id }, data });
  return NextResponse.json({ user });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (!isAdminAuthorized()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.user.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
