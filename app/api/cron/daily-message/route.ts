import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateDailyMessage } from "@/lib/ai";
import { sendWhatsAppText } from "@/lib/whatsapp";
import { isAdminAuthorized } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Auth: either Vercel cron header (with CRON_SECRET via Authorization: Bearer ...),
// or admin cookie for manual triggering.
function authorize(req: Request): boolean {
  const auth = req.headers.get("authorization");
  if (process.env.CRON_SECRET && auth === `Bearer ${process.env.CRON_SECRET}`) return true;
  if (isAdminAuthorized()) return true;
  return false;
}

// Returns the current HH:mm in a given IANA timezone.
function currentHHmm(tz: string): string {
  try {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return fmt.format(new Date()); // HH:mm
  } catch {
    return new Date().toISOString().slice(11, 16);
  }
}

export async function GET(req: Request) {
  if (!authorize(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const force = url.searchParams.get("force") === "1";
  const onlyUserId = url.searchParams.get("userId");

  const where: any = { isActive: true, subscriptionStatus: { in: ["active", "trial"] } };
  if (onlyUserId) where.id = onlyUserId;

  const users = await prisma.user.findMany({ where });

  const results: any[] = [];
  for (const u of users) {
    const localHHmm = currentHHmm(u.timezone || "Europe/Istanbul");
    if (!force && localHHmm !== u.dailyMessageTime) {
      results.push({ user: u.id, skipped: true, localHHmm, target: u.dailyMessageTime });
      continue;
    }
    try {
      const text = await generateDailyMessage(u, "morning");
      const send = await sendWhatsAppText(u.phoneNumber, text);
      await prisma.message.create({
        data: {
          userId: u.id,
          direction: "outbound",
          channel: "whatsapp",
          content: text,
          aiGenerated: true,
        },
      });
      await prisma.scheduledMessage.create({
        data: {
          userId: u.id,
          messageType: "morning",
          scheduledTime: new Date(),
          status: send.ok ? "sent" : "failed",
          sentAt: new Date(),
        },
      });
      results.push({ user: u.id, ok: send.ok });
    } catch (e: any) {
      results.push({ user: u.id, error: e.message });
    }
  }

  return NextResponse.json({ count: results.length, results });
}

export const POST = GET;
