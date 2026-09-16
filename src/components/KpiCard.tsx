import React from 'react';
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  icon: React.ReactNode;
  value: string;
  subtitle: string;
  detailText: string;
  detailLabel: string;
  variant?: "default" | "error";
  indicatorWidth?: string;
  indicatorColor?: string;
}

export function KpiCard({
  title,
  icon,
  value,
  subtitle,
  detailText,
  detailLabel,
  variant = "default",
  indicatorWidth,
  indicatorColor = "bg-[#1d2b3e]"
}: KpiCardProps) {
  const isError = variant === "error";

  return (
    <div className={cn(
      "p-3 rounded shadow-sm flex flex-col justify-between border",
      isError 
        ? "bg-red-50/50 border-red-200/50 text-red-900" 
        : "bg-white border-slate-200"
    )}>
      <div className="flex items-center justify-between text-slate-500">
        <span className={cn(
          "text-[10px] uppercase tracking-wider font-bold",
          isError ? "text-red-700" : ""
        )}>{title}</span>
        <div className={cn(isError ? "text-red-600 animate-bounce" : "text-[#1d2b3e]")}>
          {icon}
        </div>
      </div>
      
      <div className="flex items-baseline gap-1.5 my-1">
        <span className={cn(
          "text-[24px] leading-none font-bold",
          isError ? "text-red-600 font-extrabold" : "text-[#1d2b3e]"
        )}>{value}</span>
        <span className={cn(
          "text-[12px] font-mono",
          isError ? "text-red-600 font-semibold" : "text-slate-500"
        )}>{subtitle}</span>
      </div>

      <div className={cn(
        "flex items-center gap-1.5 font-mono text-[10px] pt-1 border-t",
        isError ? "text-red-700 font-semibold border-red-200" : "text-slate-500 border-slate-100"
      )}>
        {indicatorWidth ? (
          <>
            <span className="font-semibold text-[#1d2b3e]">{detailLabel}</span>
            <span>{detailText}</span>
          </>
        ) : (
          <>
            <span className={cn("w-2 h-2 rounded", indicatorColor)}></span>
            <span>{detailText}</span>
          </>
        )}
      </div>
    </div>
  );
}
