"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, User } from "@/lib/auth";

export function AuthStatus() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="text-sm text-gray-500">Проверка аутентификации...</div>
    );
  }

  if (!user) {
    return <div className="text-sm text-red-500">Не авторизован</div>;
  }

  return (
    <div className="text-sm text-green-500">
      Авторизован как: {user.userName || user.email}
    </div>
  );
}
