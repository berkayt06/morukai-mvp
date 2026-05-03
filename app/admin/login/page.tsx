import Background3D from "@/components/Background3D";
import LoginForm from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="relative min-h-screen">
      <Background3D />
      <section className="mx-auto flex max-w-md items-center justify-center px-5 py-24">
        <div className="w-full rounded-3xl bg-white/85 p-8 shadow-glow ring-1 ring-emerald-100">
          <h1 className="text-2xl font-extrabold">Admin girişi</h1>
          <p className="mt-1 text-sm text-slate-600">Sadece yöneticiler için.</p>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
