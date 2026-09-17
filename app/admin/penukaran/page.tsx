"use client";

import React, { useEffect, useState } from "react";
import { AdminShell } from "@/components/layout/admin-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Alert } from "@/components/ui/toast";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Gift,
  Coins,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
} from "@/components/icons";
import { useAuth } from "@/context/auth-context";
import { getAllPenukaranAdmin, updateStatusPenukaran } from "@/lib/api/penukaranPoin";
import { PenukaranPoin, AdminProfile } from "@/lib/api/types";

export default function AdminPenukaranPage() {
  const { user, logout } = useAuth();
  const [penukaranList, setPenukaranList] = useState<PenukaranPoin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBulan, setSelectedBulan] = useState("");
  const [statusFilter, setStatusFilter] = useState("SEMUA");

  // Status update state
  const [activeItem, setActiveItem] = useState<PenukaranPoin | null>(null);
  const [newStatus, setNewStatus] = useState<string>("SELESAI");
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchPenukaran = async () => {
    setIsLoading(true);
    try {
      const res = await getAllPenukaranAdmin(selectedBulan || undefined);
      if (res.data) {
        setPenukaranList(res.data);
      }
    } catch (err) {
      console.error("Gagal mengambil data penukaran:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPenukaran();
  }, [selectedBulan]);

  const handleUpdateStatus = async () => {
    if (!activeItem) return;
    setIsUpdating(true);
    try {
      await updateStatusPenukaran(activeItem.id, newStatus);
      setFeedback(`Status penukaran #${activeItem.id} berhasil diperbarui menjadi ${newStatus}.`);
      setActiveItem(null);
      fetchPenukaran();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      alert(err.message || "Gagal memperbarui status penukaran.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SELESAI":
        return <Badge variant="success">Selesai (Diserahkan)</Badge>;
      case "DIPROSES":
      case "MENUNGGU":
        return <Badge variant="warning">Menunggu / Diproses</Badge>;
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

  const filteredList = penukaranList.filter((item) => {
    if (statusFilter === "SEMUA") return true;
    return item.status === statusFilter;
  });

  return (
    <AdminShell user={user as AdminProfile} onLogout={logout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#1d1d1f] tracking-tight">
              Kelola Penukaran Poin Nasabah
            </h1>
            <p className="text-[17px] text-[#7a7a7a]">
              Verifikasi klaim hadiah, periksa kode nota nasabah, dan serahkan voucher / produk.
            </p>
          </div>
        </div>

        {feedback && (
          <Alert variant="success" onClose={() => setFeedback(null)}>
            {feedback}
          </Alert>
        )}

        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#ffffff] p-4 rounded-[18px] border border-[#e0e0e0]">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { label: "Semua", value: "SEMUA" },
              { label: "Menunggu / Proses", value: "MENUNGGU" },
              { label: "Selesai", value: "SELESAI" },
              { label: "Ditolak", value: "DITOLAK" },
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
        </div>

        {/* List of Redemptions */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-20 bg-[#f5f5f7] animate-pulse rounded-[18px]" />
            ))}
          </div>
        ) : filteredList.length === 0 ? (
          <Card className="p-8 text-center bg-white">
            <EmptyState
              icon={<Gift className="w-8 h-8" />}
              title="Tidak Ada Pengajuan Penukaran"
              description="Belum ada transaksi penukaran hadiah yang cocok dengan filter."
            />
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredList.map((item) => (
              <Card
                key={item.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white hover:border-[#0066cc]/40 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[17px] text-[#1d1d1f]">
                      {item.hadiah?.nama || `Hadiah #${item.hadiahId}`}
                    </span>
                    {getStatusBadge(item.status)}
                  </div>
                  <div className="text-[14px] text-[#7a7a7a]">
                    Nasabah: <strong className="text-[#1d1d1f]">{item.nasabah?.namaLengkap || `Nasabah #${item.nasabahId}`}</strong>
                    {item.kodePenukaran && ` • Kode: ${item.kodePenukaran}`}
                    {" • "}
                    Tanggal: {formatDate(item.tanggalPengajuan || item.createdAt)}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f0f0f0]">
                  <div className="text-left sm:text-right">
                    <div className="text-[17px] font-semibold text-[#D92D20]">
                      -{item.poinDigunakan?.toLocaleString("id-ID")} Poin
                    </div>
                  </div>

                  <Button
                    variant="pearl-capsule"
                    size="sm"
                    onClick={() => {
                      setActiveItem(item);
                      setNewStatus(item.status === "SELESAI" ? "SELESAI" : "SELESAI");
                    }}
                  >
                    Ubah Status
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Update Status Modal */}
        <Modal
          isOpen={!!activeItem}
          onClose={() => setActiveItem(null)}
          title={`Update Status Penukaran #${activeItem?.id}`}
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-[14px] text-[#7a7a7a]">
              Pilih status penyerahan hadiah untuk nasabah <strong>{activeItem?.nasabah?.namaLengkap}</strong>:
            </p>

            <div className="space-y-2">
              {[
                { label: "Selesai (Hadiah Diserahkan)", value: "SELESAI" },
                { label: "Sedang Diproses", value: "DIPROSES" },
                { label: "Ditolak (Batalkan)", value: "DITOLAK" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-3 rounded-[8px] border cursor-pointer transition-colors ${
                    newStatus === opt.value
                      ? "border-[#0066cc] bg-[#e6f0fa]"
                      : "border-[#e0e0e0] hover:bg-[#f5f5f7]"
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={opt.value}
                    checked={newStatus === opt.value}
                    onChange={() => setNewStatus(opt.value)}
                    className="accent-[#0066cc]"
                  />
                  <span className="text-[14px] font-semibold text-[#1d1d1f]">{opt.label}</span>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <Button variant="secondary-pill" onClick={() => setActiveItem(null)}>
                Batal
              </Button>
              <Button
                variant="primary"
                isLoading={isUpdating}
                onClick={handleUpdateStatus}
              >
                Simpan Status
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminShell>
  );
}
