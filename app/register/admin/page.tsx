"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/toast";
import { Card } from "@/components/ui/card";
import { IconRecycle, Building } from "@/components/icons";
import { registerAdmin } from "@/lib/api/auth";

export default function RegisterAdminPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [namaUnit, setNamaUnit] = useState("");
  const [namaPengelola, setNamaPengelola] = useState("");
  const [nomorTelepon, setNomorTelepon] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setErrorMessage(null);
    setSuccessMessage(null);

    setIsLoading(true);
    try {
      const res = await registerAdmin({
        username,
        password,
        namaUnit,
        namaPengelola,
        nomorTelepon,
      });

      if (res.data) {
        setSuccessMessage("Unit Bank Sampah berhasil didaftarkan! Mengalihkan ke login...");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal mendaftarkan unit admin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f5f5f7]">
      {/* Header Bar */}
      <div className="w-full bg-[#000000] text-white h-[44px] flex items-center px-4 sm:px-8 border-b border-[#272729]">
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <IconRecycle className="w-5 h-5 text-[#2997ff]" />
            <span className="text-[14px] font-semibold text-white">EcoBank Digital</span>
          </Link>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-lg">
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#272729] text-[#2997ff] flex items-center justify-center mb-3">
              <Building className="w-7 h-7" />
            </div>
            <h1 className="text-[28px] font-semibold text-[#1d1d1f] tracking-tight">
              Registrasi Unit Bank Sampah
            </h1>
            <p className="text-[14px] text-[#7a7a7a] mt-1">
              Daftarkan unit pengelola untuk verifikasi dan rekap data sampah
            </p>
          </div>

          <Card className="p-8 bg-white">
            {errorMessage && (
              <div className="mb-5">
                <Alert variant="danger" onClose={() => setErrorMessage(null)}>
                  {errorMessage}
                </Alert>
              </div>
            )}
            {successMessage && (
              <div className="mb-5">
                <Alert variant="success">{successMessage}</Alert>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nama Unit Bank Sampah"
                placeholder="Contoh: Bank Sampah Berkah Hijau RW 05"
                value={namaUnit}
                onChange={(e) => setNamaUnit(e.target.value)}
                autoComplete="organization"
                autoFocus
                required
              />

              <Input
                label="Nama Penanggung Jawab / Pengelola"
                placeholder="Contoh: Pak Bambang Irawan"
                value={namaPengelola}
                onChange={(e) => setNamaPengelola(e.target.value)}
                autoComplete="name"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Username Admin"
                  placeholder="admin_unit"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
                <Input
                  type="password"
                  label="Password"
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>

              <Input
                type="tel"
                label="Nomor Telepon Unit"
                placeholder="081234567890"
                value={nomorTelepon}
                onChange={(e) => setNomorTelepon(e.target.value)}
                required
              />

              <div className="pt-3">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-3"
                  isLoading={isLoading}
                >
                  Daftarkan Unit Bank Sampah
                </Button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-[#e0e0e0] text-center text-[14px]">
              <span className="text-[#7a7a7a]">Sudah punya akun unit? </span>
              <Link
                href="/login"
                className="font-semibold text-[#0066cc] hover:underline"
              >
                Masuk di sini
              </Link>
            </div>
          </Card>
        </div>
      </div>

      <div className="py-6 text-center text-[12px] text-[#7a7a7a]">
        EcoBank Digital &copy; 2026 — UKK RPL Paket A
      </div>
    </div>
  );
}
