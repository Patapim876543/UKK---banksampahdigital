"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { NasabahShell } from "@/components/layout/nasabah-shell";
import { Card, StatCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Coins,
  History,
  IconScale,
  Calendar,
  Gift,
  FileText,
} from "@/components/icons";
import { useAuth } from "@/context/auth-context";
import { getMySetoran } from "@/lib/api/setorSampah";
import { getMyPenukaran } from "@/lib/api/penukaranPoin";
import { Setoran, PenukaranPoin, NasabahProfile } from "@/lib/api/types";

export default function NasabahRiwayatPage() {
  const { user, logout, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"setoran" | "penukaran">("setoran");
  const [setoranList, setSetoranList] = useState<Setoran[]>([]);
  const [penukaranList, setPenukaranList] = useState<PenukaranPoin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBulan, setSelectedBulan] = useState("");

  const nasabah = user as NasabahProfile;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await refreshUser();
        const [setoranRes, penukaranRes] = await Promise.allSettled([
          getMySetoran(selectedBulan || undefined),
          getMyPenukaran(),
        ]);

        if (setoranRes.status === "fulfilled" && setoranRes.value.data) {
          setSetoranList(setoranRes.value.data);
        }
        if (penukaranRes.status === "fulfilled" && penukaranRes.value.data) {
          setPenukaranList(penukaranRes.value.data);
        }
      } catch (err) {
        console.error("Gagal mengambil riwayat:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedBulan, refreshUser]);

  const formatDate = (iso?: string) => {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  };

  return (
    <NasabahShell user={nasabah} onLogout={logout}>
      <div className="space-y-6">
        {/* Header & Balance Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#1d1d1f] tracking-tight">
              Riwayat Transaksi &amp; Poin
            </h1>
            <p className="text-[17px] text-[#7a7a7a]">
              Rekap seluruh aktivitas perolehan dan penukaran saldo poin daur ulang Anda.
            </p>
          </div>
          <Link href="/nasabah/tukar-poin">
            <Button variant="primary" leftIcon={<Gift className="w-4 h-4" />}>
              Tukar Hadiah
            </Button>
          </Link>
        </div>

        {/* Large Stat Balance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <StatCard
            label="SALDO POIN SAAT INI"
            value={`${(nasabah?.totalPoin || 0).toLocaleString("id-ID")} Poin`}
            subtext="Tersedia untuk ditukarkan kapan saja"
            icon={<Coins className="w-5 h-5 text-[#0066cc]" />}
          />
          <StatCard
            label="TOTAL PENYETORAN DITERIMA"
            value={setoranList.filter((s) => s.status === "DIVERIFIKASI" || s.status === "SELESAI").length.toString()}
            subtext="Transaksi sampah yang telah terverifikasi"
            icon={<IconScale className="w-5 h-5 text-[#1F7A4D]" />}
          />
        </div>

        {/* Underline Tabs & Filter Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e0e0e0] pb-2">
          {/* Apple Tabs */}
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setActiveTab("setoran")}
              className={`text-[17px] font-semibold pb-2 transition-colors border-b-2 cursor-pointer ${
                activeTab === "setoran"
                  ? "border-[#0066cc] text-[#0066cc]"
                  : "border-transparent text-[#7a7a7a] hover:text-[#1d1d1f]"
              }`}
            >
              Penyetoran Sampah ({setoranList.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("penukaran")}
              className={`text-[17px] font-semibold pb-2 transition-colors border-b-2 cursor-pointer ${
                activeTab === "penukaran"
                  ? "border-[#0066cc] text-[#0066cc]"
                  : "border-transparent text-[#7a7a7a] hover:text-[#1d1d1f]"
              }`}
            >
              Penukaran Hadiah ({penukaranList.length})
            </button>
          </div>

          {/* Month selector for setoran */}
          {activeTab === "setoran" && (
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
                  className="text-[12px] text-[#0066cc] hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tab 1: Penyetoran Sampah */}
        {activeTab === "setoran" && (
          <div>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-20 bg-[#f5f5f7] animate-pulse rounded-[18px]" />
                ))}
              </div>
            ) : setoranList.length === 0 ? (
              <Card className="p-8 text-center bg-white">
                <EmptyState
                  icon={<History className="w-8 h-8" />}
                  title="Belum Ada Riwayat Penyetoran"
                  description="Ayo kumpulkan sampah daur ulang dan setorkan untuk menambah saldo poin Anda."
                  actionLabel="+ Setor Sampah"
                  onAction={() => window.location.assign("/nasabah/setor")}
                />
              </Card>
            ) : (
              <div className="space-y-3">
                {setoranList.map((item) => (
                  <Card
                    key={item.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[17px] font-semibold text-[#1d1d1f]">
                          {item.kodeSetor || `Penyetoran #${item.id}`}
                        </span>
                        <Badge
                          variant={
                            item.status === "DIVERIFIKASI" || item.status === "SELESAI"
                              ? "success"
                              : item.status === "DITOLAK"
                              ? "danger"
                              : "warning"
                          }
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <div className="text-[14px] text-[#7a7a7a]">
                        Tanggal: {formatDate(item.tanggalSetor || item.createdAt)}
                        {item.items && item.items.length > 0 && (
                          <span> • {item.items.length} jenis sampah</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f0f0f0]">
                      <div className="text-left sm:text-right">
                        <div className="text-[17px] font-semibold text-[#1d1d1f]">
                          {item.totalBeratRiil != null ? item.totalBeratRiil : item.totalBeratEstimasi} kg
                        </div>
                        <div className="text-[14px] font-semibold text-[#1F7A4D]">
                          +{item.totalPoinRiil != null ? item.totalPoinRiil : item.totalPoinEstimasi} Poin
                        </div>
                      </div>

                      {(item.status === "DIVERIFIKASI" || item.status === "SELESAI") && (
                        <Link href={`/nasabah/nota/${item.id}?type=setor`}>
                          <Button variant="pearl-capsule" size="sm" leftIcon={<FileText className="w-3.5 h-3.5" />}>
                            Nota
                          </Button>
                        </Link>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Penukaran Poin */}
        {activeTab === "penukaran" && (
          <div>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-20 bg-[#f5f5f7] animate-pulse rounded-[18px]" />
                ))}
              </div>
            ) : penukaranList.length === 0 ? (
              <Card className="p-8 text-center bg-white">
                <EmptyState
                  icon={<Gift className="w-8 h-8" />}
                  title="Belum Ada Penukaran Poin"
                  description="Katalog hadiah kami menyediakan berbagai voucher belanja dan produk bermanfaat."
                  actionLabel="Lihat Katalog Hadiah"
                  onAction={() => window.location.assign("/nasabah/tukar-poin")}
                />
              </Card>
            ) : (
              <div className="space-y-3">
                {penukaranList.map((item) => (
                  <Card
                    key={item.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[17px] font-semibold text-[#1d1d1f]">
                          {item.hadiah?.nama || `Hadiah #${item.hadiahId}`}
                        </span>
                        <Badge
                          variant={
                            item.status === "SELESAI"
                              ? "success"
                              : item.status === "DITOLAK"
                              ? "danger"
                              : "warning"
                          }
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <div className="text-[14px] text-[#7a7a7a]">
                        Tanggal Pengajuan: {formatDate(item.tanggalPengajuan || item.createdAt)}
                        {item.kodePenukaran && ` • Kode: ${item.kodePenukaran}`}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f0f0f0]">
                      <div className="text-left sm:text-right">
                        <div className="text-[17px] font-semibold text-[#D92D20]">
                          -{item.poinDigunakan?.toLocaleString("id-ID")} Poin
                        </div>
                        <div className="text-[12px] text-[#7a7a7a]">
                          {item.status === "SELESAI" ? "Telah diserahkan" : "Sedang diproses"}
                        </div>
                      </div>

                      <Link href={`/nasabah/nota/${item.id}?type=penukaran`}>
                        <Button variant="pearl-capsule" size="sm" leftIcon={<FileText className="w-3.5 h-3.5" />}>
                          Nota
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </NasabahShell>
  );
}
