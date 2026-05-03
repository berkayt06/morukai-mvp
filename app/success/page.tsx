import Link from "next/link";
import Background3D from "@/components/Background3D";
import Nav from "@/components/Nav";

export default function SuccessPage() {
  return (
    <main className="relative min-h-screen">
      <Background3D />
      <Nav />
      <section className="mx-auto max-w-2xl px-5 py-20 text-center">
        <div className="rounded-3xl bg-white/85 p-10 shadow-glow ring-1 ring-emerald-100">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-500 text-3xl text-white shadow-glow">
            ✓
          </div>
          <h1 className="mt-6 text-3xl font-extrabold md:text-4xl">Hoş geldin moruk!</h1>
          <p className="mt-3 text-slate-700">
            Aboneliğin hazır. Az sonra WhatsApp&apos;a sana ilk mesajı atıyorum.
            İstediğin an &quot;selam moruk&quot; yazabilirsin — ben buradayım.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/" className="rounded-full bg-slate-900 px-6 py-3 font-semibold text-white">
              Ana sayfa
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
