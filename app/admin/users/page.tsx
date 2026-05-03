import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthorized } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import AdminChrome from "@/components/AdminChrome";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  if (!isAdminAuthorized()) redirect("/admin/login");

  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <AdminChrome>
      <main className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold">Kullanıcılar</h1>
          <span className="text-sm text-slate-500">{users.length} kayıt</span>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl bg-white/85 shadow-soft ring-1 ring-emerald-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">İsim</th>
                <th className="px-4 py-3">Telefon</th>
                <th className="px-4 py-3">Hedef</th>
                <th className="px-4 py-3">Ton</th>
                <th className="px-4 py-3">Saat</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3">Aktif</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t hover:bg-emerald-50/30">
                  <td className="px-4 py-3 font-semibold">{u.fullName}</td>
                  <td className="px-4 py-3">{u.phoneNumber}</td>
                  <td className="px-4 py-3">{u.goal}</td>
                  <td className="px-4 py-3">{u.preferredTone}</td>
                  <td className="px-4 py-3">{u.dailyMessageTime}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">{u.subscriptionStatus}</span>
                  </td>
                  <td className="px-4 py-3">{u.isActive ? "✅" : "⏸"}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/users/${u.id}`} className="text-emerald-700 hover:underline">Aç</Link>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-slate-500">Kullanıcı yok</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </AdminChrome>
  );
}
