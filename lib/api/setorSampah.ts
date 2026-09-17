import { apiClient } from "./httpClient";
import { ApiResponse, Setoran, CreateSetorSampahDto, VerifySetorSampahDto, StatusSetor } from "./types";
import { normalizeKategori } from "./kategoriSampah";

export function normalizeSetoran(item: any): Setoran {
  if (!item) return item;

  const rawItems = item.detailSetors || item.items || [];
  const normalizedItems = rawItems.map((d: any) => ({
    ...d,
    id: d.id,
    kategoriId: d.kategoriSampahId || d.kategoriId,
    kategoriSampahId: d.kategoriSampahId || d.kategoriId,
    beratEstimasi: Number(d.beratKg ?? d.beratEstimasi ?? 0),
    beratKg: Number(d.beratKg ?? d.beratEstimasi ?? 0),
    beratRiil: d.beratKgReal != null ? Number(d.beratKgReal) : (d.beratKg != null ? Number(d.beratKg) : (d.beratRiil != null ? Number(d.beratRiil) : null)),
    beratKgReal: d.beratKgReal != null ? Number(d.beratKgReal) : (d.beratKg != null ? Number(d.beratKg) : null),
    poinEstimasi: Number(d.subtotalPoin ?? d.poinEstimasi ?? 0),
    subtotalPoin: Number(d.subtotalPoin ?? d.poinEstimasi ?? 0),
    poinRiil: d.subtotalPoin != null ? Number(d.subtotalPoin) : (d.poinRiil != null ? Number(d.poinRiil) : null),
    kategori: d.kategoriSampah ? normalizeKategori(d.kategoriSampah) : d.kategori,
  }));

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
    tanggalSetor: item.tanggalSetor || item.tanggal || item.createdAt,
    tanggal: item.tanggal || item.tanggalSetor || item.createdAt,
    totalBeratEstimasi: Number(item.totalBeratEstimasi ?? item.totalBeratKg ?? 0),
    totalBeratKg: Number(item.totalBeratKg ?? item.totalBeratEstimasi ?? 0),
    totalBeratRiil: item.totalBeratRiil != null ? Number(item.totalBeratRiil) : (item.totalBeratKg != null ? Number(item.totalBeratKg) : null),
    totalPoinEstimasi: Number(item.totalPoinEstimasi ?? item.totalPoin ?? 0),
    totalPoin: Number(item.totalPoin ?? item.totalPoinEstimasi ?? 0),
    totalPoinRiil: item.totalPoinRiil != null ? Number(item.totalPoinRiil) : (item.totalPoin != null ? Number(item.totalPoin) : null),
    status: (item.status || "MENUNGGU_KONFIRMASI").toUpperCase() as StatusSetor,
    items: normalizedItems,
    nasabah: nasabahData,
  };
}

export async function submitSetoran(payload: CreateSetorSampahDto): Promise<ApiResponse<Setoran>> {
  const wirePayload = {
    tanggal: payload.tanggal || payload.tanggalSetor || new Date().toISOString(),
    catatan: payload.catatan || "",
    items: payload.items.map((it: any) => ({
      kategoriSampahId: String(it.kategoriSampahId || it.kategoriId),
      beratKg: Number(it.beratKg ?? it.beratEstimasi ?? 0),
    })),
  };

  const res = await apiClient.post<any>("/api/v1/setor-sampah/pengajuan", wirePayload);
  return {
    ...res,
    data: normalizeSetoran(res.data),
  };
}

export async function getMySetoran(bulan?: string): Promise<ApiResponse<Setoran[]>> {
  const res = await apiClient.get<any[]>("/api/v1/setor-sampah/my-setor", {
    params: { bulan: bulan || undefined },
  });
  return {
    ...res,
    data: Array.isArray(res.data) ? res.data.map(normalizeSetoran) : [],
  };
}

export async function getAllSetoranAdmin(params?: {
  status?: string;
  bulan?: string;
}): Promise<ApiResponse<Setoran[]>> {
  const statusParam =
    params?.status && params.status !== "SEMUA"
      ? params.status.toLowerCase()
      : undefined;

  const res = await apiClient.get<any[]>("/api/v1/setor-sampah/admin/list", {
    params: {
      status: statusParam,
      bulan: params?.bulan || undefined,
    },
  });
  return {
    ...res,
    data: Array.isArray(res.data) ? res.data.map(normalizeSetoran) : [],
  };
}

export async function getSetoranDetail(id: string | number): Promise<ApiResponse<Setoran>> {
  const res = await apiClient.get<any>(`/api/v1/setor-sampah/${id}`);
  return {
    ...res,
    data: normalizeSetoran(res.data),
  };
}

export async function verifySetoran(
  id: string | number,
  payload: VerifySetorSampahDto
): Promise<ApiResponse<Setoran>> {
  const wirePayload: any = {
    status: (payload.status || "diverifikasi").toLowerCase(),
    catatanAdmin: payload.catatanAdmin || "",
  };

  const rawItems = payload.itemsReal || payload.items;
  if (rawItems && rawItems.length > 0) {
    wirePayload.itemsReal = rawItems.map((it: any) => ({
      kategoriSampahId: String(it.kategoriSampahId || it.itemId || it.kategoriId),
      beratKgReal: Number(it.beratKgReal ?? it.beratRiil ?? 0),
    }));
  }

  const res = await apiClient.put<any>(`/api/v1/setor-sampah/admin/verify/${id}`, wirePayload);
  return {
    ...res,
    data: normalizeSetoran(res.data),
  };
}
