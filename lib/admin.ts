import { cookies } from "next/headers";

export const ADMIN_COOKIE = "morukai_admin";

export function isAdminAuthorized(): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const c = cookies().get(ADMIN_COOKIE)?.value;
  return !!c && c === expected;
}
