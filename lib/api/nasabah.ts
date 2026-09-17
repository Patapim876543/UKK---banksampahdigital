import { apiClient } from "./httpClient";
import { buildFormData } from "./formDataHelper";
import { ApiResponse, NasabahProfile, RegisterNasabahDto } from "./types";

export function normalizeNasabah(item: any): NasabahProfile {
  if (!item) return item;
  return {
    ...item,
    id: item.id,
    userId: item.userId,
    username: item.user?.username || item.username || "",
    namaLengkap: item.namaNasabah || item.namaLengkap || item.user?.username || "",
    namaNasabah: item.namaNasabah || item.namaLengkap || "",
    nomorTelepon: item.telp || item.nomorTelepon || item.noTelepon || "",
    telp: item.telp || item.nomorTelepon || item.noTelepon || "",
    alamat: item.alamat || "",
    totalPoin: Number(item.saldoPoin ?? item.totalPoin ?? 0),
    saldoPoin: Number(item.saldoPoin ?? item.totalPoin ?? 0),
  };
}

export async function getAllNasabah(): Promise<ApiResponse<NasabahProfile[]>> {
  const res = await apiClient.get<any[]>("/api/v1/admin/nasabah");
  return {
    ...res,
    data: Array.isArray(res.data) ? res.data.map(normalizeNasabah) : [],
  };
}

export async function getNasabahById(id: string | number): Promise<ApiResponse<NasabahProfile>> {
  const res = await apiClient.get<any>(`/api/v1/admin/nasabah/${id}`);
  return {
    ...res,
    data: normalizeNasabah(res.data),
  };
}

export async function createNasabah(payload: RegisterNasabahDto): Promise<ApiResponse<NasabahProfile>> {
  const wireData: any = {
    username: payload.username,
    password: payload.password,
    namaNasabah: payload.namaNasabah || payload.namaLengkap,
    alamat: payload.alamat,
    telp: payload.telp || payload.nomorTelepon,
  };

  let body: any = wireData;
  if (payload.foto instanceof File) {
    body = buildFormData({ ...wireData, foto: payload.foto }, "foto");
  }

  const res = await apiClient.post<any>("/api/v1/admin/nasabah", body);
  return {
    ...res,
    data: normalizeNasabah(res.data),
  };
}

export async function updateNasabah(
  id: string | number,
  payload: Partial<RegisterNasabahDto>
): Promise<ApiResponse<NasabahProfile>> {
  const wireData: any = {
    namaLengkap: payload.namaLengkap || payload.namaNasabah,
    noTelepon: payload.nomorTelepon || payload.telp,
    alamat: payload.alamat,
    tanggalLahir: (payload as any).tanggalLahir || "2000-01-01",
  };

  let body: any = wireData;
  if (payload.foto instanceof File) {
    body = buildFormData({ ...wireData, foto: payload.foto }, "foto");
  }

  const res = await apiClient.put<any>(`/api/v1/admin/nasabah/${id}`, body);
  return {
    ...res,
    data: normalizeNasabah(res.data),
  };
}

export async function deleteNasabah(id: string | number): Promise<ApiResponse<{ id: string | number }>> {
  return apiClient.delete<{ id: string | number }>(`/api/v1/admin/nasabah/${id}`);
}
