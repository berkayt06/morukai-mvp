import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { normalizePhone } from "@/lib/whatsapp";

export const runtime = "nodejs";

const Body = z.object({
  fullName: z.string().min(2),
  phoneNumber: z.string().min(6),
  age: z.number().int().min(10).max(120).nullable().optional(),
  goal: z.string().min(2),
  currentSituation: z.string().optional().nullable(),
  preferredTone: z.string().min(2),
  language: z.string().default("tr"),
  timezone: z.string().default("Europe/Istanbul"),
  dailyMessageTime: z.string().regex(/^\d{2}:\d{2}$/),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;
  const phone = normalizePhone(data.phoneNumber);

  try {
    const user = await prisma.user.upsert({
      where: { phoneNumber: phone },
      create: {
        fullName: data.fullName,
        phoneNumber: phone,
        age: data.age ?? null,
        goal: data.goal,
        currentSituation: data.currentSituation ?? null,
        preferredTone: data.preferredTone,
        language: data.language,
        timezone: data.timezone,
        dailyMessageTime: data.dailyMessageTime,
      },
      update: {
        fullName: data.fullName,
        age: data.age ?? null,
        goal: data.goal,
        currentSituation: data.currentSituation ?? null,
        preferredTone: data.preferredTone,
        language: data.language,
        timezone: data.timezone,
        dailyMessageTime: data.dailyMessageTime,
      },
    });
    return NextResponse.json({ user });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
