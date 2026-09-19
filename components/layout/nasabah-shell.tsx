"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Plus,
  History,
  Gift,
  User,
  IconRecycle,
  LogOut,
  Layers,
} from "@/components/icons";
import { useAuth } from "@/context/auth-context";
import { NasabahProfile } from "@/lib/api/types";

interface NasabahShellProps {
  children: React.ReactNode;
  user?: {
    namaLengkap?: string;
    username?: string;
    totalPoin?: number;
  };
  onLogout?: () => void;
}

export function NasabahShell({ children, user, onLogout }: NasabahShellProps) {
  const pathname = usePathname();
  const { user: authUser, logout: authLogout, refreshUser } = useAuth();

  // Auto-refresh user session when navigating between routes
  useEffect(() => {
    refreshUser();
  }, [pathname, refreshUser]);

  const currentUser = {
    ...((authUser as NasabahProfile) || {}),
    ...(user || {}),
  };
  const handleLogout = onLogout || authLogout;

  const navItems = [
    { label: "Beranda", href: "/nasabah/dashboard", icon: Home },
    { label: "Katalog", href: "/nasabah/katalog", icon: Layers },
    { label: "Setor", href: "/nasabah/setor", icon: Plus },
    { label: "Riwayat", href: "/nasabah/riwayat", icon: History },
    { label: "Tukar Poin", href: "/nasabah/tukar-poin", icon: Gift },
    { label: "Akun", href: "/nasabah/profil", icon: User },
  ];

  const mobileNavItems = [
    { label: "Beranda", href: "/nasabah/dashboard", icon: Home },
    { label: "Setor", href: "/nasabah/setor", icon: Plus },
    { label: "Riwayat", href: "/nasabah/riwayat", icon: History },
    { label: "Tukar", href: "/nasabah/tukar-poin", icon: Gift },
    { label: "Akun", href: "/nasabah/profil", icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#ffffff] text-[#1d1d1f]">
      {/* Top Global Bar */}
      <header className="sticky top-0 z-30 w-full h-[44px] bg-[#000000] text-white flex items-center px-4 sm:px-8 border-b border-[#272729]">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <Link href="/nasabah/dashboard" className="flex items-center gap-2">
            <IconRecycle className="w-5 h-5 text-[#2997ff]" />
            <span className="text-[14px] font-semibold tracking-[-0.224px]">EcoBank Digital</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#272729] text-[#2997ff] ml-1">
              Nasabah
            </span>
          </Link>
          <div className="flex items-center gap-3 text-[12px] text-[#cccccc]">
            {currentUser?.totalPoin !== undefined && (
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#1F7A4D]/20 text-[#30d158] text-[12px] font-semibold">
                <span>{currentUser.totalPoin.toLocaleString("id-ID")} Poin</span>
              </div>
            )}
            {currentUser && (
              <span className="hidden sm:inline">
                Halo, <strong className="text-white">{currentUser.namaLengkap || currentUser.username}</strong>
              </span>
            )}
            {handleLogout && (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-[#cccccc] hover:text-white transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Desktop Sub-Nav Frosted */}
      <nav className="hidden md:block sticky top-[44px] z-20 w-full bg-[#f5f5f7]/80 backdrop-blur-md border-b border-[#e0e0e0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 flex items-center justify-between h-[52px]">
          <div className="flex items-center space-x-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 text-[14px] font-semibold transition-colors py-1 border-b-2 ${
                    isActive
                      ? "border-[#0066cc] text-[#0066cc]"
                      : "border-transparent text-[#7a7a7a] hover:text-[#1d1d1f]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {currentUser?.totalPoin !== undefined && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eaf5ee] text-[#1F7A4D] text-[14px] font-semibold">
                <span>{currentUser.totalPoin.toLocaleString("id-ID")} Poin</span>
              </div>
            )}
            <Link
              href="/nasabah/setor"
              className="px-4 py-1.5 rounded-full bg-[#0066cc] text-white text-[14px] font-normal hover:bg-[#0071e3] transition-all btn-apple-press"
            >
              + Setor Sampah
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-8 py-6 pb-24 md:pb-12">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#ffffff] border-t border-[#e0e0e0] flex items-center justify-around h-[64px] px-2 safe-area-pb shadow-sm">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 transition-colors ${
                isActive ? "text-[#0066cc]" : "text-[#7a7a7a] hover:text-[#1d1d1f]"
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? "text-[#0066cc]" : "text-[#7a7a7a]"}`} />
              <span className={`text-[11px] tracking-tight ${isActive ? "font-semibold" : "font-normal"}`}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
