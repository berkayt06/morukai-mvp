import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPaytrCallback } from "@/lib/paytr";
import { getPlan } from "@/lib/plans";

export const runtime = "nodejs";

// PayTR sends an x-www-form-urlencoded POST. Must respond with the literal text "OK".
export async function POST(req: Request) {
  const formData = await req.formData();
  const merchantOid = String(formData.get("merchant_oid") ?? "");
  const status = String(formData.get("status") ?? "");
  const totalAmount = String(formData.get("total_amount") ?? "");
  const hash = String(formData.get("hash") ?? "");

  const valid = verifyPaytrCallback({ merchantOid, status, totalAmount, hash });
  if (!valid) {
    return new Response("PAYTR notification failed: bad hash", { status: 400 });
  }

  const sub = await prisma.subscription.findFirst({
    where: { providerSubscriptionId: merchantOid },
  });
  if (!sub) return new Response("OK");

  const plan = getPlan(sub.plan);
  if (status === "success") {
    const now = new Date();
    const end = plan
      ? new Date(now.getTime() + plan.intervalDays * 86400 * 1000)
      : null;
    await prisma.subscription.update({
      where: { id: sub.id },
      data: {
        status: "active",
        currentPeriodStart: now,
        currentPeriodEnd: end,
      },
    });
    await prisma.user.update({
      where: { id: sub.userId },
      data: {
        subscriptionStatus: "active",
        isActive: true,
        paytrSubscriptionId: merchantOid,
      },
    });
  } else {
    await prisma.subscription.update({
      where: { id: sub.id },
      data: { status: "canceled" },
    });
    await prisma.user.update({
      where: { id: sub.userId },
      data: { subscriptionStatus: "canceled", isActive: false },
    });
  }

  return new Response("OK");
}
