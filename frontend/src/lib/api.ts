export const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export const apiGet = async <T>(path: string): Promise<T> => {
  const res = await fetch(`${API_URL}${path}`, {
    method: "GET",
    credentials: "include",
    headers: { Acept: "application/json" },
  });

  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
};
