"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NasabahShell } from "@/components/layout/nasabah-shell";
import { Card } from "@/components/ui/card";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/toast";
import { Plus, Trash2, Coins, IconScale, ArrowLeft } from "@/components/icons";
import { useAuth } from "@/context/auth-context";
import { getKategoriSampah } from "@/lib/api/kategoriSampah";
import { submitSetoran } from "@/lib/api/setorSampah";
import { KategoriSampah, ItemSetorDto } from "@/lib/api/types";
import Link from "next/link";

interface FormItem {
  kategoriId: number;
  beratEstimasi: string;
  keterangan: string;
}

function SetorFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedKategoriId = searchParams.get("kategoriId");
  const { user, logout } = useAuth();

  const [categories, setCategories] = useState<KategoriSampah[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  const [tanggalSetor, setTanggalSetor] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [catatan, setCatatan] = useState("");
  const [items, setItems] = useState<FormItem[]>([
    {
      kategoriId: preselectedKategoriId ? parseInt(preselectedKategoriId, 10) : 0,
      beratEstimasi: "1",
      keterangan: "",
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCats = async () => {
      setIsCategoriesLoading(true);
      try {
        const res = await getKategoriSampah();
        if (res.data) {
          setCategories(res.data);
          // Set first category if not preselected
          if (!preselectedKategoriId && res.data.length > 0) {
            setItems((prev) => [
              {
                ...prev[0],
                kategoriId: res.data[0].id,
              },
            ]);
          }
        }
      } catch (err: any) {
        setErrorMessage("Gagal memuat kategori sampah.");
      } finally {
        setIsCategoriesLoading(false);
      }
    };
    fetchCats();
  }, [preselectedKategoriId]);

  // Calculate live running point estimate and total weight
  const calculation = useMemo(() => {
    let totalKg = 0;
    let totalPoin = 0;
    let totalEstimasiRupiah = 0;

    items.forEach((item) => {
      const berat = parseFloat(item.beratEstimasi) || 0;
      const cat = categories.find((c) => c.id === item.kategoriId);
      if (cat) {
        totalKg += berat;
        totalPoin += Math.round(berat * (cat.poinPerKg || 0));
        totalEstimasiRupiah += Math.round(berat * (cat.hargaPerKg || 0));
      }
    });

    return { totalKg, totalPoin, totalEstimasiRupiah };
  }, [items, categories]);

  const handleAddItem = () => {
    const defaultCatId = categories.length > 0 ? categories[0].id : 0;
    setItems((prev) => [
      ...prev,
      {
        kategoriId: defaultCatId,
        beratEstimasi: "1",
        keterangan: "",
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof FormItem, value: any) => {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, [field]: value } : it))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Client-side validations
    if (items.length === 0) {
      setErrorMessage("Tambahkan minimal 1 item sampah.");
      return;
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const berat = parseFloat(item.beratEstimasi);
      if (!item.kategoriId) {
        setErrorMessage(`Pilih kategori sampah pada item #${i + 1}.`);
        return;
      }
      if (isNaN(berat) || berat <= 0) {
        setErrorMessage(`Berat estimasi pada item #${i + 1} harus lebih dari 0 kg.`);
        return;
      }
    }

    const payloadItems: ItemSetorDto[] = items.map((it) => ({
      kategoriId: Number(it.kategoriId),
      beratEstimasi: parseFloat(it.beratEstimasi),
      keterangan: it.keterangan ? it.keterangan.trim() : undefined,
    }));

    setIsSubmitting(true);
    try {
      const res = await submitSetoran({
        tanggalSetor,
        catatan: catatan ? catatan.trim() : undefined,
        items: payloadItems,
      });

      if (res.data) {
        setSuccessMessage("Pengajuan setoran berhasil dikirim! Menunggu konfirmasi admin unit...");
        setTimeout(() => {
          router.push("/nasabah/status");
        }, 1500);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal mengajukan penyetoran sampah.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <NasabahShell user={user as any} onLogout={logout}>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header Navigation */}
        <div className="flex items-center gap-3">
          <Link
            href="/nasabah/dashboard"
            className="p-2 rounded-full hover:bg-[#f5f5f7] transition-colors btn-apple-press text-[#7a7a7a] hover:text-[#1d1d1f]"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-[28px] font-semibold text-[#1d1d1f] tracking-tight">
              Ajukan Penyetoran Sampah
            </h1>
            <p className="text-[14px] text-[#7a7a7a]">
              Pilih kategori sampah daur ulang dan estimasikan beratnya.
            </p>
          </div>
        </div>

        {errorMessage && (
          <Alert variant="danger" onClose={() => setErrorMessage(null)}>
            {errorMessage}
          </Alert>
        )}
        {successMessage && (
          <Alert variant="success">{successMessage}</Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General info card */}
          <Card className="p-6 bg-white space-y-4">
            <h3 className="text-[17px] font-semibold text-[#1d1d1f] border-b border-[#f0f0f0] pb-3">
              Informasi Pengajuan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="date"
                label="Tanggal Rencana Setor"
                value={tanggalSetor}
                onChange={(e) => setTanggalSetor(e.target.value)}
                required
              />
              <Input
                label="Catatan Tambahan (Opsional)"
                placeholder="Contoh: Titip di pos depan"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
              />
            </div>
          </Card>

          {/* Multi-item waste deposit card */}
          <Card className="p-6 bg-white space-y-5">
            <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-3">
              <div>
                <h3 className="text-[17px] font-semibold text-[#1d1d1f]">
                  Daftar Sampah yang Disetor
                </h3>
                <p className="text-[13px] text-[#7a7a7a]">
                  Anda dapat menyetor beberapa jenis sampah sekaligus dalam satu pengajuan.
                </p>
              </div>
              <Button
                size="sm"
                variant="pearl-capsule"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={handleAddItem}
              >
                Tambah Item
              </Button>
            </div>

            {isCategoriesLoading ? (
              <div className="py-8 text-center text-[#7a7a7a] text-[14px]">
                Memuat daftar kategori sampah...
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, idx) => {
                  const selectedCat = categories.find((c) => c.id === item.kategoriId);
                  const berat = parseFloat(item.beratEstimasi) || 0;
                  const itemPoin = selectedCat ? Math.round(berat * selectedCat.poinPerKg) : 0;

                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-[12px] bg-[#f5f5f7] border border-[#e0e0e0] space-y-3 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-semibold text-[#0066cc]">
                          Item #{idx + 1}
                        </span>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-[#D92D20] hover:text-[#b82418] p-1 rounded transition-colors cursor-pointer"
                            title="Hapus Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Select
                          label="Kategori Sampah"
                          value={item.kategoriId}
                          onChange={(e) =>
                            handleItemChange(idx, "kategoriId", Number(e.target.value))
                          }
                          required
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.nama} ({c.jenis}) — {c.poinPerKg} Poin/kg
                            </option>
                          ))}
                        </Select>

                        <Input
                          type="number"
                          step="0.1"
                          min="0.1"
                          label="Estimasi Berat (kg)"
                          placeholder="Contoh: 2.5"
                          value={item.beratEstimasi}
                          onChange={(e) =>
                            handleItemChange(idx, "beratEstimasi", e.target.value)
                          }
                          required
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2 text-[13px] border-t border-[#e0e0e0]">
                        <span className="text-[#7a7a7a]">
                          Rate: {selectedCat?.poinPerKg || 0} Poin/kg
                        </span>
                        <span className="font-semibold text-[#1F7A4D]">
                          Estimasi Poin: +{itemPoin} Poin
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Running Calculation Display (Prominent Apple Card) */}
          <Card className="p-6 bg-[#fafafc] border border-[#0066cc]/30 space-y-3">
            <div className="text-[14px] font-semibold text-[#0066cc] uppercase tracking-wider">
              Estimasi Perolehan Poin
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <span className="text-[34px] font-semibold text-[#1d1d1f] tracking-tight">
                  +{calculation.totalPoin.toLocaleString("id-ID")}
                </span>
                <span className="text-[17px] font-semibold text-[#1F7A4D] ml-2">Poin Digital</span>
              </div>
              <div className="text-[14px] text-[#7a7a7a]">
                Total Estimasi Berat:{" "}
                <strong className="text-[#1d1d1f]">{calculation.totalKg.toFixed(1)} kg</strong>
              </div>
            </div>
            <p className="text-[12px] text-[#7a7a7a] pt-1 border-t border-[#e0e0e0]">
              * Poin riil akan dihitung kembali oleh petugas bank sampah menggunakan timbangan akurat saat verifikasi fisik.
            </p>
          </Card>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link href="/nasabah/dashboard">
              <Button variant="secondary-pill">Batal</Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              className="px-8"
            >
              Kirim Pengajuan Setoran
            </Button>
          </div>
        </form>
      </div>
    </NasabahShell>
  );
}

export default function NasabahSetorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#7a7a7a]">Memuat form...</div>}>
      <SetorFormContent />
    </Suspense>
  );
}
