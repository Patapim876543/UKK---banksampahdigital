import { apiClient } from "./httpClient";
import { buildFormData } from "./formDataHelper";
import { ApiResponse, Hadiah, CreateHadiahDto, UpdateHadiahDto } from "./types";

export function normalizeHadiah(item: any): Hadiah {
  if (!item) return item;
  return {
    ...item,
    nama: item.nama || item.namaHadiah || "",
    namaHadiah: item.namaHadiah || item.nama || "",
    poinDibutuhkan: Number(item.poinDibutuhkan ?? 0),
    stok: Number(item.stok ?? 0),
  };
}

export async function getHadiah(): Promise<ApiResponse<Hadiah[]>> {
  const res = await apiClient.get<any[]>("/api/v1/hadiah");
  return {
    ...res,
    data: Array.isArray(res.data) ? res.data.map(normalizeHadiah) : [],
  };
}

export async function getHadiahById(id: string | number): Promise<ApiResponse<Hadiah>> {
  const res = await apiClient.get<any>(`/api/v1/hadiah/${id}`);
  return {
    ...res,
    data: normalizeHadiah(res.data),
  };
}

export async function createHadiah(payload: CreateHadiahDto): Promise<ApiResponse<Hadiah>> {
  const wireData: any = {
    namaHadiah: payload.namaHadiah || payload.nama,
    poinDibutuhkan: Number(payload.poinDibutuhkan),
    stok: Number(payload.stok),
  };

  let body: any = wireData;
  if (payload.foto instanceof File) {
    body = buildFormData({ ...wireData, foto: payload.foto }, "foto");
  }

  const res = await apiClient.post<any>("/api/v1/hadiah", body);
  return {
    ...res,
    data: normalizeHadiah(res.data),
  };
}

export async function updateHadiah(
  id: string | number,
  payload: UpdateHadiahDto
): Promise<ApiResponse<Hadiah>> {
  const wireData: any = {
    namaHadiah: payload.namaHadiah || payload.nama,
    poinDibutuhkan: payload.poinDibutuhkan !== undefined ? Number(payload.poinDibutuhkan) : undefined,
    stok: payload.stok !== undefined ? Number(payload.stok) : undefined,
  };

  let body: any = wireData;
  if (payload.foto instanceof File) {
    body = buildFormData({ ...wireData, foto: payload.foto }, "foto");
  }

  const res = await apiClient.put<any>(`/api/v1/hadiah/${id}`, body);
  return {
    ...res,
    data: normalizeHadiah(res.data),
  };
}

export async function deleteHadiah(id: string | number): Promise<ApiResponse<{ id: string | number }>> {
  return apiClient.delete<{ id: string | number }>(`/api/v1/hadiah/${id}`);
}
