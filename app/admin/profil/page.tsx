"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/layout/admin-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, LogOut, Key, Shield } from "@/components/icons";
import { useAuth } from "@/context/auth-context";
import { AdminProfile } from "@/lib/api/types";
import { AppMakerModal } from "@/components/common/app-maker-modal";

export default function AdminProfilPage() {
  const router = useRouter();
  const { user, logout, appKey, refreshUser } = useAuth();
  const [isMakerModalOpen, setIsMakerModalOpen] = useState(false);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const admin = user as AdminProfile;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <AdminShell user={admin} onLogout={handleLogout}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#1d1d1f] tracking-tight">
            Profil Unit Bank Sampah
          </h1>
          <p className="text-[17px] text-[#7a7a7a]">
            Informasi pengelola unit dan status koneksi API backend.
          </p>
        </div>

        {/* Profile Card */}
        <Card className="p-8 bg-white space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-[#f0f0f0] pb-6">
            <div className="w-20 h-20 rounded-full bg-[#272729] text-[#2997ff] flex items-center justify-center shrink-0">
              <Building className="w-10 h-10" />
            </div>
            <div className="text-center sm:text-left space-y-1">
              <h3 className="text-[24px] font-semibold text-[#1d1d1f]">
                {admin?.namaUnit || "Unit Bank Sampah"}
              </h3>
              <p className="text-[14px] text-[#7a7a7a]">
                Penanggung Jawab: <strong className="text-[#1d1d1f]">{admin?.namaPengelola || "Admin"}</strong>
              </p>
              <div className="pt-2">
                <Badge variant="primary">Administrator Unit</Badge>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-[14px]">
            <div className="flex justify-between py-2 border-b border-[#f5f5f7]">
              <span className="text-[#7a7a7a]">Username Admin:</span>
              <span className="font-semibold text-[#1d1d1f] font-mono">
                @{admin?.username || "admin"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#f5f5f7]">
              <span className="text-[#7a7a7a]">Nomor Kontak / WhatsApp Unit:</span>
              <span className="font-semibold text-[#1d1d1f]">
                {admin?.nomorTelepon || "-"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#f5f5f7]">
              <span className="text-[#7a7a7a]">Peran Sistem:</span>
              <span className="font-semibold text-[#0066cc]">
                Pengelola &amp; Verifikator Fisik
              </span>
            </div>
          </div>
        </Card>

        {/* App Key Status Card */}
        <Card className="p-6 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-[17px] text-[#1d1d1f]">
              <Key className="w-5 h-5 text-[#0066cc]" />
              <span>Koneksi App Key Siswa UKK</span>
            </div>
            <Button
              size="sm"
              variant="pearl-capsule"
              onClick={() => setIsMakerModalOpen(true)}
            >
              Ganti Key
            </Button>
          </div>
          <p className="text-[13px] text-[#7a7a7a]">
            Backend SMK Telkom Malang memisahkan data tenant berdasarkan header x-app-key.
          </p>
          <div className="p-3 bg-[#f5f5f7] rounded-[8px] font-mono text-[13px] text-[#0066cc] truncate">
            {appKey || "Belum ada App Key aktif"}
          </div>
        </Card>

        {/* Logout button */}
        <div className="pt-2 flex justify-end">
          <Button
            variant="danger"
            leftIcon={<LogOut className="w-4 h-4" />}
            onClick={handleLogout}
          >
            Keluar dari Akun Admin
          </Button>
        </div>
      </div>

      <AppMakerModal
        isOpen={isMakerModalOpen}
        onClose={() => setIsMakerModalOpen(false)}
      />
    </AdminShell>
  );
}
