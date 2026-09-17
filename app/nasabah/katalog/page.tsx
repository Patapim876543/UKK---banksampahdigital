"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { NasabahShell } from "@/components/layout/nasabah-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Search,
  IconPlasticBottle,
  IconPaperWaste,
  IconMetalCan,
  IconGlassJar,
  IconRecycle,
  Plus,
  Coins,
} from "@/components/icons";
import { useAuth } from "@/context/auth-context";
import { getKategoriSampah } from "@/lib/api/kategoriSampah";
import { KategoriSampah } from "@/lib/api/types";

export default function NasabahKatalogPage() {
  const { user, logout } = useAuth();
  const [categories, setCategories] = useState<KategoriSampah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("SEMUA");

  useEffect(() => {
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
    fetchCategories();
  }, []);

  const filterOptions = ["SEMUA", "PLASTIK", "KERTAS", "LOGAM", "KACA"];

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchSearch =
        cat.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.deskripsi?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilter =
        selectedFilter === "SEMUA" ||
        cat.jenis?.toUpperCase() === selectedFilter.toUpperCase();
      return matchSearch && matchFilter;
    });
  }, [categories, searchQuery, selectedFilter]);

  const getCategoryIcon = (jenis: string) => {
    switch (jenis?.toUpperCase()) {
      case "PLASTIK":
        return <IconPlasticBottle className="w-8 h-8 text-[#0066cc]" />;
      case "KERTAS":
        return <IconPaperWaste className="w-8 h-8 text-[#B45309]" />;
      case "LOGAM":
        return <IconMetalCan className="w-8 h-8 text-[#7a7a7a]" />;
      case "KACA":
        return <IconGlassJar className="w-8 h-8 text-[#1F7A4D]" />;
      default:
        return <IconRecycle className="w-8 h-8 text-[#0066cc]" />;
    }
  };

  return (
    <NasabahShell user={user as any} onLogout={logout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#1d1d1f] tracking-tight">
              Katalog Sampah Daur Ulang
            </h1>
            <p className="text-[17px] text-[#7a7a7a]">
              Daftar jenis sampah yang diterima beserta harga tukar dan poin per kilogram.
            </p>
          </div>
          <Link href="/nasabah/setor">
            <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
              Ajukan Penyetoran
            </Button>
          </Link>
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-3">
          {/* Apple Pill Search Input */}
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#7a7a7a]" />
            <input
              type="text"
              placeholder="Cari kategori sampah (misal: botol, kardus)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#ffffff] text-[#1d1d1f] text-[15px] pl-11 pr-4 py-2.5 rounded-full border border-[#e0e0e0] focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3] outline-none transition-all placeholder:text-[#7a7a7a]"
            />
          </div>

          {/* Filter Option Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {filterOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setSelectedFilter(opt)}
                className={`px-4 py-1.5 rounded-full text-[14px] font-semibold transition-all btn-apple-press cursor-pointer whitespace-nowrap ${
                  selectedFilter === opt
                    ? "bg-[#1d1d1f] text-white"
                    : "bg-[#f5f5f7] text-[#7a7a7a] hover:text-[#1d1d1f] hover:bg-[#e0e0e0]"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-64 bg-[#f5f5f7] animate-pulse rounded-[18px]" />
            ))}
          </div>
        ) : filteredCategories.length === 0 ? (
          <Card className="p-8 text-center bg-white">
            <EmptyState
              icon={<Search className="w-8 h-8" />}
              title="Kategori Tidak Ditemukan"
              description={`Tidak ada kategori sampah yang cocok dengan filter "${searchQuery || selectedFilter}".`}
              actionLabel="Reset Pencarian"
              onAction={() => {
                setSearchQuery("");
                setSelectedFilter("SEMUA");
              }}
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
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-14 h-14 rounded-[14px] bg-[#f5f5f7] flex items-center justify-center shrink-0">
                      {cat.foto ? (
                        <img
                          src={cat.foto}
                          alt={cat.nama}
                          className="w-full h-full object-cover rounded-[14px]"
                        />
                      ) : (
                        getCategoryIcon(cat.jenis)
                      )}
                    </div>
                    <Badge variant="primary">{cat.jenis}</Badge>
                  </div>

                  <h3 className="text-[21px] font-semibold text-[#1d1d1f] tracking-tight mb-1">
                    {cat.nama}
                  </h3>
                  {cat.deskripsi && (
                    <p className="text-[14px] text-[#7a7a7a] line-clamp-2 mb-4">
                      {cat.deskripsi}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-[#f0f0f0] space-y-3">
                  <div className="flex items-center justify-between text-[14px]">
                    <span className="text-[#7a7a7a]">Harga Nilai:</span>
                    <span className="font-semibold text-[#1d1d1f]">
                      Rp {cat.hargaPerKg?.toLocaleString("id-ID") || 0} / kg
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[14px]">
                    <span className="text-[#7a7a7a]">Perolehan Poin:</span>
                    <div className="flex items-center gap-1 font-semibold text-[#1F7A4D]">
                      <Coins className="w-4 h-4" />
                      <span>{cat.poinPerKg?.toLocaleString("id-ID") || 0} Poin / kg</span>
                    </div>
                  </div>

                  <Link href={`/nasabah/setor?kategoriId=${cat.id}`} className="block w-full pt-1">
                    <Button variant="secondary-pill" className="w-full" size="sm">
                      Setor Kategori Ini
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </NasabahShell>
  );
}
