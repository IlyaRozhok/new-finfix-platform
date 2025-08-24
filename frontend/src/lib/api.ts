export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  headers?: Record<string, string>;
}

const getCsrfToken = (): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/csrf=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

const getHeaders = (
  customHeaders?: Record<string, string>
): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...customHeaders,
  };

  const csrfToken = getCsrfToken();
  if (csrfToken) {
    headers["x-csrf-token"] = csrfToken;
  }

  return headers;
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Request failed: ${response.status} - ${errorText}`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
};

export const apiRequest = async <T>(
  path: string,
  options: ApiOptions = {}
): Promise<T> => {
  const { method = "GET", body, headers: customHeaders } = options;

  const config: RequestInit = {
    method,
    credentials: "include",
    headers: getHeaders(customHeaders),
  };

  if (body && method !== "GET") {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${path}`, config);
  return handleResponse(response);
};

export const apiGet = <T>(path: string): Promise<T> => apiRequest<T>(path);
export const apiPost = <T>(path: string, body?: any): Promise<T> =>
  apiRequest<T>(path, { method: "POST", body });
export const apiPut = <T>(path: string, body?: any): Promise<T> =>
  apiRequest<T>(path, { method: "PUT", body });
export const apiDelete = <T>(path: string): Promise<T> =>
  apiRequest<T>(path, { method: "DELETE" });
export const apiPatch = <T>(path: string, body?: any): Promise<T> =>
  apiRequest<T>(path, { method: "PATCH", body });
