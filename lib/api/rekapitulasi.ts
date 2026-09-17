import { apiClient } from "./httpClient";
import { ApiResponse, RekapBulanan } from "./types";

export async function getRekapBulanan(bulan?: string): Promise<ApiResponse<RekapBulanan>> {
  return apiClient.get<RekapBulanan>("/api/v1/rekapitulasi/bulanan", {
    params: { bulan },
  });
}
