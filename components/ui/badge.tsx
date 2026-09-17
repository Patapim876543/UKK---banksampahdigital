import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "danger" | "neutral" | "primary";
}

export function Badge({
  children,
  variant = "neutral",
  className = "",
  ...props
}: BadgeProps) {
  const variantStyles = {
    success: "bg-[#eaf5ee] text-[#1F7A4D]",
    warning: "bg-[#fef7e9] text-[#B45309]",
    danger: "bg-[#fdf2f2] text-[#D92D20]",
    neutral: "bg-[#f5f5f7] text-[#7a7a7a]",
    primary: "bg-[#e6f0fa] text-[#0066cc]",
  };

  return (
    <span
      className={`inline-flex items-center justify-center font-semibold text-[14px] leading-[1.29] tracking-[-0.224px] px-3 py-1.5 rounded-full ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
