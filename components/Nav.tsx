import Link from "next/link";

export default function Nav() {
  return (
    <header className="sticky top-0 z-30">
      <div className="glass border-b border-emerald-100/60">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-500 text-white shadow-soft">M</span>
            <span className="text-lg">MorukAI</span>
          </Link>
          <div className="hidden gap-7 text-sm text-slate-700 md:flex">
            <a href="#what" className="hover:text-emerald-700">Nedir?</a>
            <a href="#how" className="hover:text-emerald-700">Nasıl çalışır</a>
            <a href="#plans" className="hover:text-emerald-700">Planlar</a>
            <a href="#faq" className="hover:text-emerald-700">SSS</a>
          </div>
          <Link
            href="/onboarding"
            className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-emerald-600"
          >
            Hemen başla
          </Link>
        </nav>
      </div>
    </header>
  );
}
