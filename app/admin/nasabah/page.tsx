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
  User,
  Plus,
  Edit3,
  Trash2,
  Search,
  Coins,
  Upload,
} from "@/components/icons";
import { useAuth } from "@/context/auth-context";
import {
  getAllNasabah,
  createNasabah,
  updateNasabah,
  deleteNasabah,
} from "@/lib/api/nasabah";
import { NasabahProfile, AdminProfile } from "@/lib/api/types";

export default function AdminNasabahPage() {
  const { user, logout } = useAuth();
  const [nasabahList, setNasabahList] = useState<NasabahProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNasabah, setEditingNasabah] = useState<NasabahProfile | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [alamat, setAlamat] = useState("");
  const [nomorTelepon, setNomorTelepon] = useState("");
  const [foto, setFoto] = useState<File | null>(null);

  // Delete confirm state
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchNasabah = async () => {
    setIsLoading(true);
    try {
      const res = await getAllNasabah();
      if (res.data) {
        setNasabahList(res.data);
      }
    } catch (err) {
      console.error("Gagal mengambil data nasabah:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNasabah();
  }, []);

  const openAddModal = () => {
    setEditingNasabah(null);
    setUsername("");
    setPassword("");
    setNamaLengkap("");
    setAlamat("");
    setNomorTelepon("");
    setFoto(null);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (n: NasabahProfile) => {
    setEditingNasabah(n);
    setUsername(n.username);
    setPassword("");
    setNamaLengkap(n.namaLengkap);
    setAlamat(n.alamat);
    setNomorTelepon(n.nomorTelepon);
    setFoto(null);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (editingNasabah) {
        const payload: any = {
          namaLengkap,
          alamat,
          nomorTelepon,
        };
        if (password.trim()) payload.password = password.trim();
        if (foto) payload.foto = foto;

        await updateNasabah(editingNasabah.id, payload);
        setFeedback(`Data nasabah ${namaLengkap} berhasil diperbarui.`);
      } else {
        await createNasabah({
          username,
          password,
          namaLengkap,
          alamat,
          nomorTelepon,
          foto,
        });
        setFeedback(`Nasabah baru ${namaLengkap} berhasil didaftarkan.`);
      }

      setIsModalOpen(false);
      fetchNasabah();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal menyimpan data nasabah.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteNasabah(id);
      setFeedback("Nasabah berhasil dihapus.");
      setDeletingId(null);
      fetchNasabah();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      alert(err.message || "Gagal menghapus nasabah.");
    }
  };

  const filteredNasabah = nasabahList.filter((n) => {
    const q = searchQuery.toLowerCase();
    return (
      n.namaLengkap?.toLowerCase().includes(q) ||
      n.username?.toLowerCase().includes(q) ||
      n.nomorTelepon?.toLowerCase().includes(q) ||
      n.alamat?.toLowerCase().includes(q)
    );
  });

  return (
    <AdminShell user={user as AdminProfile} onLogout={logout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#1d1d1f] tracking-tight">
              Manajemen Data Nasabah
            </h1>
            <p className="text-[17px] text-[#7a7a7a]">
              Kelola data nasabah bank sampah, kontak, alamat, dan pantau saldo poin.
            </p>
          </div>
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={openAddModal}
          >
            Tambah Nasabah
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
            placeholder="Cari nasabah berdasarkan nama, username, no telp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#ffffff] text-[15px] pl-11 pr-4 py-2.5 rounded-full border border-[#e0e0e0] outline-none"
          />
        </div>

        {/* List of Customers (Apple data-table collapsed to stacked cards on mobile) */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-20 bg-[#f5f5f7] animate-pulse rounded-[18px]" />
            ))}
          </div>
        ) : filteredNasabah.length === 0 ? (
          <Card className="p-8 text-center bg-white">
            <EmptyState
              icon={<User className="w-8 h-8" />}
              title="Tidak Ada Data Nasabah"
              description="Belum ada nasabah terdaftar atau cocok dengan pencarian Anda."
              actionLabel="+ Tambah Nasabah Sekarang"
              onAction={openAddModal}
            />
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredNasabah.map((nasabah) => (
              <Card
                key={nasabah.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white hover:border-[#0066cc]/40 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#e6f0fa] text-[#0066cc] flex items-center justify-center shrink-0">
                    {nasabah.foto ? (
                      <img
                        src={nasabah.foto}
                        alt={nasabah.namaLengkap}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <User className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[17px] text-[#1d1d1f]">
                        {nasabah.namaLengkap}
                      </span>
                      <span className="text-[13px] text-[#7a7a7a]">@{nasabah.username}</span>
                    </div>
                    <div className="text-[13px] text-[#7a7a7a] mt-0.5">
                      Telp: {nasabah.nomorTelepon} • Alamat: {nasabah.alamat}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f0f0f0]">
                  <div className="text-left sm:text-right">
                    <div className="text-[11px] text-[#7a7a7a] uppercase font-semibold">
                      Saldo Poin
                    </div>
                    <div className="text-[17px] font-semibold text-[#1F7A4D]">
                      {(nasabah.totalPoin || 0).toLocaleString("id-ID")} Poin
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(nasabah)}
                      className="p-2 rounded-[8px] border border-[#e0e0e0] hover:bg-[#f5f5f7] text-[#1d1d1f] transition-colors btn-apple-press cursor-pointer"
                      title="Edit Data"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingId(nasabah.id)}
                      className="p-2 rounded-[8px] border border-[#fdf2f2] hover:bg-[#fdf2f2] text-[#D92D20] transition-colors btn-apple-press cursor-pointer"
                      title="Hapus Nasabah"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal Add / Edit Nasabah */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingNasabah ? "Edit Data Nasabah" : "Tambah Nasabah Baru"}
          maxWidth="md"
        >
          <form onSubmit={handleSave} className="space-y-4">
            {errorMessage && (
              <Alert variant="danger" onClose={() => setErrorMessage(null)}>
                {errorMessage}
              </Alert>
            )}

            <Input
              label="Nama Lengkap"
              placeholder="Contoh: Siti Aisyah"
              value={namaLengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
              required
            />

            {!editingNasabah && (
              <Input
                label="Username"
                placeholder="Username login nasabah"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            )}

            <Input
              type="password"
              label={editingNasabah ? "Password Baru (Kosongkan jika tidak diubah)" : "Password"}
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!editingNasabah}
            />

            <Input
              type="tel"
              label="Nomor Telepon / WhatsApp"
              placeholder="081234567890"
              value={nomorTelepon}
              onChange={(e) => setNomorTelepon(e.target.value)}
              required
            />

            <Textarea
              label="Alamat Lengkap"
              placeholder="Alamat domisili nasabah"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              rows={2}
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-semibold text-[#1d1d1f]">
                Foto Profil (Opsional)
              </label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2 rounded-[8px] border border-[#e0e0e0] hover:bg-[#f5f5f7] cursor-pointer text-[14px] btn-apple-press">
                  <Upload className="w-4 h-4 text-[#7a7a7a]" />
                  <span>Pilih File</span>
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
                {editingNasabah ? "Simpan Perubahan" : "Tambah Nasabah"}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deletingId !== null}
          onClose={() => setDeletingId(null)}
          title="Konfirmasi Hapus Nasabah"
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-[14px] text-[#7a7a7a]">
              Apakah Anda yakin ingin menghapus data nasabah ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="secondary-pill" onClick={() => setDeletingId(null)}>
                Batal
              </Button>
              <Button
                variant="danger"
                onClick={() => deletingId && handleDelete(deletingId)}
              >
                Hapus Nasabah
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminShell>
  );
}
