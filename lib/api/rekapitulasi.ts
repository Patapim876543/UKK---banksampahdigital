import { apiClient } from "./httpClient";
import { ApiResponse, RekapBulanan, RekapRincianJenis } from "./types";

export function normalizeRekap(data: any): RekapBulanan {
  if (!data) return data;

  const totalBerat = Number(data.rekapitulasiTonase?.totalKg ?? data.totalBerat ?? 0);
  const totalPoin = Number(data.rekapitulasiTonase?.totalPoinDiterbitkan ?? data.totalPoin ?? 0);
  const totalNominal = Number(data.rekapitulasiTonase?.totalEstimasiPembayaranRupiah ?? data.totalNominal ?? 0);

  let rincianJenis: RekapRincianJenis[] = [];
  if (Array.isArray(data.rincianJenis)) {
    rincianJenis = data.rincianJenis;
  } else if (data.breakdownJenisSampah && typeof data.breakdownJenisSampah === "object") {
    rincianJenis = Object.entries(data.breakdownJenisSampah).map(([key, val]: [string, any]) => ({
      jenis: key.toUpperCase(),
      totalBerat: Number(val.beratKg ?? val.totalBerat ?? 0),
      totalPoin: Number(val.totalPoin ?? 0),
      totalNominal: Number(val.totalEstimasiRupiah ?? val.totalNominal ?? 0),
    }));
  }

  return {
    ...data,
    bulan: data.periode || data.bulan || "",
    periode: data.periode || data.bulan || "",
    totalBerat,
    totalPoin,
    totalNominal,
    rincianJenis,
    totalPenukaran: Number(data.rekapitulasiPenukaranPoin?.totalTransaksiPenukaran ?? data.totalPenukaran ?? 0),
    totalPoinDitukar: Number(data.rekapitulasiPenukaranPoin?.totalPoinTerpakai ?? data.totalPoinDitukar ?? 0),
  };
}

export async function getRekapBulanan(bulan?: string): Promise<ApiResponse<RekapBulanan>> {
  const res = await apiClient.get<any>("/api/v1/rekapitulasi/bulanan", {
    params: { bulan: bulan || undefined },
  });
  return {
    ...res,
    data: normalizeRekap(res.data),
  };
}
