// /hooks/use-auth.ts (КЛИЕНТ)
"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, logout, User } from "@/lib/auth";

export function useAuth() {
  const qc = useQueryClient();

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["me"],
    queryFn: getCurrentUser,
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });

  const logoutMut = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      qc.setQueryData(["me"], null);
      // можно ещё router.replace("/login") из места, где вызываем logout
    },
  });

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
    logout: () => logoutMut.mutate(),
    refresh: () => qc.invalidateQueries({ queryKey: ["me"] }),
  };
}
