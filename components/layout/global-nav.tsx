"use client";

import React from "react";
import Link from "next/link";
import { IconRecycle } from "@/components/icons";

export function GlobalNav({ rightAction }: { rightAction?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-40 w-full h-[44px] bg-[#000000] text-white flex items-center px-4 sm:px-8 border-b border-[#272729]">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
          <IconRecycle className="w-5 h-5 text-[#2997ff]" />
          <span className="text-[14px] font-semibold tracking-[-0.224px]">EcoBank Digital</span>
        </Link>
        <div className="flex items-center gap-4 text-[12px] text-[#cccccc]">
          {rightAction}
        </div>
      </div>
    </header>
  );
}
