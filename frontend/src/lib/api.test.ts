// Простой тест для проверки API функций
// Этот файл можно удалить в продакшене

import { apiGet, apiPost, apiPut, apiDelete, apiPatch } from "./api";

// Примеры использования:
export const testApi = {
  // Получить пользователя
  getUser: () => apiGet<{ id: string; name: string }>("/api/users/1"),

  // Создать пользователя
  createUser: (data: { name: string; email: string }) =>
    apiPost<{ id: string }>("/api/users", data),

  // Обновить пользователя
  updateUser: (id: string, data: { name: string }) =>
    apiPut<{ success: boolean }>(`/api/users/${id}`, data),

  // Удалить пользователя
  deleteUser: (id: string) =>
    apiDelete<{ success: boolean }>(`/api/users/${id}`),

  // Частично обновить пользователя
  patchUser: (id: string, data: { name?: string; email?: string }) =>
    apiPatch<{ success: boolean }>(`/api/users/${id}`, data),
};
