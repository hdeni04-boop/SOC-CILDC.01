import { BellRing, Megaphone, FileEdit, History, ShieldAlert } from "lucide-react";
import { BreakSession } from "@/lib/useBreakSessions";
import { useState, useEffect } from "react";
import { ForceResolveModal } from "./ForceResolveModal";

interface OverstayTableProps {
  sessions: BreakSession[];
  onResolve: (id: string, reason: string, note: string) => void;
}

export function OverstayTable({ sessions, onResolve }: OverstayTableProps) {
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<BreakSession | null>(null);
  const [nowMs, setNowMs] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOpenResolve = (worker: BreakSession) => {
    setSelectedWorker(worker);
    setResolveModalOpen(true);
  };

  const handleResolve = (reason: string, note: string) => {
    if (selectedWorker) {
      onResolve(selectedWorker.id, reason, note);
    }
  };

  return (
    <section className="w-full bg-white rounded shadow-sm overflow-hidden flex flex-col border border-slate-200">
      {/* Header */}
      <div className="bg-red-50/50 px-3.5 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-red-100">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 bg-red-600 text-white rounded flex items-center justify-center shadow-sm">
            <BellRing size={14} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-red-700 font-bold text-[13px]">Daftar Overstay Prioritas (Batas Waktu Terlampaui)</h2>
              <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] rounded font-bold">{sessions.length} Terdeteksi</span>
            </div>
            <p className="font-mono text-slate-600 text-[10px] leading-tight mt-0.5">Toleransi {sessions[0]?.limitMinutes + 5 || 65}m habis ({sessions[0]?.limitMinutes || 60}m + 5m grace). Tindakan pengawas diwajibkan.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-2.5 py-1 bg-red-600 text-white hover:bg-red-700 font-semibold rounded transition-colors flex items-center gap-1.5 text-[11px] shadow-sm">
            <Megaphone size={14} />
            <span>Paging Semua Overstay ke HT</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-[11px]">
          <thead>
            <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <th className="py-2 px-3 font-semibold">Pekerja & ID Badge</th>
              <th className="py-2 px-3 font-semibold">Gate / Kategori</th>
              <th className="py-2 px-3 font-semibold">Jam Keluar</th>
              <th className="py-2 px-3 font-semibold">Durasi Berjalan</th>
              <th className="py-2 px-3 font-semibold">Selisih Terlambat</th>
              <th className="py-2 px-3 font-semibold">Pengawas / PIC</th>
              <th className="py-2 px-3 font-semibold text-right">Tindakan Cepat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sessions.map((record) => {
              const outMs = record.timeOut.toMillis();
              const durationSeconds = Math.floor((nowMs - outMs) / 1000);
              const overstaySeconds = durationSeconds - (record.limitMinutes * 60);
              
              const h = Math.floor(durationSeconds / 3600);
              const m = Math.floor((durationSeconds % 3600) / 60);
              const s = durationSeconds % 60;
              const formattedDuration = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

              const oh = Math.floor(overstaySeconds / 3600);
              const om = Math.floor((overstaySeconds % 3600) / 60);
              const os = overstaySeconds % 60;
              let overstayText = `+${om}m ${os}s`;
              if (oh > 0) overstayText = `+${oh}h ${om}m ${os}s`;

              return (
                <tr key={record.id} className="hover:bg-red-50/30 transition-colors">
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                        {record.initials}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-[12px] leading-tight">{record.name}</div>
                        <div className="font-mono text-slate-500 text-[10px] mt-0.5">Ops ID: {record.badgeId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] border border-slate-200">
                      {record.gate}
                    </span>
                  </td>
                  <td className="py-2 px-3 font-mono text-slate-900 text-[11px]">{record.timeOut.toDate().toLocaleTimeString('id-ID')}</td>
                  <td className="py-2 px-3">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-600 text-white font-mono font-bold text-[11px] shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                      <span>{formattedDuration}</span>
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <span className="font-mono font-bold text-red-600 text-[12px]">{overstayText}</span>
                  </td>
                  <td className="py-2 px-3">
                    <div className="text-slate-900 font-semibold text-[11px] leading-tight">{record.supervisor}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{record.extension}</div>
                  </td>
                  <td className="py-2 px-3 text-right">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      <button className="h-6 px-2 bg-white hover:bg-slate-50 text-[#1d2b3e] font-semibold text-[10px] rounded border border-slate-200 transition-colors flex items-center gap-1">
                        <History size={12} />
                        <span>Detail</span>
                      </button>
                      <button className="h-6 px-2 bg-red-600 text-white hover:bg-red-700 font-semibold text-[10px] rounded transition-colors flex items-center gap-1 shadow-sm">
                        <Megaphone size={12} />
                        <span>Paging HT</span>
                      </button>
                      <button className="h-6 px-2 bg-[#1d2b3e] text-white hover:bg-slate-800 font-semibold text-[10px] rounded transition-colors flex items-center gap-1 shadow-sm">
                        <FileEdit size={12} />
                        <span>Catat</span>
                      </button>
                      <button 
                        onClick={() => handleOpenResolve(record)}
                        className="h-6 px-2 bg-slate-600 text-white hover:bg-[#1d2b3e] font-semibold text-[10px] rounded transition-colors flex items-center gap-1 shadow-sm"
                      >
                        <ShieldAlert size={12} />
                        <span>Force Resolve</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedWorker && (
        <ForceResolveModal 
          isOpen={resolveModalOpen} 
          onClose={() => setResolveModalOpen(false)} 
          workerName={selectedWorker.name}
          badgeId={selectedWorker.badgeId}
          timeOut={selectedWorker.timeOut.toDate().toLocaleTimeString('id-ID')}
          onConfirm={handleResolve}
        />
      )}
    </section>
  );
}
