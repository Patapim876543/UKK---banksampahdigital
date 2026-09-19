"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AdminShell } from "@/components/layout/admin-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Alert } from "@/components/ui/toast";
import { EmptyState } from "@/components/ui/empty-state";
import {
  IconScale,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Coins,
  Search,
  RefreshCw,
} from "@/components/icons";
import { useAuth } from "@/context/auth-context";
import { getAllSetoranAdmin, verifySetoran } from "@/lib/api/setorSampah";
import { Setoran, AdminProfile, VerifyItemSetorDto } from "@/lib/api/types";

function VerifikasiContent() {
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get("id");
  const { user, logout } = useAuth();

  const [setoranList, setSetoranList] = useState<Setoran[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("MENUNGGU_KONFIRMASI");
  const [selectedBulan, setSelectedBulan] = useState<string>("");

  // Verification modal state
  const [activeSetoran, setActiveSetoran] = useState<Setoran | null>(null);
  const [itemWeights, setItemWeights] = useState<Record<string, string>>({});
  const [adminNotes, setAdminNotes] = useState("");
  const [verifyAction, setVerifyAction] = useState<"SELESAI" | "DIVERIFIKASI" | "DITOLAK">("SELESAI");
  const [isVerifying, setIsVerifying] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchSetoran = async () => {
    setIsLoading(true);
    try {
      const res = await getAllSetoranAdmin({
        status: statusFilter === "SEMUA" ? undefined : statusFilter,
        bulan: selectedBulan || undefined,
      });
      if (res.data) {
        setSetoranList(res.data);
        // If url had ?id=, open that item
        if (preselectedId) {
          const found = res.data.find((s) => String(s.id) === String(preselectedId));
          if (found) openVerifyModal(found);
        }
      }
    } catch (err) {
      console.error("Gagal mengambil data setoran:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSetoran();
  }, [statusFilter, selectedBulan]);

  const openVerifyModal = (setor: Setoran, defaultAction?: "SELESAI" | "DIVERIFIKASI" | "DITOLAK") => {
    setActiveSetoran(setor);
    setAdminNotes(setor.catatanAdmin || "");
    setVerifyAction(defaultAction || (setor.status === "DIVERIFIKASI" ? "SELESAI" : "SELESAI"));
    setModalError(null);

    // Pre-populate weights with estimated weights or existing real weights
    const weights: Record<string, string> = {};
    if (setor.items) {
      setor.items.forEach((it) => {
        weights[String(it.id)] = (it.beratRiil != null ? it.beratRiil : it.beratEstimasi).toString();
      });
    }
    setItemWeights(weights);
  };

  const closeVerifyModal = () => {
    setActiveSetoran(null);
    setModalError(null);
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSetoran) return;
    setModalError(null);

    const itemsPayload: VerifyItemSetorDto[] = [];
    if ((verifyAction === "SELESAI" || verifyAction === "DIVERIFIKASI") && activeSetoran.items) {
      for (const it of activeSetoran.items) {
        const berat = parseFloat(itemWeights[String(it.id)] || "0");
        if (isNaN(berat) || berat <= 0) {
          setModalError(`Berat riil untuk ${it.kategori?.nama || "item"} harus lebih dari 0 kg.`);
          return;
        }
        itemsPayload.push({
          itemId: it.id,
          kategoriSampahId: it.kategoriSampahId || it.kategoriId,
          beratRiil: berat,
          beratKgReal: berat,
        });
      }
    }

    setIsVerifying(true);
    try {
      await verifySetoran(activeSetoran.id, {
        status: verifyAction,
        catatanAdmin: adminNotes.trim() || undefined,
        items: (verifyAction === "SELESAI" || verifyAction === "DIVERIFIKASI") ? itemsPayload : undefined,
      });

      const actionDesc =
        verifyAction === "SELESAI"
          ? "diselesaikan dan poin nasabah telah diperbarui"
          : verifyAction === "DIVERIFIKASI"
          ? "diverifikasi (timbangan tersimpan)"
          : "ditolak";
      setFeedback(`Setoran #${activeSetoran.id} berhasil ${actionDesc}.`);
      closeVerifyModal();
      await fetchSetoran();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setModalError(err.message || "Gagal memproses verifikasi.");
    } finally {
      setIsVerifying(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SELESAI":
        return <Badge variant="success">Selesai (Poin Aktif)</Badge>;
      case "DIVERIFIKASI":
        return <Badge variant="primary">Diverifikasi (Pending Selesai)</Badge>;
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
        month: "short",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  };

  return (
    <AdminShell user={user as AdminProfile} onLogout={logout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#1d1d1f] tracking-tight">
              Verifikasi &amp; Timbang Setoran
            </h1>
            <p className="text-[17px] text-[#7a7a7a]">
              Validasi fisik timbangan sampah dan tetapkan perolehan poin riil untuk nasabah.
            </p>
          </div>
        </div>

        {feedback && (
          <Alert variant="success" onClose={() => setFeedback(null)}>
            {feedback}
          </Alert>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#ffffff] p-4 rounded-[18px] border border-[#e0e0e0]">
          {/* Status Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { label: "Menunggu Konfirmasi", value: "MENUNGGU_KONFIRMASI" },
              { label: "Diverifikasi", value: "DIVERIFIKASI" },
              { label: "Selesai", value: "SELESAI" },
              { label: "Ditolak", value: "DITOLAK" },
              { label: "Semua Status", value: "SEMUA" },
            ].map((st) => (
              <button
                key={st.value}
                type="button"
                onClick={() => setStatusFilter(st.value)}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all btn-apple-press cursor-pointer whitespace-nowrap ${
                  statusFilter === st.value
                    ? "bg-[#1d1d1f] text-white"
                    : "bg-[#f5f5f7] text-[#7a7a7a] hover:text-[#1d1d1f]"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Month selector */}
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
            <Button
              variant="pearl-capsule"
              size="sm"
              leftIcon={<RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />}
              onClick={() => fetchSetoran()}
              disabled={isLoading}
            >
              Segarkan
            </Button>
          </div>
        </div>

        {/* Setoran List Table / Stacked Cards (Apple responsive table pattern) */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-28 bg-[#f5f5f7] animate-pulse rounded-[18px]" />
            ))}
          </div>
        ) : setoranList.length === 0 ? (
          <Card className="p-8 text-center bg-white">
            <EmptyState
              icon={<CheckCircle2 className="w-8 h-8 text-[#1F7A4D]" />}
              title="Tidak Ada Setoran dalam Kategori Ini"
              description="Tidak ada pengajuan setoran yang sesuai dengan filter yang dipilih."
            />
          </Card>
        ) : (
          <div className="space-y-4">
            {setoranList.map((item) => (
              <Card key={item.id} className="p-6 bg-white space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f0f0f0] pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[17px] font-semibold text-[#1d1d1f]">
                      {item.kodeSetor || `Setoran #${item.id}`}
                    </span>
                    {getStatusBadge(item.status)}
                  </div>
                  <div className="text-[14px] text-[#7a7a7a]">
                    Tanggal: {formatDate(item.tanggalSetor || item.createdAt)}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[14px]">
                  <div>
                    <div className="text-[#7a7a7a] text-[12px] uppercase">Nasabah:</div>
                    <div className="font-semibold text-[#1d1d1f]">
                      {item.nasabah?.namaLengkap || `Nasabah #${item.nasabahId}`}
                    </div>
                    <div className="text-[12px] text-[#7a7a7a]">
                      {item.nasabah?.nomorTelepon || "No telp -"}
                    </div>
                  </div>

                  <div>
                    <div className="text-[#7a7a7a] text-[12px] uppercase">Berat Sampah:</div>
                    <div className="font-semibold text-[#1d1d1f]">
                      Estimasi: {item.totalBeratEstimasi} kg
                      {item.totalBeratRiil != null && (
                        <span className="text-[#1F7A4D] ml-1">
                          • Riil: {item.totalBeratRiil} kg
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-[#7a7a7a] text-[12px] uppercase">Poin Hasil:</div>
                    <div className="font-semibold text-[#1F7A4D]">
                      {item.totalPoinRiil != null ? `+${item.totalPoinRiil} Poin (Riil)` : `+${item.totalPoinEstimasi} Poin (Est)`}
                    </div>
                  </div>
                </div>

                {/* Items preview */}
                {item.items && item.items.length > 0 && (
                  <div className="bg-[#f5f5f7] rounded-[10px] p-3 text-[13px] text-[#7a7a7a]">
                    {item.items.map((it, idx) => (
                      <span key={it.id}>
                        {it.kategori?.nama || `Kategori #${it.kategoriId}`} ({it.beratEstimasi} kg)
                        {idx < item.items.length - 1 ? ", " : ""}
                      </span>
                    ))}
                    {item.catatan && <div className="mt-1 italic text-[#1d1d1f]">Catatan nasabah: {item.catatan}</div>}
                    {item.catatanAdmin && <div className="mt-1 text-[#0066cc]">Catatan admin: {item.catatanAdmin}</div>}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
                  {item.status === "MENUNGGU_KONFIRMASI" && (
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<CheckCircle2 className="w-4 h-4" />}
                      onClick={() => openVerifyModal(item, "SELESAI")}
                    >
                      Timbang &amp; Selesaikan
                    </Button>
                  )}
                  {item.status === "DIVERIFIKASI" && (
                    <>
                      <Button
                        variant="secondary-pill"
                        size="sm"
                        onClick={() => openVerifyModal(item, "DIVERIFIKASI")}
                      >
                        Edit Timbangan
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<CheckCircle2 className="w-4 h-4" />}
                        onClick={() => openVerifyModal(item, "SELESAI")}
                      >
                        Selesaikan &amp; Terbitkan Poin
                      </Button>
                    </>
                  )}
                  {item.status === "SELESAI" && (
                    <Button
                      variant="secondary-pill"
                      size="sm"
                      onClick={() => openVerifyModal(item, "SELESAI")}
                    >
                      Lihat / Perbarui
                    </Button>
                  )}
                  {item.status === "DITOLAK" && (
                    <Button
                      variant="secondary-pill"
                      size="sm"
                      onClick={() => openVerifyModal(item, "DITOLAK")}
                    >
                      Lihat Detail Penolakan
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Verification Modal */}
        <Modal
          isOpen={!!activeSetoran}
          onClose={closeVerifyModal}
          title={`Verifikasi Setoran #${activeSetoran?.id}`}
          description={`Nasabah: ${activeSetoran?.nasabah?.namaLengkap || "Nasabah"}`}
          maxWidth="md"
        >
          {activeSetoran && (
            <form onSubmit={handleVerifySubmit} className="space-y-5">
              {modalError && (
                <Alert variant="danger" onClose={() => setModalError(null)}>
                  {modalError}
                </Alert>
              )}

              {/* Status Decision Toggle */}
              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-[#1d1d1f]">
                  Keputusan Verifikasi
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setVerifyAction("SELESAI")}
                    className={`p-3 rounded-[10px] border text-left transition-all btn-apple-press cursor-pointer flex flex-col justify-between ${
                      verifyAction === "SELESAI"
                        ? "bg-[#eaf5ee] border-[#1F7A4D] ring-2 ring-[#1F7A4D]/20 text-[#1F7A4D]"
                        : "bg-[#ffffff] border-[#e0e0e0] text-[#7a7a7a] hover:border-[#b0b0b0]"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-semibold text-[13px]">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-[#1F7A4D]" />
                      <span>Selesai &amp; Poin</span>
                    </div>
                    <span className="text-[11px] text-[#7a7a7a] mt-1">
                      Finalisasi &amp; terbitkan poin ke nasabah
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVerifyAction("DIVERIFIKASI")}
                    className={`p-3 rounded-[10px] border text-left transition-all btn-apple-press cursor-pointer flex flex-col justify-between ${
                      verifyAction === "DIVERIFIKASI"
                        ? "bg-[#eff6ff] border-[#0066cc] ring-2 ring-[#0066cc]/20 text-[#0066cc]"
                        : "bg-[#ffffff] border-[#e0e0e0] text-[#7a7a7a] hover:border-[#b0b0b0]"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-semibold text-[13px]">
                      <IconScale className="w-4 h-4 shrink-0 text-[#0066cc]" />
                      <span>Timbang Saja</span>
                    </div>
                    <span className="text-[11px] text-[#7a7a7a] mt-1">
                      Simpan berat, poin belum diterbitkan
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVerifyAction("DITOLAK")}
                    className={`p-3 rounded-[10px] border text-left transition-all btn-apple-press cursor-pointer flex flex-col justify-between ${
                      verifyAction === "DITOLAK"
                        ? "bg-[#fdf2f2] border-[#D92D20] ring-2 ring-[#D92D20]/20 text-[#D92D20]"
                        : "bg-[#ffffff] border-[#e0e0e0] text-[#7a7a7a] hover:border-[#b0b0b0]"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-semibold text-[13px]">
                      <AlertCircle className="w-4 h-4 shrink-0 text-[#D92D20]" />
                      <span>Tolak Setoran</span>
                    </div>
                    <span className="text-[11px] text-[#7a7a7a] mt-1">
                      Batalkan setoran dengan alasan
                    </span>
                  </button>
                </div>
              </div>

              {/* Weight verification per item if verified or finished */}
              {(verifyAction === "SELESAI" || verifyAction === "DIVERIFIKASI") && activeSetoran.items && activeSetoran.items.length > 0 && (
                <div className="space-y-3 bg-[#f5f5f7] p-4 rounded-[12px] border border-[#e0e0e0]">
                  <div className="text-[13px] font-semibold text-[#1d1d1f] uppercase tracking-wider">
                    Timbangan Riil per Item (kg)
                  </div>
                  {activeSetoran.items.map((it) => (
                    <div key={it.id} className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      <div>
                        <div className="font-semibold text-[14px] text-[#1d1d1f]">
                          {it.kategori?.nama || `Item #${it.id}`}
                        </div>
                        <div className="text-[12px] text-[#7a7a7a]">
                          Estimasi Nasabah: {it.beratEstimasi} kg • Rate: {it.kategori?.poinPerKg || 0} Poin/kg
                        </div>
                      </div>
                      <Input
                        type="number"
                        step="0.1"
                        min="0.1"
                        label="Berat Timbangan Riil (kg)"
                        value={itemWeights[String(it.id)] || ""}
                        onChange={(e) =>
                          setItemWeights((prev) => ({ ...prev, [String(it.id)]: e.target.value }))
                        }
                        required
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Admin Note */}
              <Textarea
                label="Catatan Verifikator (Opsional)"
                placeholder="Contoh: Sampah bersih, kardus kering, timbangan pas."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={2}
              />

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="secondary-pill" onClick={closeVerifyModal}>
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant={verifyAction === "DITOLAK" ? "danger" : "primary"}
                  isLoading={isVerifying}
                >
                  {verifyAction === "SELESAI"
                    ? "Selesai & Terbitkan Poin"
                    : verifyAction === "DIVERIFIKASI"
                    ? "Simpan Timbangan Saja"
                    : "Tolak Setoran Ini"}
                </Button>
              </div>
            </form>
          )}
        </Modal>
      </div>
    </AdminShell>
  );
}

export default function AdminVerifikasiPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#7a7a7a]">Memuat halaman verifikasi...</div>}>
      <VerifikasiContent />
    </Suspense>
  );
}
