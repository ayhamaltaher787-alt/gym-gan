import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import { useProgramsStore } from "../store/programsStore";

export function RootLayout() {
  const loadedOnce = useProgramsStore((s) => s.loadedOnce);
  const loading = useProgramsStore((s) => s.loading);
  const refresh = useProgramsStore((s) => s.refresh);

  useEffect(() => {
    if (!loadedOnce && !loading) refresh();
  }, [loadedOnce, loading, refresh]);

  return (
    <div className="min-h-full flex flex-col">
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-white/5 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-xs text-ink-400 flex flex-wrap items-center justify-between gap-2">
          <div>© Projektwoche Gymnasium Ganderkesee · Projekt „Programmieren"</div>
          <div className="opacity-70">GYM GAN v1.0 · Cloud-Sync via Supabase</div>
        </div>
      </footer>
    </div>
  );
}
