import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthorized } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import AdminChrome from "@/components/AdminChrome";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  if (!isAdminAuthorized()) redirect("/admin/login");

  const [totalUsers, activeUsers, trialUsers, msgCount, recent] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { subscriptionStatus: "active" } }),
    prisma.user.count({ where: { subscriptionStatus: "trial" } }),
    prisma.message.count(),
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
  ]);

  const Stat = ({ label, value }: { label: string; value: number | string }) => (
    <div className="rounded-2xl bg-white/85 p-5 shadow-soft ring-1 ring-emerald-100">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-extrabold">{value}</div>
    </div>
  );

  return (
    <AdminChrome>
      <main className="mx-auto max-w-6xl px-5 py-10">
        <h1 className="text-2xl font-extrabold">Özet</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <Stat label="Toplam kullanıcı" value={totalUsers} />
          <Stat label="Aktif abone" value={activeUsers} />
          <Stat label="Deneme" value={trialUsers} />
          <Stat label="Toplam mesaj" value={msgCount} />
        </div>

        <div className="mt-10 rounded-2xl bg-white/85 p-5 shadow-soft ring-1 ring-emerald-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Son kullanıcılar</h2>
            <Link href="/admin/users" className="text-sm text-emerald-700 hover:underline">Tümü →</Link>
          </div>
          <div className="mt-4 divide-y">
            {recent.map((u) => (
              <Link key={u.id} href={`/admin/users/${u.id}`} className="flex items-center justify-between py-3 hover:bg-slate-50/60 -mx-2 px-2 rounded-lg">
                <div>
                  <div className="font-semibold">{u.fullName}</div>
                  <div className="text-xs text-slate-500">{u.phoneNumber} · {u.goal}</div>
                </div>
                <div className="text-xs">
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">{u.subscriptionStatus}</span>
                </div>
              </Link>
            ))}
            {recent.length === 0 && <div className="py-6 text-center text-sm text-slate-500">Henüz kullanıcı yok</div>}
          </div>
        </div>
      </main>
    </AdminChrome>
  );
}
