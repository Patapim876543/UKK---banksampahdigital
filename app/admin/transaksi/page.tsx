"use client";

import React, { useEffect, useState } from "react";
import { AdminShell } from "@/components/layout/admin-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  History,
  Calendar,
  IconScale,
  Gift,
  Coins,
  Search,
} from "@/components/icons";
import { useAuth } from "@/context/auth-context";
import { getAllSetoranAdmin } from "@/lib/api/setorSampah";
import { getAllPenukaranAdmin } from "@/lib/api/penukaranPoin";
import { Setoran, PenukaranPoin, AdminProfile } from "@/lib/api/types";

export default function AdminTransaksiPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"setoran" | "penukaran">("setoran");
  const [setoranList, setSetoranList] = useState<Setoran[]>([]);
  const [penukaranList, setPenukaranList] = useState<PenukaranPoin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBulan, setSelectedBulan] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [setoranRes, penukaranRes] = await Promise.allSettled([
        getAllSetoranAdmin({ bulan: selectedBulan || undefined }),
        getAllPenukaranAdmin(selectedBulan || undefined),
      ]);

      if (setoranRes.status === "fulfilled" && setoranRes.value.data) {
        setSetoranList(setoranRes.value.data);
      }
      if (penukaranRes.status === "fulfilled" && penukaranRes.value.data) {
        setPenukaranList(penukaranRes.value.data);
      }
    } catch (err) {
      console.error("Gagal mengambil data transaksi:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedBulan]);

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

  const filteredSetoran = setoranList.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      (s.kodeSetor && s.kodeSetor.toLowerCase().includes(q)) ||
      (s.nasabah?.namaLengkap && s.nasabah.namaLengkap.toLowerCase().includes(q)) ||
      (s.nasabah?.username && s.nasabah.username.toLowerCase().includes(q))
    );
  });

  const filteredPenukaran = penukaranList.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      (p.kodePenukaran && p.kodePenukaran.toLowerCase().includes(q)) ||
      (p.nasabah?.namaLengkap && p.nasabah.namaLengkap.toLowerCase().includes(q)) ||
      (p.hadiah?.nama && p.hadiah.nama.toLowerCase().includes(q))
    );
  });

  return (
    <AdminShell user={user as AdminProfile} onLogout={logout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#1d1d1f] tracking-tight">
              Seluruh Riwayat Transaksi Unit
            </h1>
            <p className="text-[17px] text-[#7a7a7a]">
              Pencatatan menyeluruh setoran sampah dan penukaran hadiah nasabah.
            </p>
          </div>
        </div>

        {/* Filters & Tabs Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e0e0e0] pb-3">
          {/* Apple Underline Tabs */}
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
              Setoran Sampah ({setoranList.length})
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

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Pill */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7a7a]" />
              <input
                type="text"
                placeholder="Cari transaksi / nasabah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#ffffff] text-[13px] pl-9 pr-3 py-1.5 rounded-full border border-[#e0e0e0] outline-none"
              />
            </div>

            {/* Month Filter */}
            <div className="flex items-center gap-1">
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
          </div>
        </div>

        {/* Tab 1: Setoran Sampah */}
        {activeTab === "setoran" && (
          <div>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-20 bg-[#f5f5f7] animate-pulse rounded-[18px]" />
                ))}
              </div>
            ) : filteredSetoran.length === 0 ? (
              <Card className="p-8 text-center bg-white">
                <EmptyState
                  icon={<History className="w-8 h-8" />}
                  title="Tidak Ada Data Penyetoran"
                  description="Belum ada transaksi penyetoran yang sesuai dengan filter."
                />
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredSetoran.map((s) => (
                  <Card
                    key={s.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[17px] text-[#1d1d1f]">
                          {s.kodeSetor || `TRX-${s.id}`}
                        </span>
                        <Badge
                          variant={
                            s.status === "DIVERIFIKASI" || s.status === "SELESAI"
                              ? "success"
                              : s.status === "DITOLAK"
                              ? "danger"
                              : "warning"
                          }
                        >
                          {s.status}
                        </Badge>
                      </div>
                      <div className="text-[14px] text-[#7a7a7a]">
                        Nasabah: <strong className="text-[#1d1d1f]">{s.nasabah?.namaLengkap || `ID #${s.nasabahId}`}</strong>
                        {" • "}
                        Tanggal: {formatDate(s.tanggalSetor || s.createdAt)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f0f0f0]">
                      <div className="text-left sm:text-right">
                        <div className="text-[17px] font-semibold text-[#1d1d1f]">
                          {s.totalBeratRiil != null ? `${s.totalBeratRiil} kg (Riil)` : `${s.totalBeratEstimasi} kg (Est)`}
                        </div>
                        <div className="text-[14px] font-semibold text-[#1F7A4D]">
                          +{s.totalPoinRiil != null ? s.totalPoinRiil : s.totalPoinEstimasi} Poin
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Penukaran Hadiah */}
        {activeTab === "penukaran" && (
          <div>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-20 bg-[#f5f5f7] animate-pulse rounded-[18px]" />
                ))}
              </div>
            ) : filteredPenukaran.length === 0 ? (
              <Card className="p-8 text-center bg-white">
                <EmptyState
                  icon={<Gift className="w-8 h-8" />}
                  title="Tidak Ada Data Penukaran"
                  description="Belum ada transaksi penukaran hadiah yang sesuai dengan filter."
                />
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredPenukaran.map((p) => (
                  <Card
                    key={p.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[17px] text-[#1d1d1f]">
                          {p.hadiah?.nama || `Hadiah #${p.hadiahId}`}
                        </span>
                        <Badge
                          variant={
                            p.status === "SELESAI"
                              ? "success"
                              : p.status === "DITOLAK"
                              ? "danger"
                              : "warning"
                          }
                        >
                          {p.status}
                        </Badge>
                      </div>
                      <div className="text-[14px] text-[#7a7a7a]">
                        Nasabah: <strong className="text-[#1d1d1f]">{p.nasabah?.namaLengkap || `ID #${p.nasabahId}`}</strong>
                        {p.kodePenukaran && ` • Kode: ${p.kodePenukaran}`}
                        {" • "}
                        Tanggal: {formatDate(p.tanggalPengajuan || p.createdAt)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f0f0f0]">
                      <div className="text-left sm:text-right">
                        <div className="text-[17px] font-semibold text-[#D92D20]">
                          -{p.poinDigunakan?.toLocaleString("id-ID")} Poin
                        </div>
                        <div className="text-[12px] text-[#7a7a7a]">
                          {p.status === "SELESAI" ? "Telah Diserahkan" : "Menunggu Serah Terima"}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
