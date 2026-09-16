import { CheckCircle2, ChevronRight, Coffee, FileCheck, History, Megaphone, SlidersHorizontal, Timer, Volume2, Plus } from "lucide-react";
import { KpiCard } from "@/components/KpiCard";
import { OverstayTable } from "@/components/OverstayTable";
import { LiveTimersTable } from "@/components/LiveTimersTable";
import { useBreakSessions } from "@/lib/useBreakSessions";
import { useState } from "react";
import { Timestamp } from "firebase/firestore";

export function BreakTrackerView() {
  const { sessions, addSession, forceResolveSession, completeSession } = useBreakSessions();
  
  const activeSessions = sessions.filter(s => s.status === 'Active');
  const nowMs = Date.now();
  
  const overstays = activeSessions.filter(s => {
    const elapsedMinutes = (nowMs - s.timeOut.toMillis()) / 60000;
    return elapsedMinutes > s.limitMinutes;
  });

  const handleTestCreate = () => {
    addSession({
      name: "Budi Santoso",
      badgeId: "BS-123",
      initials: "BS",
      gate: "Pintu Utama",
      zone: "Inbound",
      sessionType: "Makan Siang",
      timeOut: Timestamp.fromDate(new Date(Date.now() - 40 * 60000)), // 40 minutes ago
      limitMinutes: 60,
      supervisor: "Andi R.",
      extension: "Ext 101"
    });
  };

  const handleTestCreateOverstay = () => {
    addSession({
      name: "Joko Anwar",
      badgeId: "JA-404",
      initials: "JA",
      gate: "Pintu Barat",
      zone: "Outbound",
      sessionType: "Makan Siang",
      timeOut: Timestamp.fromDate(new Date(Date.now() - 75 * 60000)), // 75 minutes ago
      limitMinutes: 60,
      supervisor: "Bambang P.",
      extension: "Ext 202"
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Subheader & Action Bar */}
      <section className="w-full bg-white rounded p-3 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3 border border-slate-200">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
            <span className="hover:underline cursor-pointer">Operasional Gudang</span>
            <ChevronRight size={14} />
            <span className="text-[#1d2b3e] font-semibold">Pemantau Istirahat</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[16px] text-[#1d2b3e] font-bold">Pelacak Jam Istirahat & Alert Overstay</h1>
            <div className="flex items-center gap-1.5 bg-slate-50 text-slate-800 px-2.5 py-1 rounded border border-slate-200 text-[11px]">
              <FileCheck size={14} className="text-[#1d2b3e]" />
              <span className="font-semibold">Aturan Shift Aktif: <span className="font-normal text-slate-500">SOP Gudang A (Istirahat Siang: 60 Mnt, Toleransi +5m)</span></span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handleTestCreate} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded border border-green-200 text-[11px] font-semibold transition-colors shadow-sm">
            <Plus size={14} />
            <span>Simulasi Normal</span>
          </button>
          <button onClick={handleTestCreateOverstay} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded border border-red-200 text-[11px] font-semibold transition-colors shadow-sm">
            <Plus size={14} />
            <span>Simulasi Overstay</span>
          </button>
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-[#1d2b3e] rounded border border-slate-200 text-[11px] font-semibold transition-colors shadow-sm">
            <History size={14} />
            <span>History Break (Ops ID)</span>
          </button>
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded border border-slate-200 text-[11px] font-semibold transition-colors shadow-sm">
            <Volume2 size={14} />
            <span>Buzzer Gate Test</span>
          </button>
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-600 text-white hover:bg-red-700 rounded text-[11px] font-semibold shadow-sm transition-colors">
            <Megaphone size={14} />
            <span>Paging Darurat HT (CH 11/12)</span>
          </button>
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1d2b3e] text-white hover:bg-slate-800 rounded shadow-sm transition-colors text-[11px] font-semibold">
            <SlidersHorizontal size={14} />
            <span>Konfigurasi Batas Waktu</span>
          </button>
        </div>
      </section>

      {/* KPI Metric Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
        <KpiCard 
          title="Pekerja Di Luar"
          icon={<Coffee size={18} />}
          value={activeSessions.length.toString()}
          subtitle="/ 84 Personil"
          detailText={`${Math.round((activeSessions.length / 84) * 100)}% Kapasitas Rehat Aktif`}
          detailLabel=""
          indicatorColor="bg-slate-400"
        />
        <KpiCard 
          title="Melebihi Waktu / Overdue"
          icon={
            <div className="w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center">
              <span className="font-bold text-[12px]">!</span>
            </div>
          }
          value={overstays.length.toString()}
          subtitle=">60 mnt (Kritis)"
          detailText="Perlu eskalasi mandor"
          detailLabel=""
          variant={overstays.length > 0 ? "error" : "default"}
        />
        <KpiCard 
          title="Kembali Tepat Waktu"
          icon={<CheckCircle2 size={18} />}
          value="68"
          subtitle="Selesai Rehat"
          detailLabel="94.4%"
          detailText="Tingkat Kepatuhan Shift"
          indicatorWidth="94.4%"
        />
        <KpiCard 
          title="Rata-Rata Durasi"
          icon={<Timer size={18} />}
          value="48"
          subtitle="Menit"
          detailLabel="-12 Mnt"
          detailText="vs batas standar 60m"
          indicatorWidth="100%"
        />
      </section>

      {/* Overstay Priority Alert Section */}
      <OverstayTable sessions={overstays} onResolve={forceResolveSession} />

      {/* Live Timers Monitoring Section */}
      <LiveTimersTable sessions={activeSessions} onComplete={completeSession} />
    </div>
  );
}
