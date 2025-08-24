import { apiPost, apiGet } from "./api";
import { ROUTES } from "@/router";

export type User = {
  id: string;
  email: string;
  userName?: string;
  avatarUrl?: string;
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    return await apiGet<User>(ROUTES.AUTH.ME);
  } catch {
    return null;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await apiPost(ROUTES.AUTH.LOGOUT);
  } catch {
    // Игнорируем ошибки при выходе
  }
};
