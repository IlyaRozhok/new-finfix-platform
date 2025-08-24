import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "./_client";
import type { User } from "@/lib/auth";

function getBaseUrl(h: Headers): string {
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) throw new Error("Host header is missing");
  return `${proto}://${host}`;
}

export default async function Page() {
  const h = headers();
  const base = getBaseUrl(h);

  const res = await fetch(`${base}/api/auth/me`, {
    headers: { cookie: h.get("cookie") ?? "" },
    cache: "no-store",
  });

  if (res.status === 401) {
    redirect(`/login?next=${encodeURIComponent("/dashboard")}`);
  }

  const user = (await res.json()) as User;
  return <DashboardClient initialUser={user} />;
}
