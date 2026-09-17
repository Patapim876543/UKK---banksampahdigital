import React from "react";
import { AlertCircle, CheckCircle2, Clock, X } from "@/components/icons";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "warning" | "danger" | "neutral" | "primary";
  title?: string;
  onClose?: () => void;
}

export function Alert({
  variant = "primary",
  title,
  children,
  onClose,
  className = "",
  ...props
}: AlertProps) {
  const variantStyles = {
    success: "bg-[#eaf5ee] border-l-4 border-[#1F7A4D] text-[#1d1d1f]",
    warning: "bg-[#fef7e9] border-l-4 border-[#B45309] text-[#1d1d1f]",
    danger: "bg-[#fdf2f2] border-l-4 border-[#D92D20] text-[#1d1d1f]",
    neutral: "bg-[#f5f5f7] border-l-4 border-[#7a7a7a] text-[#1d1d1f]",
    primary: "bg-[#e6f0fa] border-l-4 border-[#0066cc] text-[#1d1d1f]",
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#1F7A4D] shrink-0" />,
    warning: <Clock className="w-5 h-5 text-[#B45309] shrink-0" />,
    danger: <AlertCircle className="w-5 h-5 text-[#D92D20] shrink-0" />,
    neutral: <AlertCircle className="w-5 h-5 text-[#7a7a7a] shrink-0" />,
    primary: <AlertCircle className="w-5 h-5 text-[#0066cc] shrink-0" />,
  };

  return (
    <div
      className={`rounded-[8px] p-4 flex items-start justify-between gap-3 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      <div className="flex items-start gap-3">
        {icons[variant]}
        <div className="text-[14px] leading-relaxed">
          {title && <div className="font-semibold text-[#1d1d1f] mb-0.5">{title}</div>}
          <div className="text-[#1d1d1f]">{children}</div>
        </div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-[#7a7a7a] hover:text-[#1d1d1f] p-1 rounded transition-colors btn-apple-press"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
