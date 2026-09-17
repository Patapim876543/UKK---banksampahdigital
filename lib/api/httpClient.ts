import { ApiResponse } from "./types";

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://learn.smktelkom-mlg.sch.id/bank_sampah/"
).replace(/\/+$/, "");

export const STORAGE_KEYS = {
  APP_KEY: "ecobank_app_key",
  AUTH_TOKEN: "ecobank_auth_token",
  USER_SESSION: "ecobank_user_session",
  APP_MAKER_DATA: "ecobank_app_maker_data",
};

export function getStoredAppKey(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.APP_KEY);
}

export function setStoredAppKey(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.APP_KEY, key);
}

export function removeStoredAppKey(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.APP_KEY);
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
}

export function setStoredToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
}

export function removeStoredToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: any;
  params?: Record<string, string | number | boolean | undefined>;
  skipAppKey?: boolean;
}

export class ApiError extends Error {
  statusCode: number;
  errors?: any;

  constructor(message: string, statusCode = 400, errors?: any) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export async function request<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { body, params, headers: customHeaders = {}, skipAppKey = false, ...restOptions } = options;

  // Build query string
  let url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  // Setup headers
  const headers = new Headers(customHeaders);

  // Attach App Key header unless skipped or endpoint is maker public routes
  const isMakerPublic =
    endpoint.includes("/maker/register") ||
    endpoint.includes("/maker/login") ||
    endpoint.includes("/maker/check-key");

  if (!skipAppKey && !isMakerPublic) {
    const appKey = getStoredAppKey();
    if (appKey) {
      headers.set("x-app-key", appKey);
    }
  }

  // Attach JWT Bearer Token if present
  const token = getStoredToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Body handling
  let processedBody: any = body;
  if (body !== undefined && body !== null) {
    if (body instanceof FormData) {
      // Browser automatically sets correct multipart boundary
    } else if (typeof body === "object") {
      headers.set("Content-Type", "application/json");
      processedBody = JSON.stringify(body);
    }
  }

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers,
      body: processedBody,
    });

    // Handle 401 Unauthorized
    if (response.status === 401) {
      removeStoredToken();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        // window.location.href = "/login";
      }
    }

    let jsonResponse: ApiResponse<T>;
    try {
      jsonResponse = await response.json();
    } catch {
      throw new ApiError(
        `Server mengembalikan status ${response.status} dengan respon tidak valid.`,
        response.status
      );
    }

    if (!response.ok || jsonResponse.success === false) {
      const errorMessage =
        jsonResponse.message ||
        (Array.isArray(jsonResponse.errors) ? jsonResponse.errors.join(", ") : null) ||
        `Terjadi kesalahan pada request (${response.status})`;
      throw new ApiError(errorMessage, response.status, jsonResponse.errors);
    }

    return jsonResponse;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error?.message || "Gagal menghubungi server. Periksa koneksi internet Anda.",
      500
    );
  }
}

export const apiClient = {
  get: <T = any>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "GET" }),
  post: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "POST", body }),
  put: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "PUT", body }),
  delete: <T = any>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};
