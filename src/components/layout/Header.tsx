import { Clock, Scan, User, LogOut } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { PWAInstallButton } from "@/components/PWAInstallButton";

export function Header() {
  const { user, logout } = useAuth();
  
  return (
    <header className="fixed top-0 left-64 right-0 h-14 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] z-40 flex items-center justify-between px-5 border-b border-slate-200">
      <div className="flex items-center gap-3">
        {/* Live Clock Pill */}
        <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded border border-slate-200 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-[#1d2b3e] animate-ping"></span>
          <span className="font-mono text-[#1d2b3e] font-semibold">Live System</span>
        </div>

        {/* Scanner Status */}
        <div className="flex items-center gap-1.5 text-[11px] bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
          <Scan size={14} className="text-[#1d2b3e]" />
          <span className="font-semibold text-slate-800">Scanner Ops ID:</span>
          <span className="text-slate-500">Pintu 1 & 2 Aktif</span>
        </div>

        {/* Shift Info */}
        <div className="hidden xl:flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded border border-slate-200 text-[11px]">
          <Clock size={14} className="text-slate-500" />
          <span className="font-semibold text-slate-800">Shift Pagi:</span>
          <span className="font-mono text-slate-500">08:00 - 17:00</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <PWAInstallButton />
        <div className="flex items-center gap-3 border-r border-slate-200 pr-4">
          <div className="flex flex-col text-right leading-tight">
            <span className="font-semibold text-slate-900 text-[12px]">{user?.displayName || 'Authorized User'}</span>
            <span className="text-slate-500 text-[10px]">{user?.email}</span>
          </div>
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full shadow-sm object-cover border border-slate-200" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#1d2b3e] flex items-center justify-center shadow-sm text-white">
              <User size={18} />
            </div>
          )}
        </div>
        <button 
          onClick={logout}
          className="text-slate-500 hover:text-red-600 transition-colors"
          title="Sign out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
