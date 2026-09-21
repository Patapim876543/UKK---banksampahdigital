"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/toast";
import { Card } from "@/components/ui/card";
import { IconRecycle, Upload } from "@/components/icons";
import { registerNasabah } from "@/lib/api/auth";

export default function RegisterNasabahPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [alamat, setAlamat] = useState("");
  const [nomorTelepon, setNomorTelepon] = useState("");
  const [foto, setFoto] = useState<File | null>(null);

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
      const res = await registerNasabah({
        username,
        password,
        namaLengkap,
        alamat,
        nomorTelepon,
        foto,
      });

      if (res.data) {
        setSuccessMessage("Akun nasabah berhasil didaftarkan! Mengalihkan ke halaman login...");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal mendaftarkan nasabah.");
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
            <h1 className="text-[28px] font-semibold text-[#1d1d1f] tracking-tight">
              Daftar Sebagai Nasabah
            </h1>
            <p className="text-[14px] text-[#7a7a7a] mt-1">
              Mulai setor sampah daur ulang dan kumpulkan poin reward
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
                label="Nama Lengkap"
                placeholder="Contoh: Siti Aisyah"
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                autoComplete="name"
                autoFocus
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Username"
                  placeholder="Username login"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
                <Input
                  type="password"
                  label="Password"
                  placeholder="Kata sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>

              <Input
                type="tel"
                label="Nomor Telepon / WhatsApp"
                placeholder="081234567890"
                value={nomorTelepon}
                onChange={(e) => setNomorTelepon(e.target.value)}
                autoComplete="tel"
                required
              />

              <Textarea
                label="Alamat Tempat Tinggal"
                placeholder="Jl. Mawar No. 12, RT 02 / RW 05"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                autoComplete="street-address"
                rows={2}
                required
              />

              {/* Photo Upload Placeholder */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-semibold text-[#1d1d1f] tracking-[-0.224px]">
                  Foto Profil (Opsional)
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-[8px] border border-[#e0e0e0] hover:bg-[#f5f5f7] cursor-pointer text-[14px] text-[#1d1d1f] transition-colors btn-apple-press">
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
                  {foto && (
                    <span className="text-[13px] text-[#1F7A4D] font-semibold truncate max-w-[200px]">
                      {foto.name}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-3"
                  isLoading={isLoading}
                >
                  Daftar Sekarang
                </Button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-[#e0e0e0] text-center text-[14px]">
              <span className="text-[#7a7a7a]">Sudah punya akun? </span>
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
