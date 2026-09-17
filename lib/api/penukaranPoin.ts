import { apiClient } from "./httpClient";
import { ApiResponse, PenukaranPoin, StatusPenukaran } from "./types";
import { normalizeHadiah } from "./hadiah";

export function normalizePenukaran(item: any): PenukaranPoin {
  if (!item) return item;

  const nasabahData = item.nasabah
    ? {
        ...item.nasabah,
        username: item.nasabah.user?.username || item.nasabah.username || "",
        namaLengkap: item.nasabah.namaNasabah || item.nasabah.namaLengkap || "",
        namaNasabah: item.nasabah.namaNasabah || item.nasabah.namaLengkap || "",
        nomorTelepon: item.nasabah.telp || item.nasabah.nomorTelepon || "",
        telp: item.nasabah.telp || item.nasabah.nomorTelepon || "",
      }
    : undefined;

  return {
    ...item,
    poinDigunakan: Number(item.poinDigunakan ?? item.poinTerpakai ?? 0),
    poinTerpakai: Number(item.poinTerpakai ?? item.poinDigunakan ?? 0),
    tanggalPengajuan: item.tanggalPengajuan || item.tanggal || item.createdAt,
    tanggal: item.tanggal || item.tanggalPengajuan || item.createdAt,
    status: (item.status || "DIPROSES").toUpperCase() as StatusPenukaran,
    hadiah: item.hadiah ? normalizeHadiah(item.hadiah) : undefined,
    nasabah: nasabahData,
  };
}

export async function tukarPoin(hadiahId: string | number): Promise<ApiResponse<PenukaranPoin>> {
  const res = await apiClient.post<any>("/api/v1/penukaran-poin/tukar", {
    hadiahId: String(hadiahId),
  });
  return {
    ...res,
    data: normalizePenukaran(res.data),
  };
}

export async function getMyPenukaran(): Promise<ApiResponse<PenukaranPoin[]>> {
  const res = await apiClient.get<any[]>("/api/v1/penukaran-poin/my-penukaran");
  return {
    ...res,
    data: Array.isArray(res.data) ? res.data.map(normalizePenukaran) : [],
  };
}

export async function getAllPenukaranAdmin(bulan?: string): Promise<ApiResponse<PenukaranPoin[]>> {
  const res = await apiClient.get<any[]>("/api/v1/penukaran-poin/admin/list", {
    params: { bulan: bulan || undefined },
  });
  return {
    ...res,
    data: Array.isArray(res.data) ? res.data.map(normalizePenukaran) : [],
  };
}

export async function updateStatusPenukaran(
  id: string | number,
  status: "MENUNGGU" | "DIPROSES" | "SELESAI" | "DITOLAK" | string
): Promise<ApiResponse<PenukaranPoin>> {
  const res = await apiClient.put<any>(`/api/v1/penukaran-poin/admin/status/${id}`, {
    status: status.toLowerCase(),
  });
  return {
    ...res,
    data: normalizePenukaran(res.data),
  };
}

export async function getNotaPenukaran(id: string | number): Promise<ApiResponse<any>> {
  const res = await apiClient.get<any>(`/api/v1/penukaran-poin/nota/${id}`);
  return {
    ...res,
    data: normalizePenukaran(res.data),
  };
}
