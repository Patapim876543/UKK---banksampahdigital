import { apiClient } from "./httpClient";
import { buildFormData } from "./formDataHelper";
import { ApiResponse, KategoriSampah, CreateKategoriSampahDto, UpdateKategoriSampahDto } from "./types";

export async function getKategoriSampah(): Promise<ApiResponse<KategoriSampah[]>> {
  return apiClient.get<KategoriSampah[]>("/api/v1/kategori-sampah");
}

export async function getKategoriSampahById(id: number): Promise<ApiResponse<KategoriSampah>> {
  return apiClient.get<KategoriSampah>(`/api/v1/kategori-sampah/${id}`);
}

export async function createKategoriSampah(payload: CreateKategoriSampahDto): Promise<ApiResponse<KategoriSampah>> {
  let body: any = payload;
  if (payload.foto instanceof File) {
    body = buildFormData(payload, "foto");
  }
  return apiClient.post<KategoriSampah>("/api/v1/kategori-sampah", body);
}

export async function updateKategoriSampah(id: number, payload: UpdateKategoriSampahDto): Promise<ApiResponse<KategoriSampah>> {
  let body: any = payload;
  if (payload.foto instanceof File) {
    body = buildFormData(payload, "foto");
  }
  return apiClient.put<KategoriSampah>(`/api/v1/kategori-sampah/${id}`, body);
}

export async function deleteKategoriSampah(id: number): Promise<ApiResponse<{ id: number }>> {
  return apiClient.delete<{ id: number }>(`/api/v1/kategori-sampah/${id}`);
}
