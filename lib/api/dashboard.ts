import { apiClient } from "./httpClient";
import { ApiResponse, DashboardSummaryNasabah, DashboardStatsAdmin } from "./types";
import { normalizeSetoran } from "./setorSampah";
import { normalizePenukaran } from "./penukaranPoin";

export function normalizeDashboardSummary(data: any): DashboardSummaryNasabah {
  if (!data) return data;
  return {
    ...data,
    totalPoin: Number(data.saldoPoin ?? data.totalPoin ?? 0),
    saldoPoin: Number(data.saldoPoin ?? data.totalPoin ?? 0),
    totalSetoranSelesai: Number(data.totalPengajuanSetor ?? data.totalSetoranSelesai ?? 0),
    totalPengajuanSetor: Number(data.totalPengajuanSetor ?? data.totalSetoranSelesai ?? 0),
    totalPenukaran: Number(data.totalPenukaranHadiah ?? data.totalPenukaran ?? 0),
    totalPenukaranHadiah: Number(data.totalPenukaranHadiah ?? data.totalPenukaran ?? 0),
    totalBeratKg: Number(data.totalBeratKg ?? data.totalBeratSampahKg ?? 0),
    totalPoinDiperoleh: Number(data.totalPoinDiperoleh ?? 0),
    setoranTerbaru: Array.isArray(data.setorTerakhir)
      ? data.setorTerakhir.map(normalizeSetoran)
      : (Array.isArray(data.setoranTerbaru) ? data.setoranTerbaru.map(normalizeSetoran) : []),
    penukaranTerbaru: Array.isArray(data.penukaranTerakhir)
      ? data.penukaranTerakhir.map(normalizePenukaran)
      : (Array.isArray(data.penukaranTerbaru) ? data.penukaranTerbaru.map(normalizePenukaran) : []),
  };
}

export function normalizeDashboardStats(data: any): DashboardStatsAdmin {
  if (!data) return data;
  return {
    ...data,
    totalNasabah: Number(data.totalNasabah ?? 0),
    totalKategoriSampah: Number(data.totalKategoriSampah ?? 0),
    totalTransaksiSetor: Number(data.totalTransaksiSetor ?? 0),
    totalHadiah: Number(data.totalHadiah ?? 0),
    totalSetoranPending: Number(data.totalSetoranPending ?? data.totalTransaksiPending ?? 0),
    totalBeratTerkumpul: Number(data.totalBeratSampahKg ?? data.totalBeratTerkumpul ?? 0),
    totalBeratSampahKg: Number(data.totalBeratSampahKg ?? data.totalBeratTerkumpul ?? 0),
    totalPoinBeredar: Number(data.totalPoinTersalurkan ?? data.totalPoinBeredar ?? 0),
    totalPoinTersalurkan: Number(data.totalPoinTersalurkan ?? data.totalPoinBeredar ?? 0),
    totalPoinDitukar: Number(data.totalPoinDitukar ?? 0),
    transaksiTerbaru: Array.isArray(data.transaksiTerbaru)
      ? data.transaksiTerbaru.map(normalizeSetoran)
      : [],
  };
}

export async function getDashboardSummary(): Promise<ApiResponse<DashboardSummaryNasabah>> {
  const res = await apiClient.get<any>("/api/v1/dashboard/summary");
  return {
    ...res,
    data: normalizeDashboardSummary(res.data),
  };
}

export async function getDashboardStats(): Promise<ApiResponse<DashboardStatsAdmin>> {
  const res = await apiClient.get<any>("/api/v1/dashboard/stats");
  return {
    ...res,
    data: normalizeDashboardStats(res.data),
  };
}
