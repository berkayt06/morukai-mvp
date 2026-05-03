import Link from "next/link";

export default function AdminChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="glass border-b border-emerald-100/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2 font-bold">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-900 text-white">M</span>
              MorukAI Admin
            </Link>
            <nav className="hidden gap-5 text-sm md:flex">
              <Link href="/admin" className="hover:text-emerald-700">Özet</Link>
              <Link href="/admin/users" className="hover:text-emerald-700">Kullanıcılar</Link>
            </nav>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-sm hover:bg-white">
              Çıkış
            </button>
          </form>
        </div>
      </header>
      {children}
    </>
  );
}
