import { apiClient, setStoredToken, removeStoredToken } from "./httpClient";
import { buildFormData } from "./formDataHelper";
import {
  ApiResponse,
  RegisterNasabahDto,
  RegisterAdminDto,
  LoginDto,
  AuthResponseData,
  NasabahProfile,
  AdminProfile,
} from "./types";

export async function registerNasabah(payload: RegisterNasabahDto): Promise<ApiResponse<NasabahProfile>> {
  let body: any = payload;
  if (payload.foto instanceof File) {
    body = buildFormData(payload, "foto");
  }
  return apiClient.post<NasabahProfile>("/api/v1/auth/nasabah/register", body);
}

export async function registerAdmin(payload: RegisterAdminDto): Promise<ApiResponse<AdminProfile>> {
  return apiClient.post<AdminProfile>("/api/v1/auth/admin/register", payload);
}

export async function login(payload: LoginDto): Promise<ApiResponse<AuthResponseData>> {
  const res = await apiClient.post<AuthResponseData>("/api/v1/auth/login", payload);
  if (res.data?.token) {
    setStoredToken(res.data.token);
  }
  return res;
}

export async function getMe(): Promise<ApiResponse<{ role: "NASABAH" | "ADMIN"; profile: NasabahProfile | AdminProfile }>> {
  return apiClient.get<{ role: "NASABAH" | "ADMIN"; profile: NasabahProfile | AdminProfile }>("/api/v1/auth/me");
}

export function logout(): void {
  removeStoredToken();
}
