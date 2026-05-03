"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Plan } from "@/lib/plans";

export default function CheckoutClient({ plan, userId }: { plan: Plan; userId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [iframeToken, setIframeToken] = useState<string | null>(null);

  async function startCheckout() {
    if (!userId) {
      router.push("/onboarding");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/paytr/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, planId: plan.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Ödeme başlatılamadı");
      if (data.skip) {
        router.push(`/success?user=${userId}&plan=${plan.id}`);
        return;
      }
      setIframeToken(data.token);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (iframeToken) {
    return (
      <div className="mt-8">
        <iframe
          src={`https://www.paytr.com/odeme/guvenli/${iframeToken}`}
          className="h-[700px] w-full rounded-2xl border border-slate-200"
        />
      </div>
    );
  }

  return (
    <div className="mt-8">
      {!userId && (
        <div className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Önce kısa onboarding&apos;i tamamlamalısın.
        </div>
      )}
      {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <button
        onClick={startCheckout}
        disabled={loading}
        className="w-full rounded-full bg-emerald-500 px-6 py-3 font-bold text-white shadow-glow transition hover:bg-emerald-600 disabled:opacity-60"
      >
        {plan.priceTry === 0
          ? "Ücretsiz başla"
          : loading
          ? "Yönlendiriliyorsun..."
          : `${plan.priceTry}₺ ile devam et`}
      </button>
      <p className="mt-3 text-xs text-slate-500">
        Ödemeler PayTR güvencesiyle işlenir. İstediğin an iptal edebilirsin.
      </p>
    </div>
  );
}
