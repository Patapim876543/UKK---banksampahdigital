import React from "react";
import { Button } from "./button";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 ${className}`}>
      {icon && (
        <div className="w-16 h-16 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#7a7a7a] mb-4">
          {icon}
        </div>
      )}
      <h4 className="text-[17px] font-semibold text-[#1d1d1f] tracking-[-0.374px] mb-1">
        {title}
      </h4>
      {description && (
        <p className="text-[14px] text-[#7a7a7a] tracking-[-0.224px] max-w-sm mb-6">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
