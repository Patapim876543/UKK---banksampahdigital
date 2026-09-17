import { apiClient } from "./httpClient";
import { buildFormData } from "./formDataHelper";
import { ApiResponse, Hadiah, CreateHadiahDto, UpdateHadiahDto } from "./types";

export async function getHadiah(): Promise<ApiResponse<Hadiah[]>> {
  return apiClient.get<Hadiah[]>("/api/v1/hadiah");
}

export async function getHadiahById(id: number): Promise<ApiResponse<Hadiah>> {
  return apiClient.get<Hadiah>(`/api/v1/hadiah/${id}`);
}

export async function createHadiah(payload: CreateHadiahDto): Promise<ApiResponse<Hadiah>> {
  let body: any = payload;
  if (payload.foto instanceof File) {
    body = buildFormData(payload, "foto");
  }
  return apiClient.post<Hadiah>("/api/v1/hadiah", body);
}

export async function updateHadiah(id: number, payload: UpdateHadiahDto): Promise<ApiResponse<Hadiah>> {
  let body: any = payload;
  if (payload.foto instanceof File) {
    body = buildFormData(payload, "foto");
  }
  return apiClient.put<Hadiah>(`/api/v1/hadiah/${id}`, body);
}

export async function deleteHadiah(id: number): Promise<ApiResponse<{ id: number }>> {
  return apiClient.delete<{ id: number }>(`/api/v1/hadiah/${id}`);
}
