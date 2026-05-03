import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateMorukaiReply, historyFromMessages } from "@/lib/ai";

export const runtime = "nodejs";

const Body = z.object({
  userId: z.string(),
  message: z.string().min(1),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: parsed.data.userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const history = await prisma.message.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const reply = await generateMorukaiReply({
    user,
    history: historyFromMessages(history.reverse()),
    userMessage: parsed.data.message,
  });

  return NextResponse.json({ reply });
}
