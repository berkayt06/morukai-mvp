"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const GOALS = [
  "Genel yaşam motivasyonu",
  "Spor ve fit görünüm",
  "Ders / sınav disiplini",
  "Sigara azaltma / bırakma motivasyonu",
  "Daha düzenli bir hayat",
  "İş / kariyer motivasyonu",
  "Özel hedef",
];

const TONES = [
  "Samimi ve eğlenceli",
  "Yerine göre sert ama motive edici",
  "Sakin ve destekleyici",
  "Kanka gibi",
  "Daha profesyonel",
];

const TIMEZONES = [
  "Europe/Istanbul",
  "Europe/London",
  "Europe/Berlin",
  "America/New_York",
  "America/Los_Angeles",
  "Asia/Dubai",
];

export default function OnboardingForm({ initialPlan }: { initialPlan: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    age: "",
    goal: GOALS[0],
    currentSituation: "",
    preferredTone: TONES[3],
    language: "tr",
    timezone: "Europe/Istanbul",
    dailyMessageTime: "09:00",
  });

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          age: form.age ? Number(form.age) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Bir şeyler ters gitti");
      router.push(`/checkout?plan=${initialPlan}&user=${data.user.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const labelCls = "block text-sm font-semibold text-slate-800";
  const inputCls =
    "mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200";

  return (
    <form className="mt-8 grid gap-5" onSubmit={onSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className={labelCls}>Ad Soyad</label>
          <input className={inputCls} required value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="Ahmet Yılmaz" />
        </div>
        <div>
          <label className={labelCls}>WhatsApp Numarası</label>
          <input className={inputCls} required value={form.phoneNumber} onChange={(e) => update("phoneNumber", e.target.value)} placeholder="+905xxxxxxxxx" />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className={labelCls}>Yaş (opsiyonel)</label>
          <input className={inputCls} type="number" min={10} max={120} value={form.age} onChange={(e) => update("age", e.target.value)} placeholder="28" />
        </div>
        <div>
          <label className={labelCls}>Dil</label>
          <select className={inputCls} value={form.language} onChange={(e) => update("language", e.target.value)}>
            <option value="tr">Türkçe</option>
            <option value="en">English</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Zaman dilimi</label>
          <select className={inputCls} value={form.timezone} onChange={(e) => update("timezone", e.target.value)}>
            {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls}>Ana hedefin</label>
        <select className={inputCls} value={form.goal} onChange={(e) => update("goal", e.target.value)}>
          {GOALS.map((g) => <option key={g}>{g}</option>)}
        </select>
      </div>

      <div>
        <label className={labelCls}>Şu an hayatın nasıl gidiyor? (kısa)</label>
        <textarea
          className={inputCls}
          rows={3}
          value={form.currentSituation}
          onChange={(e) => update("currentSituation", e.target.value)}
          placeholder="Mesela: 'Sınava 2 ay var, motivasyonum dağınık'"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className={labelCls}>Tercih ettiğin ton</label>
          <select className={inputCls} value={form.preferredTone} onChange={(e) => update("preferredTone", e.target.value)}>
            {TONES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Günlük mesaj saati</label>
          <input className={inputCls} type="time" value={form.dailyMessageTime} onChange={(e) => update("dailyMessageTime", e.target.value)} />
        </div>
      </div>

      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="mt-3 rounded-full bg-emerald-500 px-6 py-3 font-bold text-white shadow-glow transition hover:bg-emerald-600 disabled:opacity-60"
      >
        {loading ? "Kaydediliyor..." : "Devam et"}
      </button>
      <p className="text-xs text-slate-500">
        Devam ederek MorukAI&apos;nin bir doktor/terapist/psikolog olmadığını kabul ediyorsun.
      </p>
    </form>
  );
}
