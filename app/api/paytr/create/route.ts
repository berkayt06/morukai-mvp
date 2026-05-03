import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getPlan } from "@/lib/plans";
import { createPaytrToken } from "@/lib/paytr";

export const runtime = "nodejs";

const Body = z.object({
  userId: z.string(),
  planId: z.string(),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const { userId, planId } = parsed.data;
  const plan = getPlan(planId);
  if (!plan) return NextResponse.json({ error: "Unknown plan" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const merchantOid = `morukai${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Trial — no payment, just mark user as trial.
  if (plan.priceTry === 0) {
    const now = new Date();
    const end = new Date(now.getTime() + plan.intervalDays * 86400 * 1000);
    await prisma.subscription.create({
      data: {
        userId: user.id,
        provider: "trial",
        status: "trial",
        plan: plan.id,
        currentPeriodStart: now,
        currentPeriodEnd: end,
      },
    });
    await prisma.user.update({
      where: { id: user.id },
      data: { subscriptionStatus: "trial", isActive: true },
    });
    return NextResponse.json({ skip: true });
  }

  // PayTR — if creds missing, fall back to a "skip" so the dev flow still works.
  const result = await createPaytrToken({
    merchantOid,
    email: `user-${user.id}@morukai.app`,
    amountKurus: plan.priceTry * 100,
    userName: user.fullName,
    userAddress: "n/a",
    userPhone: user.phoneNumber,
    basket: [[plan.nameTr, String(plan.priceTry), 1]],
    userIp: (req.headers.get("x-forwarded-for")?.split(",")[0] ?? "127.0.0.1").trim(),
    okUrl: `${siteUrl}/success?user=${user.id}&plan=${plan.id}`,
    failUrl: `${siteUrl}/checkout?plan=${plan.id}&user=${user.id}&failed=1`,
  });

  if (!result.ok) {
    if (process.env.NODE_ENV !== "production" && result.error?.includes("Missing PayTR")) {
      // Dev fallback — pretend payment succeeded.
      const now = new Date();
      const end = new Date(now.getTime() + plan.intervalDays * 86400 * 1000);
      await prisma.subscription.create({
        data: {
          userId: user.id,
          provider: "paytr",
          status: "active",
          plan: plan.id,
          providerSubscriptionId: merchantOid,
          currentPeriodStart: now,
          currentPeriodEnd: end,
        },
      });
      await prisma.user.update({
        where: { id: user.id },
        data: { subscriptionStatus: "active", isActive: true, paytrSubscriptionId: merchantOid },
      });
      return NextResponse.json({ skip: true, dev: true });
    }
    return NextResponse.json({ error: result.error || "PayTR failed" }, { status: 502 });
  }

  // Stash a pending subscription so the webhook can finalize it.
  await prisma.subscription.create({
    data: {
      userId: user.id,
      provider: "paytr",
      status: "past_due",
      plan: plan.id,
      providerSubscriptionId: merchantOid,
    },
  });

  return NextResponse.json({ token: result.token, merchantOid });
}
