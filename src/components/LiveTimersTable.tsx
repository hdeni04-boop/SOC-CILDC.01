import { Search, Timer } from "lucide-react";
import { BreakSession } from "@/lib/useBreakSessions";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface LiveTimersTableProps {
  sessions: BreakSession[];
  onComplete: (id: string) => void;
}

export function LiveTimersTable({ sessions, onComplete }: LiveTimersTableProps) {
  const [nowMs, setNowMs] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full bg-white rounded shadow-sm flex flex-col border border-slate-200">
      {/* Header Toolbar */}
      <div className="px-3.5 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-2.5 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Timer size={18} className="text-[#1d2b3e]" />
          <div>
            <h3 className="font-semibold text-slate-900 text-[13px]">Monitor Istirahat Berjalan (Live Timers)</h3>
            <p className="font-mono text-slate-500 text-[10px] leading-tight">{sessions.length} pekerja saat ini berada dalam koridor waktu legal istirahat</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-2 top-1.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari nama / ID badge..." 
              className="pl-7 pr-2.5 py-1 bg-white text-slate-900 border border-slate-300 rounded focus:outline-none focus:border-[#1d2b3e] h-7 w-48 text-[11px]"
            />
          </div>
          <select className="bg-white text-slate-900 border border-slate-300 rounded px-2.5 h-7 text-[11px] focus:outline-none">
            <option value="ALL">Semua Zona</option>
            <option value="Inbound">Inbound</option>
            <option value="Outbound">Outbound</option>
          </select>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded border border-slate-200 font-mono text-[10px] text-[#1d2b3e]">
            <span className="w-2 h-2 rounded-full bg-[#1d2b3e] animate-pulse"></span>
            <span>Realtime Ops ID Stream</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-[11px]">
          <thead>
            <tr className="bg-white text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <th className="py-2 px-3 font-semibold">Pekerja & Divisi</th>
              <th className="py-2 px-3 font-semibold">Tipe Sesi</th>
              <th className="py-2 px-3 font-semibold">Jam Scan Keluar</th>
              <th className="py-2 px-3 font-semibold">Durasi / Limit</th>
              <th className="py-2 px-3 font-semibold min-w-[160px]">Beban Waktu (Limit %)</th>
              <th className="py-2 px-3 font-semibold">Status</th>
              <th className="py-2 px-3 font-semibold text-right">Aksi Gate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sessions.map((record) => {
              const outMs = record.timeOut.toMillis();
              const durationSeconds = Math.floor((nowMs - outMs) / 1000);
              const percent = Math.min(100, Math.round((durationSeconds / (record.limitMinutes * 60)) * 100));
              const isWarning = percent > 85;

              return (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-3">
                    <div className="font-semibold text-slate-900 text-[12px] leading-tight">{record.name}</div>
                    <div className="font-mono text-slate-500 text-[10px] mt-0.5">Badge: {record.badgeId} | Zone {record.zone}</div>
                  </td>
                  <td className="py-2 px-3">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] border",
                      isWarning ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-slate-100 text-slate-800 border-slate-200"
                    )}>
                      {record.sessionType}
                    </span>
                  </td>
                  <td className="py-2 px-3 font-mono text-slate-900 text-[11px]">{record.timeOut.toDate().toLocaleTimeString('id-ID')}</td>
                  <td className="py-2 px-3">
                    <span className={cn(
                      "font-mono font-semibold text-[11px]",
                      isWarning ? "text-amber-600" : "text-[#1d2b3e]"
                    )}>
                      {formatSeconds(durationSeconds)}
                    </span>
                    <span className="text-slate-500 ml-1 text-[10px]">/ {record.limitMinutes}m</span>
                  </td>
                  <td className="py-2 px-3">
                    <div className="w-full bg-slate-100 h-1.5 rounded overflow-hidden">
                      <div 
                        className={cn("h-full rounded", isWarning ? "bg-amber-500" : "bg-[#1d2b3e]", percent >= 100 && "bg-red-500")} 
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between font-mono text-[9px] text-slate-500 mt-1 leading-none">
                      <span className={isWarning ? "text-amber-700 font-semibold" : ""}>
                        Sisa: {Math.max(0, record.limitMinutes * 60 - durationSeconds)}s
                      </span>
                      <span className={isWarning ? "text-amber-700 font-bold" : ""}>{percent}%</span>
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border",
                      percent >= 100 ? "bg-red-100 text-red-800 border-red-300" :
                      isWarning ? "bg-amber-100 text-amber-800 border-amber-300" : "bg-slate-100 text-slate-700 border-slate-200"
                    )}>
                      {percent >= 100 ? 'Overstay' : isWarning ? 'Hampir Habis' : 'Aman'}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right">
                    <button 
                      onClick={() => onComplete(record.id)}
                      className="h-6 px-3 bg-[#1d2b3e] text-white hover:bg-slate-800 font-semibold text-[10px] rounded shadow-sm transition-colors"
                    >
                      Konfirmasi Kembali
                    </button>
                  </td>
                </tr>
              );
            })}
            {sessions.length === 0 && (
              <tr>
                <td colSpan={7} className="py-4 px-3 text-center text-slate-500 text-[11px]">
                  Tidak ada sesi istirahat yang sedang berjalan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Footer */}
      <div className="px-3.5 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 rounded-b">
        <div className="flex items-center gap-2">
          <span>Menampilkan total {sessions.length} aktif istirahat</span>
          <span className="inline-flex items-center gap-1 text-[10px]">
            <span className="w-2 h-2 rounded-full bg-[#1d2b3e]"></span> Terhubung gerbang turnstile
          </span>
        </div>
      </div>
    </section>
  );
}

function formatSeconds(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `00:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
