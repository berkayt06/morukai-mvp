"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    setLoading(false);
    if (res.ok) router.push("/admin");
    else setError("Yanlış parola");
  }

  return (
    <form onSubmit={submit} className="mt-6 grid gap-4">
      <input
        type="password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        placeholder="Admin parolası"
        className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
      />
      {error && <div className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>}
      <button
        disabled={loading}
        className="rounded-full bg-emerald-500 px-6 py-3 font-bold text-white shadow-glow disabled:opacity-60"
      >
        {loading ? "..." : "Giriş yap"}
      </button>
    </form>
  );
}
