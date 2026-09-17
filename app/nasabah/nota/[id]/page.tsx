"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { NasabahShell } from "@/components/layout/nasabah-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Printer,
  ArrowLeft,
  IconRecycle,
  CheckCircle2,
  Download,
} from "@/components/icons";
import { useAuth } from "@/context/auth-context";
import { getSetoranDetail } from "@/lib/api/setorSampah";
import { getNotaPenukaran } from "@/lib/api/penukaranPoin";

function NotaContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { user, logout } = useAuth();

  const id = Number(params.id);
  const type = searchParams.get("type") || "setor"; // "setor" | "penukaran"

  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchNota = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (type === "penukaran") {
          const res = await getNotaPenukaran(id);
          setData(res.data);
        } else {
          const res = await getSetoranDetail(id);
          setData(res.data);
        }
      } catch (err: any) {
        setError(err.message || "Gagal memuat nota transaksi.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchNota();
  }, [id, type]);

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  return (
    <NasabahShell user={user as any} onLogout={logout}>
      <div className="max-w-xl mx-auto space-y-6">
        {/* Navigation & Action buttons (hidden on print) */}
        <div className="print:hidden flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1 text-[14px] font-semibold text-[#7a7a7a] hover:text-[#1d1d1f] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Printer className="w-4 h-4" />}
              onClick={handlePrint}
            >
              Cetak / Simpan PDF
            </Button>
          </div>
        </div>

        {/* The Printable Digital Receipt */}
        <div className="bg-[#ffffff] rounded-[18px] border border-[#e0e0e0] p-8 shadow-sm print:border-none print:shadow-none print:p-0">
          {isLoading ? (
            <div className="py-16 text-center text-[#7a7a7a]">
              Memuat nota kuitansi...
            </div>
          ) : error ? (
            <div className="py-12 text-center text-[#D92D20]">
              {error}
            </div>
          ) : data ? (
            <div className="space-y-6">
              {/* Receipt Header */}
              <div className="text-center border-b border-dashed border-[#e0e0e0] pb-6 space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#eaf5ee] text-[#1F7A4D] flex items-center justify-center">
                  <IconRecycle className="w-6 h-6" />
                </div>
                <h2 className="text-[21px] font-semibold text-[#1d1d1f] tracking-tight">
                  EcoBank Digital
                </h2>
                <p className="text-[13px] text-[#7a7a7a]">
                  Bank Sampah &amp; Daur Ulang Modern
                </p>
                <div className="pt-2">
                  <Badge variant="success">
                    {type === "setor" ? "NOTA PENYETORAN SAMPAH" : "BUKTI PENUKARAN REWARD"}
                  </Badge>
                </div>
              </div>

              {/* Transaction Metadata */}
              <div className="text-[13px] space-y-2 text-[#7a7a7a] border-b border-dashed border-[#e0e0e0] pb-5">
                <div className="flex justify-between">
                  <span>Nomor Transaksi:</span>
                  <strong className="font-mono text-[#1d1d1f]">
                    {data.kodeSetor || data.kodePenukaran || `#TRX-${data.id}`}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Tanggal &amp; Waktu:</span>
                  <span className="text-[#1d1d1f]">
                    {formatDate(data.tanggalSetor || data.tanggalPengajuan || data.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Nama Nasabah:</span>
                  <span className="font-semibold text-[#1d1d1f]">
                    {data.nasabah?.namaLengkap || data.namaNasabah || user?.username}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-semibold text-[#1F7A4D]">{data.status}</span>
                </div>
              </div>

              {/* Transaction Content Items */}
              {type === "setor" ? (
                <div className="space-y-3">
                  <div className="text-[13px] font-semibold text-[#7a7a7a] uppercase">
                    Rincian Sampah Terverifikasi
                  </div>
                  <div className="space-y-2">
                    {data.items && data.items.length > 0 ? (
                      data.items.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex justify-between text-[14px] py-1 border-b border-[#f0f0f0]"
                        >
                          <div>
                            <div className="font-semibold text-[#1d1d1f]">
                              {item.kategori?.nama || `Sampah Item #${idx + 1}`}
                            </div>
                            <div className="text-[12px] text-[#7a7a7a]">
                              Berat: {item.beratRiil != null ? item.beratRiil : item.beratEstimasi} kg
                            </div>
                          </div>
                          <div className="font-semibold text-[#1F7A4D]">
                            +{item.poinRiil != null ? item.poinRiil : item.poinEstimasi} Poin
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-[14px] text-[#7a7a7a]">
                        Total Timbangan: {data.totalBeratRiil || data.totalBeratEstimasi} kg
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t-2 border-[#1d1d1f] flex justify-between items-baseline">
                    <span className="text-[14px] font-semibold text-[#1d1d1f]">
                      TOTAL POIN DITERIMA:
                    </span>
                    <span className="text-[24px] font-semibold text-[#1F7A4D]">
                      +{data.totalPoinRiil != null ? data.totalPoinRiil : data.totalPoinEstimasi} Poin
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-[13px] font-semibold text-[#7a7a7a] uppercase">
                    Hadiah yang Ditukarkan
                  </div>
                  <div className="p-4 bg-[#f5f5f7] rounded-[12px] flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-[17px] text-[#1d1d1f]">
                        {data.hadiah?.nama || data.namaHadiah || "Reward Voucher"}
                      </div>
                      <div className="text-[13px] text-[#7a7a7a]">
                        Kode Klaim: {data.kodePenukaran || `#KL-${data.id}`}
                      </div>
                    </div>
                    <div className="text-[18px] font-semibold text-[#D92D20]">
                      -{data.poinDigunakan?.toLocaleString("id-ID")} Poin
                    </div>
                  </div>
                </div>
              )}

              {/* Barcode / Verification Stamp */}
              <div className="pt-6 border-t border-dashed border-[#e0e0e0] text-center space-y-2">
                <div className="font-mono text-[12px] text-[#7a7a7a] tracking-widest uppercase">
                  * {data.kodeSetor || data.kodePenukaran || `ECO-${data.id}`} *
                </div>
                <p className="text-[12px] text-[#7a7a7a] max-w-xs mx-auto">
                  Terima kasih telah berkontribusi menjaga kelestarian lingkungan bersama Bank Sampah Digital.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </NasabahShell>
  );
}

export default function NotaPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#7a7a7a]">Memuat nota...</div>}>
      <NotaContent />
    </Suspense>
  );
}
