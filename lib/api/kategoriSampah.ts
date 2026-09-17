import { apiClient } from "./httpClient";
import { buildFormData } from "./formDataHelper";
import { ApiResponse, KategoriSampah, CreateKategoriSampahDto, UpdateKategoriSampahDto } from "./types";

export function normalizeKategori(item: any): KategoriSampah {
  if (!item) return item;
  return {
    ...item,
    nama: item.nama || item.namaKategori || "",
    namaKategori: item.namaKategori || item.nama || "",
    jenis: (item.jenis || "plastik").toLowerCase(),
    hargaPerKg: Number(item.hargaPerKg ?? 0),
    poinPerKg: Number(item.poinPerKg ?? 0),
  };
}

export async function getKategoriSampah(): Promise<ApiResponse<KategoriSampah[]>> {
  const res = await apiClient.get<any[]>("/api/v1/kategori-sampah");
  return {
    ...res,
    data: Array.isArray(res.data) ? res.data.map(normalizeKategori) : [],
  };
}

export async function getKategoriSampahById(id: string | number): Promise<ApiResponse<KategoriSampah>> {
  const res = await apiClient.get<any>(`/api/v1/kategori-sampah/${id}`);
  return {
    ...res,
    data: normalizeKategori(res.data),
  };
}

export async function createKategoriSampah(payload: CreateKategoriSampahDto): Promise<ApiResponse<KategoriSampah>> {
  const wireData: any = {
    namaKategori: payload.namaKategori || payload.nama,
    hargaPerKg: Number(payload.hargaPerKg),
    poinPerKg: Number(payload.poinPerKg),
    jenis: (payload.jenis || "plastik").toLowerCase(),
  };

  let body: any = wireData;
  if (payload.foto instanceof File) {
    body = buildFormData({ ...wireData, foto: payload.foto }, "foto");
  }

  const res = await apiClient.post<any>("/api/v1/kategori-sampah", body);
  return {
    ...res,
    data: normalizeKategori(res.data),
  };
}

export async function updateKategoriSampah(
  id: string | number,
  payload: UpdateKategoriSampahDto
): Promise<ApiResponse<KategoriSampah>> {
  const wireData: any = {
    namaKategori: payload.namaKategori || payload.nama,
    hargaPerKg: Number(payload.hargaPerKg),
    poinPerKg: Number(payload.poinPerKg),
    jenis: (payload.jenis || "plastik").toLowerCase(),
  };

  let body: any = wireData;
  if (payload.foto instanceof File) {
    body = buildFormData({ ...wireData, foto: payload.foto }, "foto");
  }

  const res = await apiClient.put<any>(`/api/v1/kategori-sampah/${id}`, body);
  return {
    ...res,
    data: normalizeKategori(res.data),
  };
}

export async function deleteKategoriSampah(id: string | number): Promise<ApiResponse<{ id: string | number }>> {
  return apiClient.delete<{ id: string | number }>(`/api/v1/kategori-sampah/${id}`);
}
