"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { User } from "@/types";
import { ROUTES } from "@/router";

export default function AppPage() {
  const [me, setMe] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<User>(ROUTES.AUTH.ME)
      .then(setMe)
      .catch(() => setError("Not authenticated"));
  }, []);

  if (error) {
    return (
      <div className="p-6">
        <p className="mb-4">Вы не авторизованы.</p>
        <a
          href="/"
          className="inline-block px-3 py-2 rounded-lg bg-black text-white"
        >
          Войти
        </a>
      </div>
    );
  }

  if (!me) return <div className="p-6">Загрузка…</div>;

  return (
    <div className="p-6 flex items-center gap-4">
      {me.avatarUrl ? (
        // если хочешь оптимизировать:
        // <Image src={me.avatarUrl} alt="avatar" width={40} height={40} className="rounded-full" />
        <img
          src={me.avatarUrl}
          alt="avatar"
          className="w-10 h-10 rounded-full"
        />
      ) : null}
      <div>
        <div className="font-medium">{me.userName ?? "User"}</div>
        <div className="text-sm text-gray-500">{me.email}</div>
      </div>
      <a
        href={`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`}
        className="ml-auto px-3 py-2 rounded-lg border"
      >
        Выйти
      </a>
    </div>
  );
}
