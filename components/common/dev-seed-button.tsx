"use client";

import React, { useState } from "react";
import { seedSampleData } from "@/lib/api/seed";
import { Sparkles } from "@/components/icons";

export function DevSeedButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  // Surface dev-only seed button
  const handleSeed = async () => {
    if (!confirm("Isi data sample (Kategori Sampah, Nasabah, Hadiah, dll) ke database tenant Anda?")) {
      return;
    }
    setIsLoading(true);
    setMessage(null);
    setIsError(false);
    try {
      const res = await seedSampleData();
      setMessage(res.message || "Data sample berhasil diisi!");
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setIsError(true);
      setMessage(err.message || "Gagal mengisi data sample. Pastikan App Key sudah diatur.");
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleSeed}
        disabled={isLoading}
        title="Load Sample Data untuk demo/testing"
        className="flex items-center gap-1.5 px-3 py-1 text-[12px] font-semibold rounded-full bg-[#f5f5f7] border border-[#e0e0e0] text-[#7a7a7a] hover:text-[#0066cc] hover:border-[#0066cc] transition-colors btn-apple-press cursor-pointer"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#0066cc]" />
        <span>{isLoading ? "Memuat Data..." : "Load Sample Data"}</span>
      </button>

      {message && (
        <div
          className={`absolute top-full right-0 mt-2 z-50 px-3 py-2 rounded-[8px] text-[12px] shadow-sm whitespace-nowrap animate-in fade-in duration-150 ${
            isError ? "bg-[#fdf2f2] text-[#D92D20] border border-[#D92D20]" : "bg-[#eaf5ee] text-[#1F7A4D] border border-[#1F7A4D]"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
