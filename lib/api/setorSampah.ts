import { apiClient } from "./httpClient";
import { ApiResponse, Setoran, CreateSetorSampahDto, VerifySetorSampahDto } from "./types";

export async function submitSetoran(payload: CreateSetorSampahDto): Promise<ApiResponse<Setoran>> {
  return apiClient.post<Setoran>("/api/v1/setor-sampah/pengajuan", payload);
}

export async function getMySetoran(bulan?: string): Promise<ApiResponse<Setoran[]>> {
  return apiClient.get<Setoran[]>("/api/v1/setor-sampah/my-setor", {
    params: { bulan },
  });
}

export async function getAllSetoranAdmin(params?: {
  status?: string;
  bulan?: string;
}): Promise<ApiResponse<Setoran[]>> {
  return apiClient.get<Setoran[]>("/api/v1/setor-sampah/admin/list", {
    params,
  });
}

export async function getSetoranDetail(id: number): Promise<ApiResponse<Setoran>> {
  return apiClient.get<Setoran>(`/api/v1/setor-sampah/${id}`);
}

export async function verifySetoran(
  id: number,
  payload: VerifySetorSampahDto
): Promise<ApiResponse<Setoran>> {
  return apiClient.put<Setoran>(`/api/v1/setor-sampah/admin/verify/${id}`, payload);
}
