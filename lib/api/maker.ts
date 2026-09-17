import { apiClient, setStoredAppKey } from "./httpClient";
import {
  ApiResponse,
  RegisterAppMakerDto,
  LoginAppMakerDto,
  AppMakerProfile,
  AppMakerAuthData,
} from "./types";

export async function registerAppMaker(payload: RegisterAppMakerDto): Promise<ApiResponse<AppMakerAuthData>> {
  const res = await apiClient.post<AppMakerAuthData>("/api/v1/maker/register", payload, { skipAppKey: true });
  if (res.data?.appKey) {
    setStoredAppKey(res.data.appKey);
  }
  return res;
}

export async function loginAppMaker(payload: LoginAppMakerDto): Promise<ApiResponse<AppMakerAuthData>> {
  const res = await apiClient.post<AppMakerAuthData>("/api/v1/maker/login", payload, { skipAppKey: true });
  if (res.data?.appKey) {
    setStoredAppKey(res.data.appKey);
  }
  return res;
}

export async function getMakerProfile(): Promise<ApiResponse<AppMakerProfile>> {
  return apiClient.get<AppMakerProfile>("/api/v1/maker/profile");
}

export async function checkAppKeyByEmail(email: string): Promise<ApiResponse<{ appKey: string; namaSiswa?: string; namaApp?: string }>> {
  return apiClient.get<{ appKey: string; namaSiswa?: string; namaApp?: string }>(
    `/api/v1/maker/check-key?email=${encodeURIComponent(email)}`,
    { skipAppKey: true }
  );
}
