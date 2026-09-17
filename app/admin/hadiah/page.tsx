"use client";

import React, { useEffect, useState } from "react";
import { AdminShell } from "@/components/layout/admin-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input, Textarea } from "@/components/ui/input";
import { Alert } from "@/components/ui/toast";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Gift,
  Plus,
  Edit3,
  Trash2,
  Coins,
  Upload,
  Search,
} from "@/components/icons";
import { useAuth } from "@/context/auth-context";
import {
  getHadiah,
  createHadiah,
  updateHadiah,
  deleteHadiah,
} from "@/lib/api/hadiah";
import { Hadiah, AdminProfile } from "@/lib/api/types";

export default function AdminHadiahPage() {
  const { user, logout } = useAuth();
  const [hadiahList, setHadiahList] = useState<Hadiah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHadiah, setEditingHadiah] = useState<Hadiah | null>(null);
  const [nama, setNama] = useState("");
  const [poinDibutuhkan, setPoinDibutuhkan] = useState("");
  const [stok, setStok] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [foto, setFoto] = useState<File | null>(null);

  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchHadiah = async () => {
    setIsLoading(true);
    try {
      const res = await getHadiah();
      if (res.data) {
        setHadiahList(res.data);
      }
    } catch (err) {
      console.error("Gagal mengambil data hadiah:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHadiah();
  }, []);

  const openAddModal = () => {
    setEditingHadiah(null);
    setNama("");
    setPoinDibutuhkan("");
    setStok("");
    setDeskripsi("");
    setFoto(null);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (h: Hadiah) => {
    setEditingHadiah(h);
    setNama(h.nama);
    setPoinDibutuhkan(h.poinDibutuhkan.toString());
    setStok(h.stok.toString());
    setDeskripsi(h.deskripsi || "");
    setFoto(null);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const poin = parseInt(poinDibutuhkan, 10);
    const stokNum = parseInt(stok, 10);
    if (isNaN(poin) || poin <= 0 || isNaN(stokNum) || stokNum < 0) {
      setErrorMessage("Poin harus lebih dari 0 dan stok tidak boleh negatif.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingHadiah) {
        await updateHadiah(editingHadiah.id, {
          nama,
          poinDibutuhkan: poin,
          stok: stokNum,
          deskripsi: deskripsi.trim() || undefined,
          foto,
        });
        setFeedback(`Hadiah ${nama} berhasil diperbarui.`);
      } else {
        await createHadiah({
          nama,
          poinDibutuhkan: poin,
          stok: stokNum,
          deskripsi: deskripsi.trim() || undefined,
          foto,
        });
        setFeedback(`Hadiah ${nama} berhasil ditambahkan.`);
      }

      setIsModalOpen(false);
      fetchHadiah();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal menyimpan hadiah.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteHadiah(id);
      setFeedback("Hadiah berhasil dihapus.");
      setDeletingId(null);
      fetchHadiah();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      alert(err.message || "Gagal menghapus hadiah.");
    }
  };

  const filteredHadiah = hadiahList.filter((h) =>
    h.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminShell user={user as AdminProfile} onLogout={logout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#1d1d1f] tracking-tight">
              Manajemen Katalog Hadiah &amp; Voucher
            </h1>
            <p className="text-[17px] text-[#7a7a7a]">
              Kelola voucher belanja, sembako, kuota, atau produk penukaran poin nasabah.
            </p>
          </div>
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={openAddModal}
          >
            Tambah Hadiah
          </Button>
        </div>

        {feedback && (
          <Alert variant="success" onClose={() => setFeedback(null)}>
            {feedback}
          </Alert>
        )}

        {/* Search */}
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#7a7a7a]" />
          <input
            type="text"
            placeholder="Cari nama hadiah / voucher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#ffffff] text-[15px] pl-11 pr-4 py-2.5 rounded-full border border-[#e0e0e0] outline-none"
          />
        </div>

        {/* Rewards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-56 bg-[#f5f5f7] animate-pulse rounded-[18px]" />
            ))}
          </div>
        ) : filteredHadiah.length === 0 ? (
          <Card className="p-8 text-center bg-white">
            <EmptyState
              icon={<Gift className="w-8 h-8" />}
              title="Katalog Hadiah Kosong"
              description="Tambahkan pilihan hadiah atau voucher untuk ditukarkan oleh nasabah."
              actionLabel="+ Tambah Hadiah Baru"
              onAction={openAddModal}
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHadiah.map((h) => (
              <Card
                key={h.id}
                className="flex flex-col justify-between p-6 bg-white hover:border-[#0066cc]/40 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <Badge variant={h.stok > 0 ? "neutral" : "danger"}>
                      Stok: {h.stok}
                    </Badge>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(h)}
                        className="p-1.5 rounded-[6px] border border-[#e0e0e0] hover:bg-[#f5f5f7] text-[#1d1d1f] transition-colors btn-apple-press cursor-pointer"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingId(h.id)}
                        className="p-1.5 rounded-[6px] border border-[#fdf2f2] hover:bg-[#fdf2f2] text-[#D92D20] transition-colors btn-apple-press cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-[21px] font-semibold text-[#1d1d1f] tracking-tight mb-1">
                    {h.nama}
                  </h3>
                  {h.deskripsi && (
                    <p className="text-[14px] text-[#7a7a7a] line-clamp-2 mb-3">
                      {h.deskripsi}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-[#f0f0f0] flex items-center justify-between text-[14px]">
                  <span className="text-[#7a7a7a]">Poin Dibutuhkan:</span>
                  <div className="flex items-center gap-1 font-semibold text-[#0066cc]">
                    <Coins className="w-4 h-4" />
                    <span>{h.poinDibutuhkan?.toLocaleString("id-ID")} Poin</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal Add/Edit */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingHadiah ? "Edit Hadiah" : "Tambah Hadiah Baru"}
          maxWidth="md"
        >
          <form onSubmit={handleSave} className="space-y-4">
            {errorMessage && (
              <Alert variant="danger" onClose={() => setErrorMessage(null)}>
                {errorMessage}
              </Alert>
            )}

            <Input
              label="Nama Hadiah / Voucher"
              placeholder="Contoh: Voucher Belanja Rp 50.000"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="number"
                min="1"
                label="Poin yang Dibutuhkan"
                placeholder="Contoh: 500"
                value={poinDibutuhkan}
                onChange={(e) => setPoinDibutuhkan(e.target.value)}
                required
              />
              <Input
                type="number"
                min="0"
                label="Jumlah Stok Tersedia"
                placeholder="Contoh: 10"
                value={stok}
                onChange={(e) => setStok(e.target.value)}
                required
              />
            </div>

            <Textarea
              label="Deskripsi Hadiah (Opsional)"
              placeholder="Keterangan voucher atau masa berlaku"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              rows={2}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-semibold text-[#1d1d1f]">
                Foto Hadiah (Opsional)
              </label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2 rounded-[8px] border border-[#e0e0e0] hover:bg-[#f5f5f7] cursor-pointer text-[14px] btn-apple-press">
                  <Upload className="w-4 h-4 text-[#7a7a7a]" />
                  <span>Pilih Foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFoto(e.target.files[0]);
                      }
                    }}
                  />
                </label>
                {foto && <span className="text-[13px] text-[#1F7A4D] font-semibold">{foto.name}</span>}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <Button variant="secondary-pill" onClick={() => setIsModalOpen(false)}>
                Batal
              </Button>
              <Button type="submit" variant="primary" isLoading={isSubmitting}>
                {editingHadiah ? "Simpan Perubahan" : "Simpan Hadiah"}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation */}
        <Modal
          isOpen={deletingId !== null}
          onClose={() => setDeletingId(null)}
          title="Hapus Hadiah"
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-[14px] text-[#7a7a7a]">
              Apakah Anda yakin ingin menghapus hadiah ini dari katalog?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="secondary-pill" onClick={() => setDeletingId(null)}>
                Batal
              </Button>
              <Button
                variant="danger"
                onClick={() => deletingId && handleDelete(deletingId)}
              >
                Hapus Hadiah
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminShell>
  );
}
