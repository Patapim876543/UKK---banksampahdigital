"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/toast";
import { Card } from "@/components/ui/card";
import { IconRecycle, Key } from "@/components/icons";
import { login as apiLogin } from "@/lib/api/auth";
import { useAuth } from "@/context/auth-context";
import { AppMakerModal } from "@/components/common/app-maker-modal";
import { DevSeedButton } from "@/components/common/dev-seed-button";

export default function LoginPage() {
  const router = useRouter();
  const { appKey, setAuthSession } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMakerModalOpen, setIsMakerModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setErrorMessage(null);

    if (!appKey) {
      setErrorMessage("App Key belum diatur. Silakan atur App Key siswa Anda terlebih dahulu.");
      setIsMakerModalOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiLogin({ username, password });
      if (res.data) {
        setAuthSession(res.data.token, res.data.role, res.data.profile);
        if (res.data.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/nasabah/dashboard");
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Username atau password salah.");
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
          <div className="flex items-center gap-3">
            <DevSeedButton />
            <button
              type="button"
              onClick={() => setIsMakerModalOpen(true)}
              className="text-[12px] text-[#2997ff] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Key className="w-3.5 h-3.5" />
              <span>{appKey ? "App Key: Terpasang" : "Atur App Key"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Login Box */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#e6f0fa] text-[#0066cc] flex items-center justify-center mb-3">
              <IconRecycle className="w-7 h-7" />
            </div>
            <h1 className="text-[28px] font-semibold text-[#1d1d1f] tracking-tight">
              Masuk ke EcoBank
            </h1>
            <p className="text-[14px] text-[#7a7a7a] mt-1">
              Portal bersama untuk Nasabah dan Pengelola Unit Bank Sampah
            </p>
          </div>

          <Card className="p-8 bg-white">
            {!appKey && (
              <div className="mb-5">
                <Alert
                  variant="warning"
                  title="App Key Diperlukan"
                  onClose={() => {}}
                >
                  Anda belum memasang App Key siswa. Klik tombol di bawah untuk mendaftar atau mencari App Key.
                  <div className="mt-2">
                    <Button
                      size="sm"
                      variant="pearl-capsule"
                      onClick={() => setIsMakerModalOpen(true)}
                    >
                      Buka Pengaturan App Key
                    </Button>
                  </div>
                </Alert>
              </div>
            )}

            {errorMessage && (
              <div className="mb-5">
                <Alert variant="danger" onClose={() => setErrorMessage(null)}>
                  {errorMessage}
                </Alert>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Username"
                placeholder="Masukkan username Anda"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
                disabled={isLoading}
                required
              />

              <Input
                type="password"
                label="Password"
                placeholder="Masukkan kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={isLoading}
                required
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-3"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  Masuk Akun
                </Button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-[#e0e0e0] text-center space-y-2 text-[14px]">
              <p className="text-[#7a7a7a]">
                Belum memiliki akun nasabah?{" "}
                <Link
                  href="/register/nasabah"
                  className="font-semibold text-[#0066cc] hover:underline"
                >
                  Daftar Nasabah
                </Link>
              </p>
              <p className="text-[#7a7a7a]">
                Pengelola baru?{" "}
                <Link
                  href="/register/admin"
                  className="font-semibold text-[#0066cc] hover:underline"
                >
                  Daftar Unit Bank Sampah
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Simple Footer */}
      <div className="py-6 text-center text-[12px] text-[#7a7a7a]">
        EcoBank Digital &copy; 2026 — UKK RPL Paket A
      </div>

      <AppMakerModal
        isOpen={isMakerModalOpen}
        onClose={() => setIsMakerModalOpen(false)}
      />
    </div>
  );
}
