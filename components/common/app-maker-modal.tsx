"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/toast";
import { useAuth } from "@/context/auth-context";
import { registerAppMaker, loginAppMaker, checkAppKeyByEmail } from "@/lib/api/maker";
import { Shield, Check, Key } from "@/components/icons";

interface AppMakerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppMakerModal({ isOpen, onClose }: AppMakerModalProps) {
  const { appKey, setAppKey } = useAuth();
  const [tab, setTab] = useState<"register" | "login" | "check" | "manual">("register");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [namaSiswa, setNamaSiswa] = useState("");
  const [kelas, setKelas] = useState("XII RPL");
  const [namaApp, setNamaApp] = useState("EcoBank Digital");
  const [manualKey, setManualKey] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setIsLoading(true);
    try {
      const res = await registerAppMaker({
        email,
        password,
        namaSiswa,
        kelas,
        namaApp,
      });
      if (res.data?.appKey) {
        setAppKey(res.data.appKey);
        setSuccessMessage(`Registrasi berhasil! App Key Anda: ${res.data.appKey}`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal mendaftarkan App Maker.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setIsLoading(true);
    try {
      const res = await loginAppMaker({ email, password });
      if (res.data?.appKey) {
        setAppKey(res.data.appKey);
        setSuccessMessage(`Login berhasil! App Key aktif: ${res.data.appKey}`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Login App Maker gagal.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckKey = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setIsLoading(true);
    try {
      const res = await checkAppKeyByEmail(email);
      if (res.data?.appKey) {
        setAppKey(res.data.appKey);
        setSuccessMessage(`App Key ditemukan untuk ${email}: ${res.data.appKey}`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Email tidak ditemukan atau belum terdaftar.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSave = (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    if (!manualKey.trim()) {
      setErrorMessage("Masukkan App Key yang valid.");
      return;
    }
    setAppKey(manualKey.trim());
    setSuccessMessage("App Key berhasil disimpan.");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pengaturan App Key (Siswa UKK)"
      description="API Bank Sampah SMK Telkom Malang memerlukan App Key per siswa untuk mengisolasi data tenant."
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Navigation Tabs (Underline Style Apple Restraint) */}
        <div className="flex border-b border-[#e0e0e0] gap-4 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => {
              setTab("register");
              resetMessages();
            }}
            className={`text-[14px] font-semibold pb-2 transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
              tab === "register"
                ? "border-[#0066cc] text-[#0066cc]"
                : "border-transparent text-[#7a7a7a] hover:text-[#1d1d1f]"
            }`}
          >
            Registrasi Maker Baru
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("login");
              resetMessages();
            }}
            className={`text-[14px] font-semibold pb-2 transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
              tab === "login"
                ? "border-[#0066cc] text-[#0066cc]"
                : "border-transparent text-[#7a7a7a] hover:text-[#1d1d1f]"
            }`}
          >
            Login Maker
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("check");
              resetMessages();
            }}
            className={`text-[14px] font-semibold pb-2 transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
              tab === "check"
                ? "border-[#0066cc] text-[#0066cc]"
                : "border-transparent text-[#7a7a7a] hover:text-[#1d1d1f]"
            }`}
          >
            Cari Key via Email
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("manual");
              resetMessages();
            }}
            className={`text-[14px] font-semibold pb-2 transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
              tab === "manual"
                ? "border-[#0066cc] text-[#0066cc]"
                : "border-transparent text-[#7a7a7a] hover:text-[#1d1d1f]"
            }`}
          >
            Input Manual
          </button>
        </div>

        {/* Current Key Status */}
        {appKey && (
          <div className="p-3 bg-[#f5f5f7] rounded-[8px] flex items-center justify-between text-[14px]">
            <div className="flex items-center gap-2 text-[#1d1d1f] truncate mr-2">
              <span className="font-semibold text-[#7a7a7a]">App Key Aktif:</span>
              <code className="text-[#0066cc] font-mono text-[13px] truncate">{appKey}</code>
            </div>
            <span className="shrink-0 text-[#1F7A4D] font-semibold text-[13px] flex items-center gap-1">
              <Check className="w-4 h-4" /> Terhubung
            </span>
          </div>
        )}

        {/* Feedback Alert */}
        {errorMessage && (
          <Alert variant="danger" onClose={() => setErrorMessage(null)}>
            {errorMessage}
          </Alert>
        )}
        {successMessage && (
          <Alert variant="success" onClose={() => setSuccessMessage(null)}>
            {successMessage}
          </Alert>
        )}

        {/* Tab 1: Register */}
        {tab === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nama Siswa"
                placeholder="Contoh: Budi Santoso"
                value={namaSiswa}
                onChange={(e) => setNamaSiswa(e.target.value)}
                required
              />
              <Input
                label="Kelas"
                placeholder="Contoh: XII RPL 1"
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                required
              />
            </div>
            <Input
              label="Nama Aplikasi"
              placeholder="Contoh: EcoBank Digital"
              value={namaApp}
              onChange={(e) => setNamaApp(e.target.value)}
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="email"
                label="Email Siswa"
                placeholder="siswa@smk.sch.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                label="Password Akun Maker"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary-pill" onClick={onClose}>
                Tutup
              </Button>
              <Button type="submit" variant="primary" isLoading={isLoading}>
                Daftar & Dapatkan App Key
              </Button>
            </div>
          </form>
        )}

        {/* Tab 2: Login */}
        {tab === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              label="Email Siswa"
              placeholder="siswa@smk.sch.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              label="Password Akun Maker"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary-pill" onClick={onClose}>
                Tutup
              </Button>
              <Button type="submit" variant="primary" isLoading={isLoading}>
                Login & Ambil Key
              </Button>
            </div>
          </form>
        )}

        {/* Tab 3: Check Key */}
        {tab === "check" && (
          <form onSubmit={handleCheckKey} className="space-y-4">
            <p className="text-[14px] text-[#7a7a7a]">
              Lupa App Key Anda? Masukkan alamat email yang Anda gunakan saat mendaftar akun siswa sebelumnya:
            </p>
            <Input
              type="email"
              label="Email Siswa"
              placeholder="siswa@smk.sch.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary-pill" onClick={onClose}>
                Tutup
              </Button>
              <Button type="submit" variant="primary" isLoading={isLoading}>
                Cari App Key
              </Button>
            </div>
          </form>
        )}

        {/* Tab 4: Manual */}
        {tab === "manual" && (
          <form onSubmit={handleManualSave} className="space-y-4">
            <p className="text-[14px] text-[#7a7a7a]">
              Jika Anda sudah memiliki App Key yang telah digenerate sebelumnya, masukkan langsung di bawah ini:
            </p>
            <Input
              label="App Key"
              placeholder="Tempelkan App Key di sini"
              value={manualKey}
              onChange={(e) => setManualKey(e.target.value)}
              required
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary-pill" onClick={onClose}>
                Tutup
              </Button>
              <Button type="submit" variant="primary">
                Simpan & Aktifkan
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
