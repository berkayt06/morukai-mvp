import Background3D from "@/components/Background3D";
import Nav from "@/components/Nav";
import OnboardingForm from "./OnboardingForm";

export default function OnboardingPage({
  searchParams,
}: {
  searchParams: { plan?: string };
}) {
  const plan = searchParams.plan ?? "trial";
  return (
    <main className="relative min-h-screen">
      <Background3D />
      <Nav />
      <section className="mx-auto max-w-3xl px-5 py-12">
        <div className="rounded-3xl bg-white/80 p-8 shadow-soft ring-1 ring-emerald-100 md:p-12">
          <h1 className="text-3xl font-extrabold md:text-4xl">Tanışalım moruk 👋</h1>
          <p className="mt-2 text-slate-700">
            Birkaç soruyla seni tanıyalım, sonra WhatsApp&apos;ta seninle konuşmaya başlayalım.
          </p>
          <OnboardingForm initialPlan={plan} />
        </div>
      </section>
    </main>
  );
}
