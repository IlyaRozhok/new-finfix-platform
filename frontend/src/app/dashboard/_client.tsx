"use client";
import { ModeToggle } from "@/components/ModeToggle/ModeToggle";
import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";

export default function DashboardClient({ initialUser }: { initialUser: any }) {
  const { user, logout } = useAuth();

  // Опционально: проставить кэш React Query
  // (можно сделать через dehydrate/hydrate, но MVP-ом это не обязательно)

  const effectiveUser = user ?? initialUser;

  return (
    <div className="p-6 flex items-center justify-between gap-4">
      <div className="flex items-center">
        {effectiveUser?.avatarUrl ? (
          <Image
            src={effectiveUser.avatarUrl}
            alt={`${effectiveUser.userName || effectiveUser.email} avatar`}
            width={40}
            height={40}
            className="rounded-full mr-3"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-200 rounded-full mr-3" />
        )}
        <div className="font-medium">{effectiveUser?.userName || "User"}</div>
      </div>

      <div className="flex items-center gap-3">
        <ModeToggle />
        <button
          onClick={logout}
          className="px-3 py-2 rounded-lg border hover:bg-gray-50"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
