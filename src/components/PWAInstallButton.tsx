import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { usePWAInstall } from '@/lib/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-2 rounded bg-[#1d2b3e] px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
      >
        <Download size={14} />
        Install App / Desktop
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-2 rounded bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 border border-slate-300 shadow-sm hover:bg-slate-50 transition-colors"
        >
          <Download size={14} />
          Install on iOS
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1c30]/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded bg-white p-6 shadow-xl border border-slate-200">
              <h3 className="text-[14px] font-bold text-slate-900">Install on iPhone / iPad</h3>
              <p className="mt-2 text-[12px] text-slate-600">
                1. Tap the <strong>Share</strong> button in Safari toolbar.<br />
                2. Scroll down and tap <strong>Add to Home Screen</strong>.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded bg-slate-100 py-2 text-[12px] font-semibold text-slate-800 hover:bg-slate-200"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
