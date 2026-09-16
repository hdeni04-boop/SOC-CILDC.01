import React from 'react';
import { cn } from "@/lib/utils";
import { IdCard, Megaphone, DoorOpen, Settings, FileText, Timer, Warehouse } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white z-50 flex flex-col justify-between border-r border-slate-200 shadow-sm">
      <div className="flex flex-col">
        {/* Logo Area */}
        <div className="h-14 px-4 flex items-center gap-3 bg-white border-b border-slate-200">
          <div className="w-9 h-9 rounded bg-[#1d2b3e] flex items-center justify-center text-white font-bold shadow-sm">
            <Warehouse size={18} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] text-[#1d2b3e] font-bold tracking-tight uppercase">SOC CILEUNGSI</span>
            <span className="px-1.5 py-0.5 mt-0.5 bg-blue-50 text-blue-800 text-[9px] rounded font-bold uppercase tracking-wider w-fit">INDUSTRIAL OS V2.4</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-1 py-3 px-3 overflow-y-auto">
          <div className="pt-1 pb-1 px-2">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">OPERASIONAL REAL-TIME</span>
          </div>
          <nav className="flex flex-col gap-1">
            <NavItem icon={<DoorOpen size={18} />} label="Live Gate Monitor" />
            <NavItem icon={<Timer size={18} />} label="Pelacak Jam Istirahat" active />
            <NavItem icon={<Megaphone size={18} />} label="Siaran HT & Paging" />
          </nav>

          <div className="pt-3 pb-1 px-2 border-t border-slate-100 mt-2">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">DATA & ANALITIK</span>
          </div>
          <nav className="flex flex-col gap-1">
            <NavItem icon={<IdCard size={18} />} label="Daftar Pekerja & Presensi" />
            <NavItem icon={<FileText size={18} />} label="Laporan & Ekspor Shift" />
          </nav>

          <div className="pt-3 pb-1 px-2 border-t border-slate-100 mt-2">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">SISTEM & PERANGKAT</span>
          </div>
          <nav className="flex flex-col gap-1">
            <NavItem icon={<Settings size={18} />} label="Pengaturan Sistem" />
          </nav>
        </div>
      </div>

      {/* Hardware Node Status */}
      <div className="p-3 m-3 bg-slate-50 rounded border border-slate-200 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-500 uppercase font-bold">HARDWARE NODE</span>
          <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#1d2b3e] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#1d2b3e] animate-pulse"></span>
            Online (12ms)
          </span>
        </div>
        <div className="text-[11px] text-slate-800 flex flex-col gap-1">
          <span className="font-mono text-[10px]">Ops ID: <span className="font-semibold text-[#1d2b3e]">COM3/COM4</span></span>
          <span className="font-mono text-[10px] text-slate-500">Audio TX: <span className="font-semibold text-[#1d2b3e]">COM5 (CH 11/12)</span></span>
        </div>
        <div className="font-mono text-slate-400 text-[9px] pt-1.5 border-t border-slate-200">
          Gate Sync OK · Paging Ready
        </div>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <a
      href="#"
      className={cn(
        "flex items-center gap-2.5 px-3 py-2 rounded transition-colors text-[12px]",
        active
          ? "bg-[#334155] text-white font-semibold shadow-sm"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}
