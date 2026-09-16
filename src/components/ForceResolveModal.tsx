import { CheckCircle2, UserCheck, X } from "lucide-react";
import { useState } from "react";

interface ForceResolveModalProps {
  isOpen: boolean;
  onClose: () => void;
  workerName: string;
  badgeId: string;
  timeOut: string;
  onConfirm: (reason: string, note: string) => void;
}

export function ForceResolveModal({ isOpen, onClose, workerName, badgeId, timeOut, onConfirm }: ForceResolveModalProps) {
  const [manualTime, setManualTime] = useState("");
  const [reason, setReason] = useState("lupa_tap");
  const [note, setNote] = useState("");

  if (!isOpen) return null;

  const handleSetCurrentTime = () => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')} WIB`;
    setManualTime(timeStr);
  };

  const handleConfirm = () => {
    onConfirm(reason, note);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#0b1c30]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded shadow-xl w-full max-w-lg border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-slate-100 text-slate-700 flex items-center justify-center shadow-sm">
              <UserCheck size={18} />
            </div>
            <div>
              <h3 className="font-bold text-[14px] text-slate-900">Manual Check-in & Force Resolve</h3>
              <p className="font-mono text-[10px] text-slate-500 mt-0.5 leading-tight">Selesaikan status rehat pekerja yang tidak tercatat tap masuk</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4">
          
          {/* Worker Info Card */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded border border-slate-200">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500">Nama Pekerja & Badge</span>
              <span className="font-semibold text-[#1d2b3e] text-[12px] mt-0.5">{workerName}</span>
              <span className="font-mono text-[10px] text-slate-500 mt-0.5">Ops ID: {badgeId}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500">Waktu Tap Keluar</span>
              <span className="font-mono font-semibold text-red-600 text-[12px] mt-0.5">{timeOut}</span>
              <span className="font-mono text-[10px] text-slate-500 mt-0.5">SOP Limit: 60 Menit</span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Waktu Masuk Aktual / Manual</label>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={manualTime}
                  onChange={(e) => setManualTime(e.target.value)}
                  placeholder="HH:MM:SS WIB"
                  className="flex-1 px-3 py-1.5 bg-slate-50 text-slate-900 font-mono rounded border border-slate-300 focus:outline-none focus:border-[#1d2b3e] focus:ring-1 focus:ring-[#1d2b3e] text-[12px]" 
                />
                <button 
                  onClick={handleSetCurrentTime}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 text-[#1d2b3e] font-semibold text-[11px] rounded border border-slate-300 transition-colors"
                >
                  Gunakan Jam Sekarang
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Alasan Force Resolve</label>
              <select 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 text-slate-900 rounded border border-slate-300 focus:outline-none text-[12px]"
              >
                <option value="lupa_tap">Lupa Tap Kartu Masuk (Human Error)</option>
                <option value="tailgating">Masuk Bersama Rekan (Tailgating Turnstile)</option>
                <option value="scanner_miss">Scanner RFID Miss / Gerbang Offline</option>
                <option value="izin_spv">Izin Khusus Supervisor Lapangan</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Catatan Mandor / PIC Pengawas</label>
              <textarea 
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Pekerja sudah berada di station sejak 12:20 WIB, diverifikasi oleh PIC..."
                className="px-3 py-1.5 bg-slate-50 text-slate-900 rounded border border-slate-300 focus:outline-none focus:border-[#1d2b3e] focus:ring-1 focus:ring-[#1d2b3e] text-[12px] resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
            <UserCheck size={14} className="text-[#1d2b3e]" />
            <span>Otoritas: Admin Gudang A</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={onClose}
              className="px-4 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded text-[11px] border border-slate-300 transition-colors"
            >
              Batal
            </button>
            <button 
              onClick={handleConfirm}
              className="px-4 py-1.5 bg-[#1d2b3e] hover:bg-slate-800 text-white font-semibold rounded text-[11px] shadow-sm transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 size={14} />
              <span>Konfirmasi Selesaikan Sesi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
