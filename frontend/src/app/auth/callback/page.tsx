import { redirect } from "next/navigation";

export default function Page({
  searchParams,
}: {
  searchParams: { success?: string; error?: string; next?: string };
}) {
  const success = searchParams.success;
  const error = searchParams.error;
  const next = searchParams.next ?? "/dashboard";

  if (success === "false" || error) {
    redirect(
      `/login?error=${encodeURIComponent(
        error || "Authentication failed"
      )}&next=${encodeURIComponent(next)}`
    );
  }
  redirect(next);
}
