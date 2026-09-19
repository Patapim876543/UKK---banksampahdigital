"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { NasabahShell } from "@/components/layout/nasabah-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Alert } from "@/components/ui/toast";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Gift,
  Coins,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
} from "@/components/icons";
import { useAuth } from "@/context/auth-context";
import { getHadiah } from "@/lib/api/hadiah";
import { tukarPoin } from "@/lib/api/penukaranPoin";
import { Hadiah, NasabahProfile } from "@/lib/api/types";

export default function NasabahTukarPoinPage() {
  const { user, logout, refreshUser } = useAuth();
  const [hadiahList, setHadiahList] = useState<Hadiah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal confirm state
  const [selectedHadiah, setSelectedHadiah] = useState<Hadiah | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [redeemedResult, setRedeemedResult] = useState<any | null>(null);

  const nasabah = user as NasabahProfile;
  const currentPoin = nasabah?.totalPoin || 0;

  const fetchHadiah = async () => {
    setIsLoading(true);
    try {
      const res = await getHadiah();
      if (res.data) {
        setHadiahList(res.data);
      }
    } catch (err) {
      console.error("Gagal mengambil daftar hadiah:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
    fetchHadiah();

    const handleFocus = () => {
      refreshUser();
      fetchHadiah();
    };
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [refreshUser]);

  const filteredHadiah = hadiahList.filter((h) =>
    h.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.deskripsi?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirmTukar = async () => {
    if (!selectedHadiah) return;
    setModalError(null);
    setIsRedeeming(true);

    try {
      const res = await tukarPoin(selectedHadiah.id);
      if (res.data) {
        setRedeemedResult(res.data);
        await refreshUser();
        await fetchHadiah();
      }
    } catch (err: any) {
      setModalError(err.message || "Gagal melakukan penukaran poin.");
    } finally {
      setIsRedeeming(false);
    }
  };

  const closeModal = () => {
    setSelectedHadiah(null);
    setModalError(null);
    setRedeemedResult(null);
  };

  return (
    <NasabahShell user={nasabah} onLogout={logout}>
      <div className="space-y-6">
        {/* Header & Balance Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#1d1d1f] tracking-tight">
              Tukar Poin Reward
            </h1>
            <p className="text-[17px] text-[#7a7a7a]">
              Pilih hadiah, voucher belanja, atau produk kebutuhan yang dapat Anda tukarkan dengan poin.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#eaf5ee] border border-[#1F7A4D]/20 px-5 py-2.5 rounded-full">
            <Coins className="w-5 h-5 text-[#1F7A4D]" />
            <div className="text-[14px]">
              <span className="text-[#7a7a7a]">Saldo Tersedia: </span>
              <strong className="text-[#1F7A4D] text-[16px]">
                {currentPoin.toLocaleString("id-ID")} Poin
              </strong>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="w-full max-w-md relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#7a7a7a]" />
          <input
            type="text"
            placeholder="Cari hadiah atau voucher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#ffffff] text-[#1d1d1f] text-[15px] pl-11 pr-4 py-2.5 rounded-full border border-[#e0e0e0] focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3] outline-none transition-all placeholder:text-[#7a7a7a]"
          />
        </div>

        {/* Rewards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-64 bg-[#f5f5f7] animate-pulse rounded-[18px]" />
            ))}
          </div>
        ) : filteredHadiah.length === 0 ? (
          <Card className="p-8 text-center bg-white">
            <EmptyState
              icon={<Gift className="w-8 h-8" />}
              title="Katalog Hadiah Kosong"
              description="Belum ada hadiah yang tersedia atau cocok dengan pencarian Anda."
              actionLabel="Reset Pencarian"
              onAction={() => setSearchQuery("")}
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHadiah.map((hadiah) => {
              const isEnoughPoints = currentPoin >= hadiah.poinDibutuhkan;
              const isAvailable = hadiah.stok > 0;
              const canRedeem = isEnoughPoints && isAvailable;

              return (
                <Card
                  key={hadiah.id}
                  className={`flex flex-col justify-between p-6 transition-all ${
                    canRedeem
                      ? "bg-white hover:border-[#0066cc]/40"
                      : "bg-[#fafafc] opacity-80"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="w-14 h-14 rounded-[14px] bg-[#f5f5f7] flex items-center justify-center shrink-0">
                        {hadiah.foto ? (
                          <img
                            src={hadiah.foto}
                            alt={hadiah.nama}
                            className="w-full h-full object-cover rounded-[14px]"
                          />
                        ) : (
                          <Gift className="w-8 h-8 text-[#0066cc]" />
                        )}
                      </div>
                      <Badge variant={isAvailable ? "neutral" : "danger"}>
                        {isAvailable ? `Stok: ${hadiah.stok}` : "Habis"}
                      </Badge>
                    </div>

                    <h3 className="text-[21px] font-semibold text-[#1d1d1f] tracking-tight mb-1">
                      {hadiah.nama}
                    </h3>
                    {hadiah.deskripsi && (
                      <p className="text-[14px] text-[#7a7a7a] line-clamp-2 mb-4">
                        {hadiah.deskripsi}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#f0f0f0] space-y-3">
                    <div className="flex items-center justify-between text-[14px]">
                      <span className="text-[#7a7a7a]">Poin Dibutuhkan:</span>
                      <div className="flex items-center gap-1 font-semibold text-[#0066cc] text-[16px]">
                        <Coins className="w-4 h-4" />
                        <span>{hadiah.poinDibutuhkan?.toLocaleString("id-ID")} Poin</span>
                      </div>
                    </div>

                    {!isEnoughPoints && isAvailable && (
                      <p className="text-[12px] text-[#D92D20]">
                        Kurang {(hadiah.poinDibutuhkan - currentPoin).toLocaleString("id-ID")} poin lagi
                      </p>
                    )}

                    <Button
                      variant={canRedeem ? "primary" : "secondary-pill"}
                      disabled={!canRedeem}
                      className="w-full"
                      onClick={() => setSelectedHadiah(hadiah)}
                    >
                      {!isAvailable
                        ? "Stok Habis"
                        : !isEnoughPoints
                        ? "Poin Tidak Cukup"
                        : "Tukar Sekarang"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Confirmation & Result Modal */}
        <Modal
          isOpen={!!selectedHadiah}
          onClose={closeModal}
          title={redeemedResult ? "Penukaran Berhasil!" : "Konfirmasi Penukaran Poin"}
          maxWidth="sm"
        >
          {redeemedResult ? (
            <div className="space-y-4 text-center py-2">
              <div className="w-16 h-16 rounded-full bg-[#eaf5ee] text-[#1F7A4D] flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-[21px] font-semibold text-[#1d1d1f]">
                {selectedHadiah?.nama}
              </h4>
              <p className="text-[14px] text-[#7a7a7a] max-w-xs mx-auto">
                Penukaran poin Anda telah tercatat. Silakan tunjukkan nota kuitansi kepada petugas bank sampah unit untuk penyerahan hadiah.
              </p>
              {redeemedResult.kodePenukaran && (
                <div className="p-3 bg-[#f5f5f7] rounded-[8px] font-mono text-[14px] text-[#0066cc]">
                  Kode: <strong>{redeemedResult.kodePenukaran}</strong>
                </div>
              )}
              <div className="pt-3 flex flex-col gap-2">
                <Link href={`/nasabah/nota/${redeemedResult.id}?type=penukaran`}>
                  <Button variant="primary" className="w-full" leftIcon={<FileText className="w-4 h-4" />}>
                    Buka Nota Kuitansi
                  </Button>
                </Link>
                <Button variant="secondary-pill" onClick={closeModal} className="w-full">
                  Selesai
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {modalError && (
                <Alert variant="danger" onClose={() => setModalError(null)}>
                  {modalError}
                </Alert>
              )}

              <p className="text-[14px] text-[#7a7a7a]">
                Apakah Anda yakin ingin menukarkan poin dengan hadiah berikut?
              </p>

              <div className="p-4 bg-[#f5f5f7] rounded-[12px] space-y-2 text-[14px]">
                <div className="flex justify-between">
                  <span className="text-[#7a7a7a]">Hadiah:</span>
                  <strong className="text-[#1d1d1f]">{selectedHadiah?.nama}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7a7a7a]">Poin Dibutuhkan:</span>
                  <strong className="text-[#D92D20]">
                    -{selectedHadiah?.poinDibutuhkan?.toLocaleString("id-ID")} Poin
                  </strong>
                </div>
                <div className="flex justify-between border-t border-[#e0e0e0] pt-2">
                  <span className="text-[#7a7a7a]">Sisa Saldo Setelah Tukar:</span>
                  <strong className="text-[#1F7A4D]">
                    {((currentPoin || 0) - (selectedHadiah?.poinDibutuhkan || 0)).toLocaleString("id-ID")} Poin
                  </strong>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="secondary-pill" onClick={closeModal}>
                  Batal
                </Button>
                <Button
                  variant="primary"
                  isLoading={isRedeeming}
                  onClick={handleConfirmTukar}
                >
                  Konfirmasi Tukar
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </NasabahShell>
  );
}
