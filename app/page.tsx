"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  IconRecycle,
  IconPlasticBottle,
  IconPaperWaste,
  IconMetalCan,
  IconGlassJar,
  IconCoinLeaf,
  IconScale,
  Shield,
  ArrowRight,
  Sparkles,
  Key,
} from "@/components/icons";
import { AppMakerModal } from "@/components/common/app-maker-modal";
import { DevSeedButton } from "@/components/common/dev-seed-button";
import { useAuth } from "@/context/auth-context";

export default function HomePage() {
  const [isMakerModalOpen, setIsMakerModalOpen] = useState(false);
  const { appKey, isAuthenticated, role } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#ffffff] text-[#1d1d1f]">
      {/* Apple Global Nav (44px Pure Black) */}
      <header className="sticky top-0 z-40 w-full h-[44px] bg-[#000000] text-white flex items-center px-4 sm:px-8 border-b border-[#272729]">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white">
            <IconRecycle className="w-5 h-5 text-[#2997ff]" />
            <span className="text-[14px] font-semibold tracking-[-0.224px]">EcoBank Digital</span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Dev Sample Data Button */}
            <DevSeedButton />

            {/* App Maker Key Status / Button */}
            <button
              type="button"
              onClick={() => setIsMakerModalOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1 text-[12px] font-semibold rounded-full border transition-all btn-apple-press cursor-pointer ${
                appKey
                  ? "bg-[#272729] text-[#2997ff] border-[#2997ff]/40"
                  : "bg-[#0066cc] text-white border-[#0066cc]"
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>{appKey ? "App Key Aktif" : "Atur App Key Siswa"}</span>
            </button>

            {isAuthenticated ? (
              <Link
                href={role === "ADMIN" ? "/admin/dashboard" : "/nasabah/dashboard"}
                className="text-[12px] text-white hover:text-[#2997ff] transition-colors"
              >
                Ke Dashboard &rarr;
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-[12px] text-white hover:text-[#2997ff] transition-colors"
              >
                Masuk
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Sub-Nav Frosted Header */}
      <div className="sticky top-[44px] z-30 w-full bg-[#f5f5f7]/80 backdrop-blur-md border-b border-[#e0e0e0] h-[52px] flex items-center px-4 sm:px-8">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <div className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight">
            Bank Sampah Digital &amp; Daur Ulang Modern
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden sm:inline-flex px-4 py-1.5 rounded-full text-[14px] text-[#0066cc] hover:bg-[#0066cc]/5 transition-colors btn-apple-press"
            >
              Masuk
            </Link>
            <Link
              href="/register/nasabah"
              className="px-4 py-1.5 rounded-full bg-[#0066cc] text-white text-[14px] font-normal hover:bg-[#0071e3] transition-all btn-apple-press"
            >
              Daftar Nasabah
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section (Product Tile Light #ffffff) */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 text-center bg-[#ffffff]">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eaf5ee] text-[#1F7A4D] text-[14px] font-semibold">
            <IconRecycle className="w-4 h-4" />
            <span>UKK RPL 2026/2027 — Eco-Waste Management</span>
          </div>

          <h1 className="typography-hero-display text-[#1d1d1f]">
            Ubah Sampah Jadi Berkah Digital.
          </h1>

          <p className="text-[17px] sm:text-[21px] text-[#7a7a7a] leading-relaxed max-w-2xl mx-auto">
            Platform modern untuk menimbang sampah daur ulang, mengumpulkan poin reward, dan menukarkannya dengan voucher serta sembako bernilai nyata.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/register/nasabah"
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#0066cc] text-white text-[17px] font-normal hover:bg-[#0071e3] transition-all btn-apple-press flex items-center justify-center gap-2"
            >
              <span>Mulai Sebagai Nasabah</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-transparent text-[#0066cc] border border-[#0066cc] text-[17px] font-normal hover:bg-[#0066cc]/5 transition-all btn-apple-press flex items-center justify-center"
            >
              Masuk Akun
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid (Tile Parchment #f5f5f7) */}
      <section className="py-20 px-4 sm:px-8 bg-[#f5f5f7]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="typography-display-lg text-[#1d1d1f] mb-3">
              Daur ulang mudah, manfaat melimpah.
            </h2>
            <p className="text-[17px] text-[#7a7a7a]">
              Sistem terintegrasi dari penyetoran mandiri nasabah hingga verifikasi timbangan akurat oleh admin unit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-[#ffffff] rounded-[18px] p-6 border border-[#e0e0e0] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-[#e6f0fa] text-[#0066cc] flex items-center justify-center mb-4">
                  <IconScale className="w-6 h-6" />
                </div>
                <h3 className="text-[21px] font-semibold text-[#1d1d1f] mb-2 tracking-tight">
                  1. Setor &amp; Timbang
                </h3>
                <p className="text-[14px] text-[#7a7a7a] leading-relaxed">
                  Ajukan penyetoran sampah plastik, kertas, logam, atau kaca. Masukkan estimasi berat dan admin unit akan memverifikasi dengan timbangan riil.
                </p>
              </div>
              <div className="pt-6">
                <Link
                  href="/login"
                  className="text-[14px] font-semibold text-[#0066cc] hover:underline flex items-center gap-1"
                >
                  Pelajari alur setor &rarr;
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#ffffff] rounded-[18px] p-6 border border-[#e0e0e0] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-[#eaf5ee] text-[#1F7A4D] flex items-center justify-center mb-4">
                  <IconCoinLeaf className="w-6 h-6" />
                </div>
                <h3 className="text-[21px] font-semibold text-[#1d1d1f] mb-2 tracking-tight">
                  2. Kumpulkan Poin
                </h3>
                <p className="text-[14px] text-[#7a7a7a] leading-relaxed">
                  Setiap kilogram sampah terverifikasi langsung dikonversi menjadi saldo poin digital dengan rasio poin transparan per kategori.
                </p>
              </div>
              <div className="pt-6">
                <Link
                  href="/nasabah/katalog"
                  className="text-[14px] font-semibold text-[#0066cc] hover:underline flex items-center gap-1"
                >
                  Lihat rate poin &rarr;
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#ffffff] rounded-[18px] p-6 border border-[#e0e0e0] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-[#fef7e9] text-[#B45309] flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-[21px] font-semibold text-[#1d1d1f] mb-2 tracking-tight">
                  3. Tukar Hadiah &amp; Voucher
                </h3>
                <p className="text-[14px] text-[#7a7a7a] leading-relaxed">
                  Tukarkan poin Anda dengan katalog sembako, voucher belanja, token listrik, hingga uang digital dengan kuitansi nota otomatis.
                </p>
              </div>
              <div className="pt-6">
                <Link
                  href="/login"
                  className="text-[14px] font-semibold text-[#0066cc] hover:underline flex items-center gap-1"
                >
                  Katalog reward &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kategori Sampah yang Diterima (Light #ffffff) */}
      <section className="py-20 px-4 sm:px-8 bg-[#ffffff]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="typography-display-lg text-[#1d1d1f] mb-2">
              Jenis Sampah Daur Ulang
            </h2>
            <p className="text-[17px] text-[#7a7a7a]">
              Dipilah berdasarkan 4 kelompok utama dengan nilai tukar terbaik.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#f5f5f7] rounded-[18px] p-6 text-center border border-[#e0e0e0]">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#ffffff] flex items-center justify-center text-[#0066cc] mb-3">
                <IconPlasticBottle className="w-6 h-6" />
              </div>
              <div className="font-semibold text-[17px] text-[#1d1d1f]">Plastik</div>
              <div className="text-[12px] text-[#7a7a7a] mt-1">Botol, kresek, gelas cup</div>
            </div>

            <div className="bg-[#f5f5f7] rounded-[18px] p-6 text-center border border-[#e0e0e0]">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#ffffff] flex items-center justify-center text-[#0066cc] mb-3">
                <IconPaperWaste className="w-6 h-6" />
              </div>
              <div className="font-semibold text-[17px] text-[#1d1d1f]">Kertas</div>
              <div className="text-[12px] text-[#7a7a7a] mt-1">Kardus, buku, arsip HVS</div>
            </div>

            <div className="bg-[#f5f5f7] rounded-[18px] p-6 text-center border border-[#e0e0e0]">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#ffffff] flex items-center justify-center text-[#0066cc] mb-3">
                <IconMetalCan className="w-6 h-6" />
              </div>
              <div className="font-semibold text-[17px] text-[#1d1d1f]">Logam</div>
              <div className="text-[12px] text-[#7a7a7a] mt-1">Kaleng aluminium, besi, tembaga</div>
            </div>

            <div className="bg-[#f5f5f7] rounded-[18px] p-6 text-center border border-[#e0e0e0]">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#ffffff] flex items-center justify-center text-[#0066cc] mb-3">
                <IconGlassJar className="w-6 h-6" />
              </div>
              <div className="font-semibold text-[17px] text-[#1d1d1f]">Kaca</div>
              <div className="text-[12px] text-[#7a7a7a] mt-1">Botol sirup, toples, kaca bening</div>
            </div>
          </div>
        </div>
      </section>

      {/* Dark Tile Section (Apple Product Tile Dark #272729) */}
      <section className="py-20 px-4 sm:px-8 bg-[#272729] text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2a2a2c] text-[#2997ff] text-[13px] font-semibold border border-[#333333]">
            <Shield className="w-4 h-4" />
            <span>Portal Unit Pengelola Bank Sampah</span>
          </div>

          <h2 className="typography-display-lg text-white">
            Kelola data nasabah &amp; verifikasi setoran dengan cepat.
          </h2>

          <p className="text-[17px] text-[#cccccc] max-w-2xl mx-auto leading-relaxed">
            Disediakan portal khusus admin bank sampah unit untuk penimbangan riil, manajemen hadiah, pencatatan transaksi, dan rekapitulasi tonase bulanan otomatis.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register/admin"
              className="px-6 py-2.5 rounded-full bg-[#0066cc] text-white text-[14px] font-normal hover:bg-[#0071e3] transition-all btn-apple-press"
            >
              Daftar Unit Bank Sampah Baru
            </Link>
            <Link
              href="/login"
              className="px-6 py-2.5 rounded-full bg-transparent text-[#2997ff] border border-[#2997ff] text-[14px] font-normal hover:bg-[#2997ff]/10 transition-all btn-apple-press"
            >
              Masuk Sebagai Admin Unit
            </Link>
          </div>
        </div>
      </section>

      {/* Apple Footer (Canvas Parchment #f5f5f7) */}
      <footer className="bg-[#f5f5f7] border-t border-[#e0e0e0] py-16 px-4 sm:px-8 text-[#7a7a7a]">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-[14px]">
            <div>
              <h4 className="font-semibold text-[#1d1d1f] mb-3">Layanan Nasabah</h4>
              <ul className="space-y-2">
                <li><Link href="/register/nasabah" className="hover:text-[#0066cc]">Registrasi Nasabah</Link></li>
                <li><Link href="/login" className="hover:text-[#0066cc]">Masuk Akun</Link></li>
                <li><Link href="/nasabah/katalog" className="hover:text-[#0066cc]">Katalog Kategori Sampah</Link></li>
                <li><Link href="/nasabah/setor" className="hover:text-[#0066cc]">Pengajuan Setor</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#1d1d1f] mb-3">Unit Pengelola</h4>
              <ul className="space-y-2">
                <li><Link href="/register/admin" className="hover:text-[#0066cc]">Daftar Unit Baru</Link></li>
                <li><Link href="/login" className="hover:text-[#0066cc]">Login Admin Unit</Link></li>
                <li><Link href="/admin/verifikasi" className="hover:text-[#0066cc]">Verifikasi Setoran</Link></li>
                <li><Link href="/admin/laporan" className="hover:text-[#0066cc]">Rekapitulasi Bulanan</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#1d1d1f] mb-3">Integrasi Backend</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    type="button"
                    onClick={() => setIsMakerModalOpen(true)}
                    className="hover:text-[#0066cc] text-left cursor-pointer"
                  >
                    Pengaturan App Key
                  </button>
                </li>
                <li>
                  <a
                    href="https://learn.smktelkom-mlg.sch.id/bank_sampah/api/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#0066cc]"
                  >
                    Dokumentasi Swagger API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#1d1d1f] mb-3">Uji Kompetensi</h4>
              <p className="text-[12px] leading-relaxed text-[#7a7a7a]">
                UKK RPL 2026/2027 Kategori Frontend (Web) Paket A. Didesain dengan prinsip Apple Design System.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-[#e0e0e0] flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px]">
            <p>&copy; 2026 EcoBank Digital. Seluruh hak cipta dilindungi undang-undang.</p>
            <p>Dibangun dengan Next.js App Router &amp; Tailwind CSS.</p>
          </div>
        </div>
      </footer>

      {/* App Maker Onboarding Modal */}
      <AppMakerModal
        isOpen={isMakerModalOpen}
        onClose={() => setIsMakerModalOpen(false)}
      />
    </div>
  );
}
