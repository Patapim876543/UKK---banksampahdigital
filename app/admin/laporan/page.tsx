"use client";

import React, { useEffect, useState } from "react";
import { AdminShell } from "@/components/layout/admin-shell";
import { Card, StatCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  FileText,
  Calendar,
  IconScale,
  Coins,
  TrendingUp,
  Download,
  Printer,
  IconPlasticBottle,
  IconPaperWaste,
  IconMetalCan,
  IconGlassJar,
} from "@/components/icons";
import { useAuth } from "@/context/auth-context";
import { getRekapBulanan } from "@/lib/api/rekapitulasi";
import { RekapBulanan, AdminProfile } from "@/lib/api/types";

export default function AdminLaporanPage() {
  const { user, logout } = useAuth();
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const [selectedBulan, setSelectedBulan] = useState(currentMonthStr);
  const [rekap, setRekap] = useState<RekapBulanan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRekap = async () => {
      setIsLoading(true);
      try {
        const res = await getRekapBulanan(selectedBulan);
        if (res.data) {
          setRekap(res.data);
        }
      } catch (err) {
        console.error("Gagal mengambil rekap bulanan:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRekap();
  }, [selectedBulan]);

  const handlePrint = () => {
    window.print();
  };

  const getWasteTypeColor = (jenis: string) => {
    switch (jenis.toUpperCase()) {
      case "PLASTIK":
        return "#0066cc";
      case "KERTAS":
        return "#B45309";
      case "LOGAM":
        return "#7a7a7a";
      case "KACA":
        return "#1F7A4D";
      default:
        return "#0066cc";
    }
  };

  const formatBulanTitle = (str: string) => {
    try {
      const [y, m] = str.split("-");
      const d = new Date(parseInt(y, 10), parseInt(m, 10) - 1, 1);
      return d.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
    } catch {
      return str;
    }
  };

  return (
    <AdminShell user={user as AdminProfile} onLogout={logout}>
      <div className="space-y-6">
        {/* Header (hidden on print) */}
        <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#1d1d1f] tracking-tight">
              Laporan Rekapitulasi Bulanan
            </h1>
            <p className="text-[17px] text-[#7a7a7a]">
              Statistik tonase sampah daur ulang, akumulasi poin, dan perputaran nilai rupiah.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#ffffff] px-3 py-1.5 rounded-full border border-[#e0e0e0]">
              <Calendar className="w-4 h-4 text-[#7a7a7a]" />
              <input
                type="month"
                value={selectedBulan}
                onChange={(e) => setSelectedBulan(e.target.value)}
                className="text-[13px] font-semibold text-[#1d1d1f] bg-transparent outline-none cursor-pointer"
              />
            </div>

            <Button
              variant="pearl-capsule"
              leftIcon={<Printer className="w-4 h-4" />}
              onClick={handlePrint}
            >
              Cetak Laporan
            </Button>
          </div>
        </div>

        {/* Printable Report Header */}
        <div className="bg-white p-6 rounded-[18px] border border-[#e0e0e0] space-y-6 print:border-none print:p-0">
          <div className="border-b border-[#f0f0f0] pb-4">
            <div className="text-[13px] font-semibold text-[#0066cc] uppercase">
              REKAPITULASI RESMI UNIT BANK SAMPAH
            </div>
            <h2 className="text-[24px] font-semibold text-[#1d1d1f]">
              Periode {formatBulanTitle(selectedBulan)}
            </h2>
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-[#7a7a7a]">
              Memuat data rekapitulasi...
            </div>
          ) : !rekap ? (
            <EmptyState
              icon={<FileText className="w-8 h-8" />}
              title="Data Rekap Belum Tersedia"
              description="Tidak ada data perolehan sampah pada periode bulan yang dipilih."
            />
          ) : (
            <div className="space-y-8">
              {/* Key Summary Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatCard
                  label="TOTAL TONASE TERKUMPUL"
                  value={`${(rekap.totalBerat || 0).toLocaleString("id-ID")} kg`}
                  subtext={`≈ ${((rekap.totalBerat || 0) / 1000).toFixed(2)} Ton sampah`}
                  icon={<IconScale className="w-5 h-5 text-[#1F7A4D]" />}
                />
                <StatCard
                  label="TOTAL POIN DITERBITKAN"
                  value={`+${(rekap.totalPoin || 0).toLocaleString("id-ID")}`}
                  subtext="Poin masuk ke nasabah"
                  icon={<Coins className="w-5 h-5 text-[#0066cc]" />}
                />
                <StatCard
                  label="TOTAL NILAI RUPIAH"
                  value={`Rp ${(rekap.totalNominal || 0).toLocaleString("id-ID")}`}
                  subtext="Estimasi perputaran ekonomi"
                  icon={<TrendingUp className="w-5 h-5 text-[#B45309]" />}
                />
              </div>

              {/* Minimalist Flat SVG Bar Visualization */}
              {rekap.rincianJenis && rekap.rincianJenis.length > 0 && (
                <div className="p-6 bg-[#f5f5f7] rounded-[18px] border border-[#e0e0e0] space-y-4">
                  <h3 className="text-[17px] font-semibold text-[#1d1d1f]">
                    Distribusi Berat per Jenis Sampah (kg)
                  </h3>

                  {/* Horizontal Bar Visualizer */}
                  <div className="space-y-3 pt-2">
                    {rekap.rincianJenis.map((r, idx) => {
                      const maxBerat = Math.max(...rekap.rincianJenis.map((x) => x.totalBerat), 1);
                      const percentage = Math.round((r.totalBerat / maxBerat) * 100);
                      const color = getWasteTypeColor(r.jenis);

                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-[14px]">
                            <span className="font-semibold text-[#1d1d1f] flex items-center gap-2">
                              <span
                                className="w-3 h-3 rounded-full inline-block"
                                style={{ backgroundColor: color }}
                              />
                              {r.jenis}
                            </span>
                            <span className="font-mono text-[#1d1d1f]">
                              {r.totalBerat.toLocaleString("id-ID")} kg
                              <span className="text-[#7a7a7a] font-sans ml-1">
                                (+{r.totalPoin?.toLocaleString("id-ID")} Poin)
                              </span>
                            </span>
                          </div>
                          <div className="w-full bg-[#e0e0e0] rounded-full h-3 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.max(percentage, 2)}%`,
                                backgroundColor: color,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Breakdown Table (Clean hairline style per Apple specs) */}
              <div className="space-y-3">
                <h3 className="text-[17px] font-semibold text-[#1d1d1f]">
                  Tabel Rincian Sampah &amp; Nilai Ekonomi
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[14px]">
                    <thead>
                      <tr className="border-b border-[#e0e0e0] text-[#7a7a7a] text-[13px] font-semibold uppercase">
                        <th className="py-3 px-2">Jenis Sampah</th>
                        <th className="py-3 px-2 text-right">Total Berat (kg)</th>
                        <th className="py-3 px-2 text-right">Poin Diterbitkan</th>
                        <th className="py-3 px-2 text-right">Estimasi Rupiah</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0f0f0]">
                      {rekap.rincianJenis && rekap.rincianJenis.length > 0 ? (
                        rekap.rincianJenis.map((r, i) => (
                          <tr key={i} className="hover:bg-[#f5f5f7]/50">
                            <td className="py-3 px-2 font-semibold text-[#1d1d1f]">
                              {r.jenis}
                            </td>
                            <td className="py-3 px-2 text-right font-mono text-[#1d1d1f]">
                              {r.totalBerat.toLocaleString("id-ID")} kg
                            </td>
                            <td className="py-3 px-2 text-right font-semibold text-[#1F7A4D]">
                              +{r.totalPoin?.toLocaleString("id-ID")} Poin
                            </td>
                            <td className="py-3 px-2 text-right font-semibold text-[#1d1d1f]">
                              Rp {r.totalNominal?.toLocaleString("id-ID") || 0}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-[#7a7a7a]">
                            Belum ada rincian data untuk bulan ini.
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-[#1d1d1f] font-semibold text-[#1d1d1f]">
                        <td className="py-4 px-2">TOTAL AKUMULASI</td>
                        <td className="py-4 px-2 text-right font-mono">
                          {(rekap.totalBerat || 0).toLocaleString("id-ID")} kg
                        </td>
                        <td className="py-4 px-2 text-right text-[#1F7A4D]">
                          +{(rekap.totalPoin || 0).toLocaleString("id-ID")} Poin
                        </td>
                        <td className="py-4 px-2 text-right">
                          Rp {(rekap.totalNominal || 0).toLocaleString("id-ID")}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
