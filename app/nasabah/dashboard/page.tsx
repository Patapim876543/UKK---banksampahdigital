"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NasabahShell } from "@/components/layout/nasabah-shell";
import { StatCard, Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Coins,
  IconScale,
  History,
  Gift,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  IconRecycle,
} from "@/components/icons";
import { useAuth } from "@/context/auth-context";
import { getDashboardSummary } from "@/lib/api/dashboard";
import { getMySetoran } from "@/lib/api/setorSampah";
import { DashboardSummaryNasabah, Setoran, NasabahProfile } from "@/lib/api/types";

export default function NasabahDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading, logout, refreshUser } = useAuth();

  const [summary, setSummary] = useState<DashboardSummaryNasabah | null>(null);
  const [recentSetoran, setRecentSetoran] = useState<Setoran[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }
  }, [isAuthLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await refreshUser();
        // Fetch summary
        const [sumRes, setoranRes] = await Promise.allSettled([
          getDashboardSummary(),
          getMySetoran(),
        ]);

        if (sumRes.status === "fulfilled" && sumRes.value.data) {
          setSummary(sumRes.value.data);
        }
        if (setoranRes.status === "fulfilled" && setoranRes.value.data) {
          setRecentSetoran(setoranRes.value.data.slice(0, 5));
        }
      } catch (err: any) {
        setError(err.message || "Gagal memuat data ringkasan.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, refreshUser]);

  const nasabah = user as NasabahProfile;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DIVERIFIKASI":
      case "SELESAI":
        return <Badge variant="success">Diverifikasi</Badge>;
      case "MENUNGGU_KONFIRMASI":
        return <Badge variant="warning">Menunggu Konfirmasi</Badge>;
      case "DITOLAK":
        return <Badge variant="danger">Ditolak</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return "-";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <NasabahShell user={nasabah} onLogout={logout}>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#1d1d1f] tracking-tight">
              Halo, {nasabah?.namaLengkap || nasabah?.username || "Nasabah"}
            </h1>
            <p className="text-[17px] text-[#7a7a7a]">
              Pantau akumulasi poin dan kontribusi daur ulang Anda hari ini.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/nasabah/setor">
              <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
                Setor Sampah
              </Button>
            </Link>
            <Link href="/nasabah/tukar-poin">
              <Button variant="secondary-pill" leftIcon={<Gift className="w-4 h-4" />}>
                Tukar Poin
              </Button>
            </Link>
          </div>
        </div>

        {/* Big Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            label="SALDO POIN ANDA"
            value={
              isLoading
                ? "..."
                : `${(nasabah?.totalPoin ?? summary?.totalPoin ?? 0).toLocaleString("id-ID")} Poin`
            }
            subtext="Dapat ditukarkan dengan hadiah & voucher"
            icon={<Coins className="w-5 h-5 text-[#0066cc]" />}
          />
          <StatCard
            label="TOTAL SAMPAH TERDAUR ULANG"
            value={
              isLoading
                ? "..."
                : `${(summary?.totalBeratKg ?? 0).toLocaleString("id-ID")} kg`
            }
            subtext="Timbangan riil terverifikasi"
            icon={<IconScale className="w-5 h-5 text-[#1F7A4D]" />}
          />
          <StatCard
            label="TRANSAKSI SELESAI"
            value={
              isLoading
                ? "..."
                : (summary?.totalSetoranSelesai ?? recentSetoran.length).toString()
            }
            subtext="Penyetoran disetujui admin"
            icon={<History className="w-5 h-5 text-[#B45309]" />}
          />
        </div>

        {/* Quick Recycle Awareness Banner */}
        <div className="bg-[#f5f5f7] rounded-[18px] p-6 border border-[#e0e0e0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#eaf5ee] text-[#1F7A4D] flex items-center justify-center shrink-0">
              <IconRecycle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[17px] font-semibold text-[#1d1d1f]">
                Lihat Nilai Tukar Poin Sampah
              </div>
              <div className="text-[14px] text-[#7a7a7a]">
                Cek harga per kg dan rasio poin untuk plastik, kertas, logam, dan kaca.
              </div>
            </div>
          </div>
          <Link href="/nasabah/katalog" className="shrink-0">
            <Button variant="pearl-capsule" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Buka Katalog Sampah
            </Button>
          </Link>
        </div>

        {/* Recent Submissions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[21px] font-semibold text-[#1d1d1f] tracking-tight">
              Penyetoran Sampah Terakhir
            </h2>
            <Link
              href="/nasabah/riwayat"
              className="text-[14px] font-semibold text-[#0066cc] hover:underline"
            >
              Lihat Semua Riwayat &rarr;
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-20 bg-[#f5f5f7] animate-pulse rounded-[18px]" />
              ))}
            </div>
          ) : recentSetoran.length === 0 ? (
            <Card className="p-8 text-center bg-white">
              <EmptyState
                icon={<IconScale className="w-8 h-8" />}
                title="Belum Ada Penyetoran"
                description="Anda belum pernah mengajukan penyetoran sampah. Mari mulai langkah pertama daur ulang!"
                actionLabel="+ Setor Sampah Sekarang"
                onAction={() => router.push("/nasabah/setor")}
              />
            </Card>
          ) : (
            <div className="space-y-3">
              {recentSetoran.map((item) => (
                <Card
                  key={item.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#0066cc]/40 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[17px] text-[#1d1d1f]">
                        {item.kodeSetor || `Setor #${item.id}`}
                      </span>
                      {getStatusBadge(item.status)}
                    </div>
                    <div className="text-[14px] text-[#7a7a7a]">
                      Tanggal: {formatDate(item.tanggalSetor || item.createdAt)}
                      {item.catatan && ` • Catatan: ${item.catatan}`}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f0f0f0]">
                    <div className="text-left sm:text-right">
                      <div className="text-[17px] font-semibold text-[#1d1d1f]">
                        {item.totalBeratRiil != null ? `${item.totalBeratRiil} kg` : `${item.totalBeratEstimasi} kg`}
                        <span className="text-[12px] text-[#7a7a7a] font-normal ml-1">
                          {item.totalBeratRiil != null ? "(Riil)" : "(Est)"}
                        </span>
                      </div>
                      {item.status === "DITOLAK" ? (
                        <div className="text-[14px] font-semibold text-[#7a7a7a]">
                          0 Poin <span className="text-[12px] font-normal">(Ditolak)</span>
                        </div>
                      ) : item.status === "MENUNGGU_KONFIRMASI" ? (
                        <div className="text-[14px] font-semibold text-[#B45309]">
                          +{item.totalPoinEstimasi} Poin <span className="text-[12px] font-normal">(Estimasi)</span>
                        </div>
                      ) : (
                        <div className="text-[14px] font-semibold text-[#1F7A4D]">
                          +{item.totalPoinRiil != null ? item.totalPoinRiil : item.totalPoinEstimasi} Poin <span className="text-[12px] font-normal">(Riil)</span>
                        </div>
                      )}
                    </div>

                    <Link
                      href={`/nasabah/status`}
                      className="px-3 py-1.5 rounded-full border border-[#e0e0e0] hover:bg-[#f5f5f7] text-[14px] font-semibold text-[#0066cc] transition-colors btn-apple-press"
                    >
                      Detail
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </NasabahShell>
  );
}
