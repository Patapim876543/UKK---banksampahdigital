"use client";

import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-[14px] font-semibold text-[#1d1d1f] tracking-[-0.224px]">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full bg-[#ffffff] text-[#1d1d1f] text-[17px] leading-[1.47] tracking-[-0.374px] px-4 py-3 rounded-[8px] border transition-colors outline-none placeholder:text-[#7a7a7a] ${
            error
              ? "border-[#D92D20] focus:ring-2 focus:ring-[#D92D20]"
              : "border-[#e0e0e0] focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]"
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-[14px] text-[#D92D20] tracking-[-0.224px]">{error}</p>
        ) : helperText ? (
          <p className="text-[14px] text-[#7a7a7a] tracking-[-0.224px]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = "", id, rows = 3, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-[14px] font-semibold text-[#1d1d1f] tracking-[-0.224px]">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={`w-full bg-[#ffffff] text-[#1d1d1f] text-[17px] leading-[1.47] tracking-[-0.374px] px-4 py-3 rounded-[8px] border transition-colors outline-none placeholder:text-[#7a7a7a] ${
            error
              ? "border-[#D92D20] focus:ring-2 focus:ring-[#D92D20]"
              : "border-[#e0e0e0] focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]"
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-[14px] text-[#D92D20] tracking-[-0.224px]">{error}</p>
        ) : helperText ? (
          <p className="text-[14px] text-[#7a7a7a] tracking-[-0.224px]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, className = "", id, children, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-[14px] font-semibold text-[#1d1d1f] tracking-[-0.224px]">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={`w-full bg-[#ffffff] text-[#1d1d1f] text-[17px] leading-[1.47] tracking-[-0.374px] px-4 py-3 rounded-[8px] border transition-colors outline-none ${
            error
              ? "border-[#D92D20] focus:ring-2 focus:ring-[#D92D20]"
              : "border-[#e0e0e0] focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]"
          } ${className}`}
          {...props}
        >
          {children}
        </select>
        {error ? (
          <p className="text-[14px] text-[#D92D20] tracking-[-0.224px]">{error}</p>
        ) : helperText ? (
          <p className="text-[14px] text-[#7a7a7a] tracking-[-0.224px]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
Select.displayName = "Select";
