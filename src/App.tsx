/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { BreakTrackerView } from "./views/BreakTrackerView";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import { LogIn } from "lucide-react";

function AppContent() {
  const { user, loading, login } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-[#f8fafd]">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8fafd]">
        <div className="bg-white p-8 rounded shadow text-center flex flex-col gap-4 border border-slate-200">
          <h1 className="text-xl font-bold text-slate-900">Industrial OS Login</h1>
          <p className="text-sm text-slate-500">Please sign in to access the Break Tracker dashboard.</p>
          <button 
            onClick={login}
            className="flex items-center justify-center gap-2 bg-[#1d2b3e] text-white px-4 py-2 rounded font-semibold hover:bg-slate-800 transition-colors"
          >
            <LogIn size={18} />
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafd]">
      <Sidebar />
      <div className="flex-1 flex flex-col pl-64">
        <Header />
        <main className="flex-1 overflow-y-auto pt-14 px-5 py-4">
          <div className="w-full max-w-[1680px] mx-auto">
            <BreakTrackerView />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

