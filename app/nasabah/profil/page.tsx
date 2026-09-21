"use client";

import React, { useState, useEffect } from "react";
import { NasabahShell } from "@/components/layout/nasabah-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, LogOut, Coins, Key, Shield } from "@/components/icons";
import { useAuth } from "@/context/auth-context";
import { NasabahProfile } from "@/lib/api/types";
import { useRouter } from "next/navigation";

export default function NasabahProfilPage() {
  const router = useRouter();
  const { user, logout, appKey, refreshUser } = useAuth();

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const nasabah = user as NasabahProfile;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <NasabahShell user={nasabah} onLogout={handleLogout}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#1d1d1f] tracking-tight">
            Profil Nasabah
          </h1>
          <p className="text-[17px] text-[#7a7a7a]">
            Informasi akun dan pengaturan penyetoran sampah digital Anda.
          </p>
        </div>

        {/* Profile Card */}
        <Card className="p-8 bg-white space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-[#f0f0f0] pb-6">
            <div className="w-20 h-20 rounded-full bg-[#e6f0fa] text-[#0066cc] flex items-center justify-center shrink-0">
              {nasabah?.foto ? (
                <img
                  src={nasabah.foto}
                  alt={nasabah.namaLengkap}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <User className="w-10 h-10" />
              )}
            </div>
            <div className="text-center sm:text-left space-y-1">
              <h3 className="text-[24px] font-semibold text-[#1d1d1f]">
                {nasabah?.namaLengkap || "Nasabah EcoBank"}
              </h3>
              <p className="text-[14px] text-[#7a7a7a]">@{nasabah?.username || "username"}</p>
              <div className="pt-2">
                <Badge variant="success">Nasabah Terdaftar</Badge>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-[14px]">
            <div className="flex justify-between py-2 border-b border-[#f5f5f7]">
              <span className="text-[#7a7a7a]">Nomor Telepon:</span>
              <span className="font-semibold text-[#1d1d1f]">
                {nasabah?.nomorTelepon || "-"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#f5f5f7]">
              <span className="text-[#7a7a7a]">Alamat Tempat Tinggal:</span>
              <span className="font-semibold text-[#1d1d1f] text-right max-w-xs">
                {nasabah?.alamat || "-"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#f5f5f7]">
              <span className="text-[#7a7a7a]">Saldo Poin Terkumpul:</span>
              <span className="font-semibold text-[#1F7A4D] text-[16px]">
                {(nasabah?.totalPoin || 0).toLocaleString("id-ID")} Poin
              </span>
            </div>
          </div>
        </Card>

        {/* Tenant App Key Section */}
        <Card className="p-6 bg-white space-y-3">
          <div className="flex items-center gap-2 font-semibold text-[17px] text-[#1d1d1f]">
            <Key className="w-5 h-5 text-[#0066cc]" />
            <span>Koneksi App Key Siswa (Fixed)</span>
          </div>
          <p className="text-[13px] text-[#7a7a7a]">
            Backend SMK Telkom Malang memisahkan data tenant berdasarkan header x-app-key.
          </p>
          <div className="p-3 bg-[#f5f5f7] rounded-[8px] font-mono text-[13px] text-[#0066cc] truncate">
            {appKey || "9cce9564-d3ca-4786-94a9-7b29ac59cf36"}
          </div>
        </Card>

        {/* Logout Action */}
        <div className="pt-2 flex justify-end">
          <Button
            variant="danger"
            leftIcon={<LogOut className="w-4 h-4" />}
            onClick={handleLogout}
          >
            Keluar dari Akun
          </Button>
        </div>
      </div>
    </NasabahShell>
  );
}
