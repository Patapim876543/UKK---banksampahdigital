"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CheckCircle2,
  History,
  User,
  Layers,
  Gift,
  FileText,
  Building,
  LogOut,
  IconRecycle,
  Coins,
  PackageCheck,
} from "@/components/icons";
import { useAuth } from "@/context/auth-context";
import { AdminProfile } from "@/lib/api/types";

interface AdminShellProps {
  children: React.ReactNode;
  user?: {
    namaUnit?: string;
    namaPengelola?: string;
    username?: string;
  };
  onLogout?: () => void;
}

export function AdminShell({ children, user, onLogout }: AdminShellProps) {
  const pathname = usePathname();
  const { user: authUser, logout: authLogout, refreshUser } = useAuth();

  // Auto-refresh admin session when navigating between routes
  useEffect(() => {
    refreshUser();
  }, [pathname, refreshUser]);

  const currentUser = {
    ...((authUser as AdminProfile) || {}),
    ...(user || {}),
  };
  const handleLogout = onLogout || authLogout;

  const menuItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: BarChart3 },
    { label: "Verifikasi Setor", href: "/admin/verifikasi", icon: CheckCircle2 },
    { label: "Transaksi", href: "/admin/transaksi", icon: History },
    { label: "Kelola Nasabah", href: "/admin/nasabah", icon: User },
    { label: "Kategori Sampah", href: "/admin/kategori", icon: Layers },
    { label: "Katalog Hadiah", href: "/admin/hadiah", icon: Gift },
    { label: "Penukaran Poin", href: "/admin/penukaran", icon: Coins },
    { label: "Laporan Rekap", href: "/admin/laporan", icon: FileText },
    { label: "Profil Unit", href: "/admin/profil", icon: Building },
  ];

  const mobileNavItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: BarChart3 },
    { label: "Verifikasi", href: "/admin/verifikasi", icon: CheckCircle2 },
    { label: "Transaksi", href: "/admin/transaksi", icon: History },
    { label: "Laporan", href: "/admin/laporan", icon: FileText },
    { label: "Unit", href: "/admin/profil", icon: Building },
  ];

  return (
    <div className="min-h-screen flex bg-[#ffffff] text-[#1d1d1f]">
      {/* Desktop Sidebar (Pure Black #000000) */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-30 bg-[#000000] text-white border-r border-[#272729]">
        {/* Unit Branding */}
        <div className="h-[64px] flex items-center gap-2.5 px-6 border-b border-[#272729]">
          <IconRecycle className="w-6 h-6 text-[#2997ff]" />
          <div>
            <div className="text-[14px] font-semibold tracking-tight text-white">
              {currentUser?.namaUnit || "EcoBank Unit"}
            </div>
            <div className="text-[11px] text-[#7a7a7a] -mt-0.5">Admin Portal</div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[14px] font-semibold transition-colors ${
                  isActive
                    ? "bg-[#272729] text-white"
                    : "text-[#cccccc] hover:bg-[#1d1d1f] hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#2997ff]" : "text-[#7a7a7a]"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User profile & Logout */}
        <div className="p-4 border-t border-[#272729] bg-[#000000]">
          <div className="flex items-center justify-between">
            <div className="truncate pr-2">
              <div className="text-[13px] font-semibold text-white truncate">
                {currentUser?.namaPengelola || currentUser?.username || "Admin"}
              </div>
              <div className="text-[11px] text-[#7a7a7a] truncate">Pengelola Unit</div>
            </div>
            {handleLogout && (
              <button
                type="button"
                onClick={handleLogout}
                title="Keluar"
                className="p-2 rounded-[8px] hover:bg-[#272729] text-[#cccccc] hover:text-white transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Mobile / Tablet Header */}
        <header className="lg:hidden sticky top-0 z-30 w-full h-[48px] bg-[#000000] text-white flex items-center justify-between px-4 border-b border-[#272729]">
          <div className="flex items-center gap-2">
            <IconRecycle className="w-5 h-5 text-[#2997ff]" />
            <span className="text-[14px] font-semibold">{currentUser?.namaUnit || "EcoBank Unit"}</span>
          </div>
          {handleLogout && (
            <button
              type="button"
              onClick={handleLogout}
              className="text-[#cccccc] hover:text-white text-[12px] flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          )}
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-8">
          {children}
        </main>

        {/* Mobile Bottom Bar */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#ffffff] border-t border-[#e0e0e0] flex items-center justify-around h-[64px] px-2 shadow-sm">
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
    </div>
  );
}
