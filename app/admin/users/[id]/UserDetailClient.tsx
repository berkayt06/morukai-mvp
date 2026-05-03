"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface UserShape {
  id: string;
  fullName: string;
  phoneNumber: string;
  age?: number | null;
  goal: string;
  currentSituation?: string | null;
  preferredTone: string;
  language: string;
  timezone: string;
  dailyMessageTime: string;
  subscriptionStatus: string;
  isActive: boolean;
  createdAt: string;
}

interface MessageShape {
  id: string;
  direction: "inbound" | "outbound";
  content: string;
  aiGenerated: boolean;
  createdAt: string;
}

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

export default function UserDetailClient({
  user,
  messages,
}: {
  user: UserShape;
  messages: MessageShape[];
}) {
  const router = useRouter();
  const [u, setU] = useState(user);
  const [saving, setSaving] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [manualText, setManualText] = useState("");

  const update = (k: keyof UserShape, v: any) => setU((s) => ({ ...s, [k]: v }));

  async function save() {
    setSaving(true);
    setInfo(null);
    const res = await fetch(`/api/admin/users/${u.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: u.fullName,
        goal: u.goal,
        preferredTone: u.preferredTone,
        language: u.language,
        timezone: u.timezone,
        dailyMessageTime: u.dailyMessageTime,
        isActive: u.isActive,
        subscriptionStatus: u.subscriptionStatus,
      }),
    });
    setSaving(false);
    setInfo(res.ok ? "Kaydedildi" : "Hata oluştu");
    router.refresh();
  }

  async function deleteUser() {
    if (!confirm("Bu kullanıcıyı silmek istiyor musun?")) return;
    const res = await fetch(`/api/admin/users/${u.id}`, { method: "DELETE" });
    if (res.ok) router.push("/admin/users");
  }

  async function sendNow() {
    if (!manualText.trim()) return;
    const res = await fetch("/api/whatsapp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: u.id, text: manualText }),
    });
    setInfo(res.ok ? "Gönderildi" : "Gönderilemedi");
    setManualText("");
    router.refresh();
  }

  async function triggerDaily() {
    const res = await fetch(`/api/cron/daily-message?force=1&userId=${u.id}`);
    setInfo(res.ok ? "Günlük mesaj tetiklendi" : "Hata");
    router.refresh();
  }

  const inputCls = "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400";

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <section className="md:col-span-1 space-y-4">
        <div className="rounded-2xl bg-white/85 p-5 shadow-soft ring-1 ring-emerald-100">
          <h2 className="text-lg font-bold">Profil</h2>
          <div className="mt-3 grid gap-3 text-sm">
            <label className="grid gap-1">
              <span className="text-xs font-semibold text-slate-600">İsim</span>
              <input className={inputCls} value={u.fullName} onChange={(e) => update("fullName", e.target.value)} />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-semibold text-slate-600">Telefon</span>
              <input className={inputCls} value={u.phoneNumber} disabled />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-semibold text-slate-600">Hedef</span>
              <select className={inputCls} value={u.goal} onChange={(e) => update("goal", e.target.value)}>
                {GOALS.map((g) => <option key={g}>{g}</option>)}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-semibold text-slate-600">Ton</span>
              <select className={inputCls} value={u.preferredTone} onChange={(e) => update("preferredTone", e.target.value)}>
                {TONES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-semibold text-slate-600">Dil</span>
              <select className={inputCls} value={u.language} onChange={(e) => update("language", e.target.value)}>
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-semibold text-slate-600">Mesaj saati</span>
              <input className={inputCls} type="time" value={u.dailyMessageTime} onChange={(e) => update("dailyMessageTime", e.target.value)} />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-semibold text-slate-600">Zaman dilimi</span>
              <input className={inputCls} value={u.timezone} onChange={(e) => update("timezone", e.target.value)} />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-semibold text-slate-600">Abonelik</span>
              <select className={inputCls} value={u.subscriptionStatus} onChange={(e) => update("subscriptionStatus", e.target.value)}>
                {["trial", "active", "past_due", "canceled", "inactive"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label className="flex items-center gap-2 pt-1">
              <input type="checkbox" checked={u.isActive} onChange={(e) => update("isActive", e.target.checked)} />
              <span className="text-sm">Aktif</span>
            </label>
            {info && <div className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">{info}</div>}
            <div className="flex gap-2 pt-2">
              <button onClick={save} disabled={saving} className="flex-1 rounded-full bg-emerald-500 px-4 py-2 text-sm font-bold text-white">
                {saving ? "..." : "Kaydet"}
              </button>
              <button onClick={deleteUser} className="rounded-full border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50">
                Sil
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white/85 p-5 shadow-soft ring-1 ring-emerald-100">
          <h2 className="text-lg font-bold">Hızlı işlemler</h2>
          <button onClick={triggerDaily} className="mt-3 w-full rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white">
            Günlük mesajı şimdi gönder
          </button>
          <div className="mt-4">
            <textarea
              className={inputCls + " w-full"}
              rows={3}
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="Manuel mesaj yaz..."
            />
            <button onClick={sendNow} className="mt-2 w-full rounded-full bg-emerald-500 px-4 py-2 text-sm font-bold text-white">
              WhatsApp&apos;a gönder
            </button>
          </div>
        </div>
      </section>

      <section className="md:col-span-2">
        <div className="rounded-2xl bg-white/85 p-5 shadow-soft ring-1 ring-emerald-100">
          <h2 className="text-lg font-bold">Mesaj geçmişi ({messages.length})</h2>
          <div className="mt-4 max-h-[600px] space-y-2 overflow-y-auto rounded-xl bg-slate-50/50 p-3">
            {messages.length === 0 && <div className="py-6 text-center text-sm text-slate-500">Henüz mesaj yok</div>}
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.direction === "inbound" ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                  m.direction === "inbound"
                    ? "bg-white"
                    : "bg-emerald-100"
                }`}>
                  <div>{m.content}</div>
                  <div className="mt-1 text-[10px] text-slate-500">
                    {new Date(m.createdAt).toLocaleString()}
                    {m.aiGenerated && " · AI"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
