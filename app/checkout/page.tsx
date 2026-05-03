import Link from "next/link";
import Background3D from "@/components/Background3D";
import Nav from "@/components/Nav";
import { PLANS, getPlan } from "@/lib/plans";
import CheckoutClient from "./CheckoutClient";

export default function CheckoutPage({
  searchParams,
}: {
  searchParams: { plan?: string; user?: string };
}) {
  const planId = searchParams.plan ?? "trial";
  const userId = searchParams.user;
  const plan = getPlan(planId) ?? PLANS[0];

  return (
    <main className="relative min-h-screen">
      <Background3D />
      <Nav />
      <section className="mx-auto max-w-3xl px-5 py-12">
        <div className="rounded-3xl bg-white/80 p-8 shadow-soft ring-1 ring-emerald-100 md:p-12">
          <h1 className="text-3xl font-extrabold md:text-4xl">Ödeme</h1>
          <p className="mt-2 text-slate-700">
            Seçtiğin plan: <span className="font-semibold">{plan.nameTr}</span>
          </p>

          <div className="mt-8 grid gap-3">
            {PLANS.map((p) => (
              <Link
                key={p.id}
                href={`/checkout?plan=${p.id}${userId ? `&user=${userId}` : ""}`}
                className={`flex items-center justify-between rounded-2xl border p-5 transition ${
                  p.id === plan.id
                    ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-300"
                    : "border-slate-200 bg-white hover:border-emerald-200"
                }`}
              >
                <div>
                  <div className="font-semibold">{p.nameTr}</div>
                  <div className="text-sm text-slate-600">{p.taglineTr}</div>
                </div>
                <div className="text-xl font-bold">
                  {p.priceTry === 0 ? "Ücretsiz" : `${p.priceTry}₺`}
                </div>
              </Link>
            ))}
          </div>

          <CheckoutClient plan={plan} userId={userId} />
        </div>
      </section>
    </main>
  );
}
