"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/layout/admin-shell";
import { StatCard, Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  BarChart3,
  User,
  Clock,
  IconScale,
  Coins,
  CheckCircle2,
  ArrowRight,
  Plus,
  Layers,
  Gift,
} from "@/components/icons";
import { useAuth } from "@/context/auth-context";
import { getDashboardStats } from "@/lib/api/dashboard";
import { getAllSetoranAdmin } from "@/lib/api/setorSampah";
import { DashboardStatsAdmin, Setoran, AdminProfile } from "@/lib/api/types";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, role, isAuthenticated, isLoading: isAuthLoading, logout } = useAuth();

  const [stats, setStats] = useState<DashboardStatsAdmin | null>(null);
  const [pendingSetoran, setPendingSetoran] = useState<Setoran[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && (!isAuthenticated || role !== "ADMIN")) {
      router.push("/login");
      return;
    }
  }, [isAuthLoading, isAuthenticated, role, router]);

  useEffect(() => {
    if (!isAuthenticated || role !== "ADMIN") return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [statsRes, setoranRes] = await Promise.allSettled([
          getDashboardStats(),
          getAllSetoranAdmin({ status: "MENUNGGU_KONFIRMASI" }),
        ]);

        if (statsRes.status === "fulfilled" && statsRes.value.data) {
          setStats(statsRes.value.data);
        }
        if (setoranRes.status === "fulfilled" && setoranRes.value.data) {
          setPendingSetoran(setoranRes.value.data.slice(0, 5));
        }
      } catch (err) {
        console.error("Gagal mengambil data dashboard admin:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated, role]);

  const admin = user as AdminProfile;

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
    <AdminShell user={admin} onLogout={logout}>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#1d1d1f] tracking-tight">
              Dashboard Pengelola Unit
            </h1>
            <p className="text-[17px] text-[#7a7a7a]">
              {admin?.namaUnit || "Unit Bank Sampah"} — Pengelola: {admin?.namaPengelola || "Admin"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/verifikasi">
              <Button variant="primary" leftIcon={<CheckCircle2 className="w-4 h-4" />}>
                Verifikasi Setoran ({pendingSetoran.length})
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="TOTAL NASABAH"
            value={isLoading ? "..." : (stats?.totalNasabah ?? 0).toString()}
            subtext="Nasabah aktif terdaftar"
            icon={<User className="w-5 h-5 text-[#0066cc]" />}
          />
          <StatCard
            label="MENUNGGU VERIFIKASI"
            value={isLoading ? "..." : (stats?.totalSetoranPending ?? pendingSetoran.length).toString()}
            subtext="Perlu penimbangan fisik"
            icon={<Clock className="w-5 h-5 text-[#B45309]" />}
          />
          <StatCard
            label="SAMPAH TERKUMPUL"
            value={isLoading ? "..." : `${(stats?.totalBeratTerkumpul ?? 0).toLocaleString("id-ID")} kg`}
            subtext="Tonase terverifikasi"
            icon={<IconScale className="w-5 h-5 text-[#1F7A4D]" />}
          />
          <StatCard
            label="POIN BEREDAR"
            value={isLoading ? "..." : `${(stats?.totalPoinBeredar ?? 0).toLocaleString("id-ID")}`}
            subtext="Total poin nasabah"
            icon={<Coins className="w-5 h-5 text-[#0066cc]" />}
          />
        </div>

        {/* Quick Management Shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/admin/nasabah" className="block">
            <Card className="p-5 bg-[#ffffff] hover:border-[#0066cc]/50 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#0066cc]">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-[15px] text-[#1d1d1f]">Kelola Nasabah</div>
                  <div className="text-[12px] text-[#7a7a7a]">Data kontak &amp; saldo</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#7a7a7a]" />
            </Card>
          </Link>

          <Link href="/admin/kategori" className="block">
            <Card className="p-5 bg-[#ffffff] hover:border-[#0066cc]/50 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#1F7A4D]">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-[15px] text-[#1d1d1f]">Kategori Sampah</div>
                  <div className="text-[12px] text-[#7a7a7a]">Harga &amp; rate poin/kg</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#7a7a7a]" />
            </Card>
          </Link>

          <Link href="/admin/hadiah" className="block">
            <Card className="p-5 bg-[#ffffff] hover:border-[#0066cc]/50 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#B45309]">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-[15px] text-[#1d1d1f]">Katalog Hadiah</div>
                  <div className="text-[12px] text-[#7a7a7a]">Voucher &amp; sembako</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#7a7a7a]" />
            </Card>
          </Link>
        </div>

        {/* Incoming Setoran Waiting Verification */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[21px] font-semibold text-[#1d1d1f] tracking-tight">
                Penyetoran Sampah Menunggu Verifikasi
              </h2>
              <p className="text-[14px] text-[#7a7a7a]">
                Pengajuan setoran yang perlu ditimbang riil dan divalidasi.
              </p>
            </div>
            <Link
              href="/admin/verifikasi"
              className="text-[14px] font-semibold text-[#0066cc] hover:underline"
            >
              Buka Semua Verifikasi &rarr;
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-20 bg-[#f5f5f7] animate-pulse rounded-[18px]" />
              ))}
            </div>
          ) : pendingSetoran.length === 0 ? (
            <Card className="p-8 text-center bg-white">
              <EmptyState
                icon={<CheckCircle2 className="w-8 h-8 text-[#1F7A4D]" />}
                title="Semua Setoran Telah Terverifikasi"
                description="Tidak ada antrean penyetoran baru saat ini."
              />
            </Card>
          ) : (
            <div className="space-y-3">
              {pendingSetoran.map((setor) => (
                <Card
                  key={setor.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white hover:border-[#0066cc]/40 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[17px] text-[#1d1d1f]">
                        {setor.kodeSetor || `Setoran #${setor.id}`}
                      </span>
                      <Badge variant="warning">Menunggu Verifikasi</Badge>
                    </div>
                    <div className="text-[14px] text-[#7a7a7a]">
                      Nasabah: <strong className="text-[#1d1d1f]">{setor.nasabah?.namaLengkap || `ID #${setor.nasabahId}`}</strong>
                      {" • "}
                      Tanggal: {formatDate(setor.tanggalSetor || setor.createdAt)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f0f0f0]">
                    <div className="text-left sm:text-right">
                      <div className="text-[17px] font-semibold text-[#1d1d1f]">
                        {setor.totalBeratEstimasi} kg
                      </div>
                      <div className="text-[14px] font-semibold text-[#0066cc]">
                        Est: +{setor.totalPoinEstimasi} Poin
                      </div>
                    </div>

                    <Link href={`/admin/verifikasi?id=${setor.id}`}>
                      <Button variant="primary" size="sm">
                        Timbang &amp; Verifikasi
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
