"use client";

import React, { useEffect, useState } from "react";
import { AdminShell } from "@/components/layout/admin-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Alert } from "@/components/ui/toast";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Layers,
  Plus,
  Edit3,
  Trash2,
  Coins,
  Upload,
  Search,
} from "@/components/icons";
import { useAuth } from "@/context/auth-context";
import {
  getKategoriSampah,
  createKategoriSampah,
  updateKategoriSampah,
  deleteKategoriSampah,
} from "@/lib/api/kategoriSampah";
import { KategoriSampah, AdminProfile } from "@/lib/api/types";

export default function AdminKategoriPage() {
  const { user, logout } = useAuth();
  const [categories, setCategories] = useState<KategoriSampah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<KategoriSampah | null>(null);
  const [nama, setNama] = useState("");
  const [jenis, setJenis] = useState("PLASTIK");
  const [hargaPerKg, setHargaPerKg] = useState("");
  const [poinPerKg, setPoinPerKg] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [foto, setFoto] = useState<File | null>(null);

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await getKategoriSampah();
      if (res.data) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error("Gagal mengambil data kategori:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setNama("");
    setJenis("PLASTIK");
    setHargaPerKg("");
    setPoinPerKg("");
    setDeskripsi("");
    setFoto(null);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (c: KategoriSampah) => {
    setEditingCategory(c);
    setNama(c.nama);
    setJenis(c.jenis);
    setHargaPerKg(c.hargaPerKg.toString());
    setPoinPerKg(c.poinPerKg.toString());
    setDeskripsi(c.deskripsi || "");
    setFoto(null);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const harga = parseInt(hargaPerKg, 10);
    const poin = parseInt(poinPerKg, 10);
    if (isNaN(harga) || harga < 0 || isNaN(poin) || poin < 0) {
      setErrorMessage("Harga dan poin per kg harus berupa angka positif.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await updateKategoriSampah(editingCategory.id, {
          nama,
          jenis,
          hargaPerKg: harga,
          poinPerKg: poin,
          deskripsi: deskripsi.trim() || undefined,
          foto,
        });
        setFeedback(`Kategori ${nama} berhasil diperbarui.`);
      } else {
        await createKategoriSampah({
          nama,
          jenis,
          hargaPerKg: harga,
          poinPerKg: poin,
          deskripsi: deskripsi.trim() || undefined,
          foto,
        });
        setFeedback(`Kategori ${nama} berhasil ditambahkan.`);
      }

      setIsModalOpen(false);
      fetchCategories();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal menyimpan kategori.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteKategoriSampah(id);
      setFeedback("Kategori berhasil dihapus.");
      setDeletingId(null);
      fetchCategories();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      alert(err.message || "Gagal menghapus kategori.");
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.jenis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminShell user={user as AdminProfile} onLogout={logout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#1d1d1f] tracking-tight">
              Manajemen Kategori Sampah
            </h1>
            <p className="text-[17px] text-[#7a7a7a]">
              Atur nilai rupiah per kilogram dan rasio konversi poin daur ulang per jenis sampah.
            </p>
          </div>
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={openAddModal}
          >
            Tambah Kategori
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
            placeholder="Cari kategori sampah..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#ffffff] text-[15px] pl-11 pr-4 py-2.5 rounded-full border border-[#e0e0e0] outline-none"
          />
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-56 bg-[#f5f5f7] animate-pulse rounded-[18px]" />
            ))}
          </div>
        ) : filteredCategories.length === 0 ? (
          <Card className="p-8 text-center bg-white">
            <EmptyState
              icon={<Layers className="w-8 h-8" />}
              title="Belum Ada Kategori Sampah"
              description="Tambahkan kategori sampah yang diterima oleh unit bank sampah Anda."
              actionLabel="+ Tambah Kategori"
              onAction={openAddModal}
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((cat) => (
              <Card
                key={cat.id}
                className="flex flex-col justify-between p-6 bg-white hover:border-[#0066cc]/40 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <Badge variant="primary">{cat.jenis}</Badge>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(cat)}
                        className="p-1.5 rounded-[6px] border border-[#e0e0e0] hover:bg-[#f5f5f7] text-[#1d1d1f] transition-colors btn-apple-press cursor-pointer"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingId(cat.id)}
                        className="p-1.5 rounded-[6px] border border-[#fdf2f2] hover:bg-[#fdf2f2] text-[#D92D20] transition-colors btn-apple-press cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-[21px] font-semibold text-[#1d1d1f] tracking-tight mb-1">
                    {cat.nama}
                  </h3>
                  {cat.deskripsi && (
                    <p className="text-[14px] text-[#7a7a7a] line-clamp-2 mb-3">
                      {cat.deskripsi}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-[#f0f0f0] space-y-2 text-[14px]">
                  <div className="flex justify-between">
                    <span className="text-[#7a7a7a]">Harga per kg:</span>
                    <strong className="text-[#1d1d1f]">
                      Rp {cat.hargaPerKg?.toLocaleString("id-ID")}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7a7a7a]">Poin per kg:</span>
                    <strong className="text-[#1F7A4D]">
                      +{cat.poinPerKg?.toLocaleString("id-ID")} Poin
                    </strong>
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
          title={editingCategory ? "Edit Kategori Sampah" : "Tambah Kategori Baru"}
          maxWidth="md"
        >
          <form onSubmit={handleSave} className="space-y-4">
            {errorMessage && (
              <Alert variant="danger" onClose={() => setErrorMessage(null)}>
                {errorMessage}
              </Alert>
            )}

            <Input
              label="Nama Kategori"
              placeholder="Contoh: Botol Plastik PET Bening"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
            />

            <Select
              label="Kelompok Jenis Sampah"
              value={jenis}
              onChange={(e) => setJenis(e.target.value)}
              required
            >
              <option value="PLASTIK">Plastik</option>
              <option value="KERTAS">Kertas / Karton</option>
              <option value="LOGAM">Logam / Aluminium</option>
              <option value="KACA">Kaca / Beling</option>
              <option value="ORGANIK">Organik</option>
              <option value="LAINNYA">Lainnya</option>
            </Select>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="number"
                min="0"
                label="Harga Nilai (Rp/kg)"
                placeholder="Contoh: 3000"
                value={hargaPerKg}
                onChange={(e) => setHargaPerKg(e.target.value)}
                required
              />
              <Input
                type="number"
                min="0"
                label="Perolehan Poin (Poin/kg)"
                placeholder="Contoh: 30"
                value={poinPerKg}
                onChange={(e) => setPoinPerKg(e.target.value)}
                required
              />
            </div>

            <Textarea
              label="Deskripsi / Kriteria (Opsional)"
              placeholder="Contoh: Bersih dari cairan, label dilepas, botol dipipihkan."
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              rows={2}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-semibold text-[#1d1d1f]">
                Foto Kategori (Opsional)
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
                {editingCategory ? "Simpan Perubahan" : "Simpan Kategori"}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation */}
        <Modal
          isOpen={deletingId !== null}
          onClose={() => setDeletingId(null)}
          title="Hapus Kategori Sampah"
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-[14px] text-[#7a7a7a]">
              Apakah Anda yakin ingin menghapus kategori sampah ini? Kategori yang sudah memiliki riwayat setoran tidak disarankan untuk dihapus.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="secondary-pill" onClick={() => setDeletingId(null)}>
                Batal
              </Button>
              <Button
                variant="danger"
                onClick={() => deletingId && handleDelete(deletingId)}
              >
                Hapus Kategori
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminShell>
  );
}
