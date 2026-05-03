import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseInbound, sendWhatsAppText, normalizePhone } from "@/lib/whatsapp";
import { generateMorukaiReply, historyFromMessages } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Webhook verification — Meta calls GET with hub.mode/hub.verify_token/hub.challenge.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN && challenge) {
    return new Response(challenge, { status: 200 });
  }
  return new Response("forbidden", { status: 403 });
}

export async function POST(req: Request) {
  const payload = await req.json().catch(() => ({}));
  const inbound = parseInbound(payload);

  // Always 200 OK to Meta — process async-ish but await to ensure logs in dev.
  if (!inbound) return NextResponse.json({ ok: true });

  const phone = normalizePhone(inbound.from);

  // Find or create a lightweight user (so unknown inbound numbers don't crash).
  let user = await prisma.user.findUnique({ where: { phoneNumber: phone } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        phoneNumber: phone,
        fullName: inbound.profileName || "Moruk",
        goal: "Genel yaşam motivasyonu",
        preferredTone: "Kanka gibi",
        language: "tr",
      },
    });
  }

  // Save inbound message
  await prisma.message.create({
    data: {
      userId: user.id,
      direction: "inbound",
      channel: "whatsapp",
      content: inbound.text,
      aiGenerated: false,
    },
  });

  if (!user.isActive) {
    return NextResponse.json({ ok: true, skipped: "user inactive" });
  }

  try {
    const history = await prisma.message.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const reply = await generateMorukaiReply({
      user,
      history: historyFromMessages(history.reverse().slice(0, -1)),
      userMessage: inbound.text,
    });

    const sendRes = await sendWhatsAppText(phone, reply);

    await prisma.message.create({
      data: {
        userId: user.id,
        direction: "outbound",
        channel: "whatsapp",
        content: reply,
        aiGenerated: true,
      },
    });

    return NextResponse.json({ ok: true, sent: sendRes.ok });
  } catch (e: any) {
    console.error("webhook handler error", e);
    return NextResponse.json({ ok: true, error: e.message });
  }
}
