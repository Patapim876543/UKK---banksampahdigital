import { apiClient } from "./httpClient";
import { ApiResponse, PenukaranPoin } from "./types";

export async function tukarPoin(hadiahId: number): Promise<ApiResponse<PenukaranPoin>> {
  return apiClient.post<PenukaranPoin>("/api/v1/penukaran-poin/tukar", { hadiahId });
}

export async function getMyPenukaran(): Promise<ApiResponse<PenukaranPoin[]>> {
  return apiClient.get<PenukaranPoin[]>("/api/v1/penukaran-poin/my-penukaran");
}

export async function getAllPenukaranAdmin(bulan?: string): Promise<ApiResponse<PenukaranPoin[]>> {
  return apiClient.get<PenukaranPoin[]>("/api/v1/penukaran-poin/admin/list", {
    params: { bulan },
  });
}

export async function updateStatusPenukaran(
  id: number,
  status: "MENUNGGU" | "DIPROSES" | "SELESAI" | "DITOLAK" | string
): Promise<ApiResponse<PenukaranPoin>> {
  return apiClient.put<PenukaranPoin>(`/api/v1/penukaran-poin/admin/status/${id}`, { status });
}

export async function getNotaPenukaran(id: number): Promise<ApiResponse<any>> {
  return apiClient.get<any>(`/api/v1/penukaran-poin/nota/${id}`);
}
