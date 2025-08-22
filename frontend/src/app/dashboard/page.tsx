"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { User } from "@/types";
import { ROUTES } from "@/router";

import { ModeToggle } from "@/components/MoodToggle/MoodToggle";
import { useRouter } from "next/navigation";

export default function AppPage() {
  const [me, setMe] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  useEffect(() => {
    apiGet<User>(ROUTES.AUTH.ME)
      .then(setMe)
      .catch(() => router.push("/"));
  }, []);

  if (!me) return <div className="p-6">Загрузка…</div>;

  return (
    <div className="p-6 flex items-center justify-between gap-4">
      <div className="flex items-center">
        {me.avatarUrl ? (
          // если хочешь оптимизировать:
          // <Image src={me.avatarUrl} alt="avatar" width={40} height={40} className="rounded-full" />
          <img
            src={me.avatarUrl}
            alt="avatar"
            className="w-10 h-10 rounded-full mr-3"
          />
        ) : null}

        <div className="font-medium">{me.userName ?? "User"}</div>
        {/* <div className="text-sm text-gray-500">{me.email}</div> */}
      </div>

      <div className="flex items-center">
        <div className="mr-3">
          <ModeToggle />
        </div>
        <a
          href={`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`}
          className="ml-auto px-3 py-2 rounded-lg border"
        >
          Exit
        </a>
      </div>
    </div>
  );
}
