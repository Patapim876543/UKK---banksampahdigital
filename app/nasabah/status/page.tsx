"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { NasabahShell } from "@/components/layout/nasabah-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  IconScale,
  Calendar,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Coins,
} from "@/components/icons";
import { useAuth } from "@/context/auth-context";
import { getMySetoran } from "@/lib/api/setorSampah";
import { Setoran } from "@/lib/api/types";

export default function NasabahStatusPage() {
  const { user, logout } = useAuth();
  const [setoranList, setSetoranList] = useState<Setoran[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBulan, setSelectedBulan] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("SEMUA");

  const fetchSetoran = async (bulan?: string) => {
    setIsLoading(true);
    try {
      const res = await getMySetoran(bulan || undefined);
      if (res.data) {
        setSetoranList(res.data);
      }
    } catch (err) {
      console.error("Gagal memuat setoran:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSetoran(selectedBulan);
  }, [selectedBulan]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DIVERIFIKASI":
      case "SELESAI":
        return <Badge variant="success">Diverifikasi / Selesai</Badge>;
      case "MENUNGGU_KONFIRMASI":
        return <Badge variant="warning">Menunggu Konfirmasi</Badge>;
      case "DITOLAK":
        return <Badge variant="danger">Ditolak</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  };

  const filteredList = setoranList.filter((item) => {
    if (filterStatus === "SEMUA") return true;
    return item.status === filterStatus;
  });

  return (
    <NasabahShell user={user as any} onLogout={logout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#1d1d1f] tracking-tight">
              Pelacak Status Setoran
            </h1>
            <p className="text-[17px] text-[#7a7a7a]">
              Pantau status penimbangan dan verifikasi setoran sampah daur ulang Anda.
            </p>
          </div>
          <Link href="/nasabah/setor">
            <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
              Setor Baru
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#ffffff] p-4 rounded-[18px] border border-[#e0e0e0]">
          {/* Status Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { label: "Semua", value: "SEMUA" },
              { label: "Menunggu", value: "MENUNGGU_KONFIRMASI" },
              { label: "Diverifikasi", value: "DIVERIFIKASI" },
              { label: "Ditolak", value: "DITOLAK" },
            ].map((st) => (
              <button
                key={st.value}
                type="button"
                onClick={() => setFilterStatus(st.value)}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all btn-apple-press cursor-pointer whitespace-nowrap ${
                  filterStatus === st.value
                    ? "bg-[#1d1d1f] text-white"
                    : "bg-[#f5f5f7] text-[#7a7a7a] hover:text-[#1d1d1f]"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Month Selector */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#7a7a7a]" />
            <input
              type="month"
              value={selectedBulan}
              onChange={(e) => setSelectedBulan(e.target.value)}
              className="bg-[#f5f5f7] text-[#1d1d1f] text-[13px] font-semibold px-3 py-1.5 rounded-full border border-[#e0e0e0] outline-none"
            />
            {selectedBulan && (
              <button
                type="button"
                onClick={() => setSelectedBulan("")}
                className="text-[12px] text-[#0066cc] hover:underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* List of Submissions */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-40 bg-[#f5f5f7] animate-pulse rounded-[18px]" />
            ))}
          </div>
        ) : filteredList.length === 0 ? (
          <Card className="p-8 text-center bg-white">
            <EmptyState
              icon={<IconScale className="w-8 h-8" />}
              title="Tidak Ada Data Setoran"
              description="Belum ada transaksi penyetoran yang sesuai dengan filter yang dipilih."
              actionLabel="Ajukan Penyetoran"
              onAction={() => window.location.assign("/nasabah/setor")}
            />
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredList.map((item) => (
              <Card key={item.id} className="p-6 bg-white space-y-4">
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f0f0f0] pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[17px] font-semibold text-[#1d1d1f]">
                      {item.kodeSetor || `Penyetoran #${item.id}`}
                    </span>
                    {getStatusBadge(item.status)}
                  </div>
                  <div className="text-[14px] text-[#7a7a7a]">
                    Tanggal Pengajuan: {formatDate(item.tanggalSetor || item.createdAt)}
                  </div>
                </div>

                {/* Items breakdown table / list */}
                <div className="bg-[#f5f5f7] rounded-[12px] p-4 space-y-2">
                  <div className="text-[13px] font-semibold text-[#7a7a7a] grid grid-cols-3 sm:grid-cols-4 pb-1 border-b border-[#e0e0e0]">
                    <span>Kategori</span>
                    <span className="text-right sm:text-left">Berat Estimasi</span>
                    <span className="hidden sm:inline">Berat Riil</span>
                    <span className="text-right">Estimasi Poin</span>
                  </div>
                  {item.items && item.items.length > 0 ? (
                    item.items.map((it, idx) => (
                      <div
                        key={idx}
                        className="text-[14px] text-[#1d1d1f] grid grid-cols-3 sm:grid-cols-4 py-1 items-center"
                      >
                        <span className="font-semibold truncate pr-2">
                          {it.kategori?.nama || `Kategori #${it.kategoriId}`}
                        </span>
                        <span className="text-right sm:text-left text-[#7a7a7a]">
                          {it.beratEstimasi} kg
                        </span>
                        <span className="hidden sm:inline font-semibold">
                          {it.beratRiil != null ? `${it.beratRiil} kg` : "-"}
                        </span>
                        <span className="text-right font-semibold text-[#1F7A4D]">
                          +{it.poinRiil != null ? it.poinRiil : it.poinEstimasi} Poin
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-[13px] text-[#7a7a7a]">
                      Estimasi: {item.totalBeratEstimasi} kg • Poin: +{item.totalPoinEstimasi} Poin
                    </div>
                  )}
                </div>

                {/* Notes & Admin verification remarks */}
                {(item.catatan || item.catatanAdmin) && (
                  <div className="text-[13px] space-y-1 bg-[#ffffff] p-3 rounded-[8px] border border-[#e0e0e0]">
                    {item.catatan && (
                      <div>
                        <span className="text-[#7a7a7a]">Catatan Anda: </span>
                        <span className="text-[#1d1d1f]">{item.catatan}</span>
                      </div>
                    )}
                    {item.catatanAdmin && (
                      <div>
                        <span className="font-semibold text-[#0066cc]">Catatan Admin: </span>
                        <span className="text-[#1d1d1f]">{item.catatanAdmin}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer summary & Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-6">
                    <div>
                      <div className="text-[11px] text-[#7a7a7a] uppercase font-semibold">
                        Total Timbangan
                      </div>
                      <div className="text-[17px] font-semibold text-[#1d1d1f]">
                        {item.totalBeratRiil != null ? `${item.totalBeratRiil} kg (Riil)` : `${item.totalBeratEstimasi} kg (Est)`}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] text-[#7a7a7a] uppercase font-semibold">
                        Poin Diterima
                      </div>
                      <div className="text-[17px] font-semibold text-[#1F7A4D]">
                        +{item.totalPoinRiil != null ? item.totalPoinRiil : item.totalPoinEstimasi} Poin
                      </div>
                    </div>
                  </div>

                  {/* Print / Download Receipt Button for verified deposits */}
                  {item.status === "DIVERIFIKASI" || item.status === "SELESAI" ? (
                    <Link href={`/nasabah/nota/${item.id}?type=setor`}>
                      <Button variant="pearl-capsule" leftIcon={<FileText className="w-4 h-4" />}>
                        Cetak Nota
                      </Button>
                    </Link>
                  ) : null}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </NasabahShell>
  );
}
