import { apiClient } from "./httpClient";
import { buildFormData } from "./formDataHelper";
import { ApiResponse, NasabahProfile, RegisterNasabahDto } from "./types";

export async function getAllNasabah(): Promise<ApiResponse<NasabahProfile[]>> {
  return apiClient.get<NasabahProfile[]>("/api/v1/admin/nasabah");
}

export async function getNasabahById(id: number): Promise<ApiResponse<NasabahProfile>> {
  return apiClient.get<NasabahProfile>(`/api/v1/admin/nasabah/${id}`);
}

export async function createNasabah(payload: RegisterNasabahDto): Promise<ApiResponse<NasabahProfile>> {
  let body: any = payload;
  if (payload.foto instanceof File) {
    body = buildFormData(payload, "foto");
  }
  return apiClient.post<NasabahProfile>("/api/v1/admin/nasabah", body);
}

export async function updateNasabah(id: number, payload: Partial<RegisterNasabahDto>): Promise<ApiResponse<NasabahProfile>> {
  let body: any = payload;
  if (payload.foto instanceof File) {
    body = buildFormData(payload, "foto");
  }
  return apiClient.put<NasabahProfile>(`/api/v1/admin/nasabah/${id}`, body);
}

export async function deleteNasabah(id: number): Promise<ApiResponse<{ id: number }>> {
  return apiClient.delete<{ id: number }>(`/api/v1/admin/nasabah/${id}`);
}
