import Link from "next/link";
import Background3D from "@/components/Background3D";
import Nav from "@/components/Nav";
import PhoneMockup from "@/components/PhoneMockup";
import { PLANS } from "@/lib/plans";

export default function Home() {
  return (
    <main className="relative">
      <Background3D />
      <Nav />

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-5 pt-16 pb-24 md:pt-24 md:pb-28">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/60 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-soft">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              WhatsApp üzerinden çalışıyor
            </div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              WhatsApp&apos;taki <span className="gradient-text">kişisel yaşam koçun</span>: MorukAI
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-700">
              Hayatını toparlaman için her gün yanında olan, sıcak, dürüst ve motive edici bir AI moruk.
              Ders, spor, sigara bırakma, düzen, kariyer — küçük adımlarla büyük değişim.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/onboarding"
                className="rounded-full bg-emerald-500 px-6 py-3 font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-emerald-600"
              >
                Ücretsiz başla
              </Link>
              <a
                href="#how"
                className="rounded-full border border-slate-200 bg-white/70 px-6 py-3 font-semibold text-slate-800 shadow-soft transition hover:bg-white"
              >
                Nasıl çalışır?
              </a>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              MorukAI bir doktor, terapist veya psikolog değildir. Ciddi durumlarda lütfen bir uzmana danışın.
            </p>
          </div>
          <div className="relative">
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* What */}
      <section id="what" className="relative mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="rounded-3xl bg-white/70 p-8 shadow-soft ring-1 ring-emerald-100">
            <h2 className="text-3xl font-bold">MorukAI nedir?</h2>
            <p className="mt-4 text-slate-700">
              MorukAI, WhatsApp üzerinden sana her gün yazan, seninle sohbet eden, hedeflerini hatırlatan
              ve seni gerçekten tanıyan bir kişisel yaşam koçu yapay zekâ. Robot gibi konuşmaz, kanka gibi
              konuşur. Mükemmel olmanı beklemez, sadece dünden biraz daha iyi olmanı ister.
            </p>
            <ul className="mt-5 space-y-2 text-slate-700">
              <li>✅ Her sabah kişiselleştirilmiş motivasyon mesajı</li>
              <li>✅ İstediğin an sohbet, dert dinleme, küçük tavsiyeler</li>
              <li>✅ Hedefini, tonunu, saatini sen belirlersin</li>
              <li>✅ Ekstra uygulama yok — sadece WhatsApp</li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { t: "Spor & fit", d: "Antrenman alışkanlığı" },
              { t: "Ders & sınav", d: "Disiplin ve odak" },
              { t: "Sigara bırakma", d: "Krizlerde yanında" },
              { t: "Düzenli hayat", d: "Küçük rutinler" },
              { t: "İş & kariyer", d: "Momentum ve hesap verme" },
              { t: "Genel motivasyon", d: "Moralin düştüğünde" },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl bg-gradient-to-br from-white to-emerald-50 p-5 shadow-soft ring-1 ring-emerald-100/60">
                <div className="text-base font-semibold">{c.t}</div>
                <div className="mt-1 text-sm text-slate-600">{c.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How */}
      <section id="how" className="relative mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-center text-3xl font-bold md:text-4xl">Nasıl çalışır?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-700">
          3 dakikada başlıyorsun, gerisini MorukAI hallediyor.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { n: "1", t: "Abone ol", d: "7 gün ücretsiz dene, sonra istediğin planı seç." },
            { n: "2", t: "WhatsApp numaranı bağla", d: "Hedefini, tonunu ve mesaj saatini söyle." },
            { n: "3", t: "Her gün konuşmaya başla", d: "MorukAI sabah seni dürter, sen istediğin an yazarsın." },
          ].map((s) => (
            <div key={s.n} className="relative rounded-3xl bg-white/70 p-7 shadow-soft ring-1 ring-emerald-100">
              <div className="absolute -top-5 left-7 grid h-10 w-10 place-items-center rounded-2xl bg-emerald-500 text-white font-bold shadow-glow">
                {s.n}
              </div>
              <div className="mt-3 text-xl font-semibold">{s.t}</div>
              <div className="mt-2 text-slate-700">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="relative mx-auto max-w-6xl px-5 py-20">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-lime-500 p-10 text-white shadow-glow md:p-14">
          <h2 className="text-3xl font-bold md:text-4xl">Neden MorukAI?</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { t: "Yanında biri var", d: "Sabah dürten, akşam soran biri. Yalnız hissetmiyorsun." },
              { t: "Kanka tonu", d: "Robot değil, gerçek bir arkadaş gibi. Yargılamaz, motive eder." },
              { t: "Küçük adımlar", d: "Mükemmellik baskısı yok. Her gün küçük bir kazanç." },
            ].map((b) => (
              <div key={b.t} className="rounded-2xl bg-white/15 p-5 ring-1 ring-white/20 backdrop-blur">
                <div className="text-lg font-semibold">{b.t}</div>
                <div className="mt-1 text-white/90">{b.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="relative mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-center text-3xl font-bold md:text-4xl">Planlar</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-700">
          Önce 7 gün ücretsiz dene. İstersen devam et, istemezsen iptal et.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.id}
              className={`relative rounded-3xl p-8 shadow-soft ring-1 transition hover:-translate-y-1 ${
                p.highlight
                  ? "bg-slate-900 text-white ring-slate-900 shadow-glow"
                  : "bg-white/80 ring-emerald-100"
              }`}
            >
              {p.highlight && (
                <div className="absolute -top-3 right-6 rounded-full bg-lime-400 px-3 py-1 text-xs font-bold text-slate-900">
                  En popüler
                </div>
              )}
              <div className="text-sm font-semibold uppercase tracking-wider opacity-70">{p.nameTr}</div>
              <div className="mt-3 flex items-end gap-1">
                <div className="text-4xl font-extrabold">
                  {p.priceTry === 0 ? "Ücretsiz" : `${p.priceTry}₺`}
                </div>
                {p.priceTry > 0 && (
                  <div className={`mb-1 text-sm ${p.highlight ? "text-white/70" : "text-slate-500"}`}>
                    /{p.id === "yearly" ? "yıl" : "ay"}
                  </div>
                )}
              </div>
              <p className={`mt-2 text-sm ${p.highlight ? "text-white/80" : "text-slate-600"}`}>{p.taglineTr}</p>
              <Link
                href={`/checkout?plan=${p.id}`}
                className={`mt-7 block rounded-full px-5 py-3 text-center font-semibold transition ${
                  p.highlight
                    ? "bg-emerald-400 text-slate-900 hover:bg-emerald-300"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                {p.priceTry === 0 ? "Ücretsiz dene" : "Bu planı seç"}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative mx-auto max-w-3xl px-5 py-20">
        <h2 className="text-center text-3xl font-bold md:text-4xl">Sıkça sorulanlar</h2>
        <div className="mt-10 space-y-4">
          {[
            {
              q: "MorukAI bir terapist mi?",
              a: "Hayır. MorukAI bir yaşam koçu AI'dır; doktor, terapist ya da psikolog değildir. Ciddi konularda mutlaka uzmana danış.",
            },
            { q: "Ekstra bir uygulama indirecek miyim?", a: "Hayır. Tüm sohbet WhatsApp üzerinden yapılır." },
            { q: "İstediğim zaman iptal edebilir miyim?", a: "Evet. Tek tıkla iptal edersin, hemen biter." },
            { q: "Verilerim güvende mi?", a: "Mesajların yalnızca senin profilini kişiselleştirmek için tutulur, üçüncü taraflarla paylaşılmaz." },
            { q: "Türkçe dışında konuşur mu?", a: "Evet. Onboarding'de İngilizce'yi de seçebilirsin." },
          ].map((f) => (
            <details key={f.q} className="group rounded-2xl bg-white/80 p-5 shadow-soft ring-1 ring-emerald-100 open:ring-emerald-300">
              <summary className="cursor-pointer list-none font-semibold">
                <span className="mr-2 text-emerald-600 group-open:rotate-45 inline-block transition">+</span>
                {f.q}
              </summary>
              <p className="mt-2 text-slate-700">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-4xl px-5 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-10 text-center text-white shadow-glow md:p-16">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-emerald-500/40 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-lime-500/30 blur-3xl" />
          <h3 className="text-3xl font-bold md:text-4xl">Bugün küçük bir söz, yarın büyük bir fark.</h3>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            7 gün ücretsiz, kart bilgisi gerekmez. MorukAI seninle sabah konuşmaya başlasın.
          </p>
          <Link
            href="/onboarding"
            className="mt-7 inline-block rounded-full bg-emerald-400 px-7 py-3 font-bold text-slate-900 transition hover:bg-emerald-300"
          >
            Hadi başlayalım
          </Link>
        </div>
      </section>

      <footer className="border-t border-emerald-100/60 bg-white/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 text-sm text-slate-600">
          <div>© {new Date().getFullYear()} MorukAI</div>
          <div className="flex gap-5">
            <a href="#faq">SSS</a>
            <Link href="/onboarding">Başla</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
