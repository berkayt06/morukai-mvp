import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppText } from "@/lib/whatsapp";
import { isAdminAuthorized } from "@/lib/admin";

export const runtime = "nodejs";

const Body = z.object({
  userId: z.string().optional(),
  to: z.string().optional(),
  text: z.string().min(1),
});

export async function POST(req: Request) {
  if (!isAdminAuthorized()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  let to = parsed.data.to;
  let userId = parsed.data.userId;

  if (userId) {
    const u = await prisma.user.findUnique({ where: { id: userId } });
    if (!u) return NextResponse.json({ error: "User not found" }, { status: 404 });
    to = u.phoneNumber;
  }

  if (!to) return NextResponse.json({ error: "Missing 'to' or 'userId'" }, { status: 400 });

  const res = await sendWhatsAppText(to, parsed.data.text);

  if (userId && res.ok) {
    await prisma.message.create({
      data: {
        userId,
        direction: "outbound",
        channel: "whatsapp",
        content: parsed.data.text,
        aiGenerated: false,
      },
    });
  }

  return NextResponse.json(res);
}
