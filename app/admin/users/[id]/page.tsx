import { redirect, notFound } from "next/navigation";
import { isAdminAuthorized } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import AdminChrome from "@/components/AdminChrome";
import UserDetailClient from "./UserDetailClient";

export const dynamic = "force-dynamic";

export default async function UserDetailPage({ params }: { params: { id: string } }) {
  if (!isAdminAuthorized()) redirect("/admin/login");

  const user = await prisma.user.findUnique({ where: { id: params.id } });
  if (!user) notFound();

  const messages = await prisma.message.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
    take: 200,
  });

  return (
    <AdminChrome>
      <main className="mx-auto max-w-5xl px-5 py-10">
        <UserDetailClient user={JSON.parse(JSON.stringify(user))} messages={JSON.parse(JSON.stringify(messages))} />
      </main>
    </AdminChrome>
  );
}
