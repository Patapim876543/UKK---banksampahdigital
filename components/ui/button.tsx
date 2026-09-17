"use client";

import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary-pill" | "dark-utility" | "pearl-capsule" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-normal transition-all duration-150 focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer btn-apple-press";

    const variantStyles = {
      primary:
        "bg-[#0066cc] text-white hover:bg-[#0071e3] focus:ring-2 focus:ring-[#0071e3] focus:ring-offset-2 rounded-full",
      "secondary-pill":
        "bg-transparent text-[#0066cc] border border-[#0066cc] hover:bg-[#0066cc]/5 focus:ring-2 focus:ring-[#0071e3] rounded-full",
      "dark-utility":
        "bg-[#1d1d1f] text-white hover:bg-[#272729] rounded-[8px] text-[14px]",
      "pearl-capsule":
        "bg-[#fafafc] text-[#333333] border border-[#f0f0f0] hover:bg-[#f5f5f7] rounded-[11px] text-[14px]",
      danger:
        "bg-[#D92D20] text-white hover:bg-[#b82418] focus:ring-2 focus:ring-[#D92D20] focus:ring-offset-2 rounded-full",
      ghost:
        "bg-transparent text-[#0066cc] hover:bg-[#0066cc]/5 rounded-[8px]",
    };

    const sizeStyles = {
      sm: variant === "dark-utility" || variant === "pearl-capsule" ? "px-[14px] py-[6px]" : "px-4 py-2 text-[14px]",
      md:
        variant === "dark-utility" || variant === "pearl-capsule"
          ? "px-[15px] py-[8px]"
          : "px-[22px] py-[11px] text-[17px]",
      lg: "px-[28px] py-[14px] text-[18px]",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <span>Memuat...</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            {leftIcon && <span className="inline-flex">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex">{rightIcon}</span>}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
