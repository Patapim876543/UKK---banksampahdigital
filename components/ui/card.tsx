import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "canvas" | "parchment" | "dark";
}

export function Card({
  children,
  variant = "canvas",
  className = "",
  ...props
}: CardProps) {
  const variantStyles = {
    canvas: "bg-[#ffffff] text-[#1d1d1f] border border-[#e0e0e0]",
    parchment: "bg-[#f5f5f7] text-[#1d1d1f] border border-[#e0e0e0]",
    dark: "bg-[#272729] text-white border border-[#333333]",
  };

  return (
    <div
      className={`rounded-[18px] p-6 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

export function StatCard({
  label,
  value,
  subtext,
  icon,
  badge,
  className = "",
}: StatCardProps) {
  return (
    <Card className={`flex flex-col justify-between ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-[14px] font-semibold text-[#7a7a7a] tracking-[-0.224px]">
          {label}
        </span>
        {icon && <div className="text-[#0066cc]">{icon}</div>}
      </div>
      <div>
        <div className="text-[34px] font-semibold text-[#1d1d1f] tracking-[-0.374px] leading-tight">
          {value}
        </div>
        {(subtext || badge) && (
          <div className="flex items-center gap-2 mt-2">
            {badge}
            {subtext && (
              <span className="text-[14px] text-[#7a7a7a] tracking-[-0.224px]">
                {subtext}
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
