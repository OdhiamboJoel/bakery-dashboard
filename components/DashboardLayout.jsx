"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { LogOut, Home, Users, BarChart3, Package } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function DashboardLayout({ role = "worker", children }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const menu =
    role === "admin"
      ? [
          { name: "Overview", icon: Home, path: "/dashboard/admin" },
          { name: "Workers", icon: Users, path: "/dashboard/admin/workers" },
          { name: "Analytics", icon: BarChart3, path: "/dashboard/admin/analytics" },
        ]
      : [
          { name: "Dashboard", icon: Home, path: "/dashboard/worker" },
          { name: "Production", icon: Package, path: "/dashboard/worker/production" },
        ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#f7f1e3] via-[#fdf6e3] to-[#f3e8d3] text-gray-800">
      {/* Sidebar */}
      <aside
        className={`bg-white/70 backdrop-blur-xl border-r border-white/40 shadow-2xl transition-all duration-300 flex flex-col relative
        ${open ? "w-64" : "w-20"}`}
      >
        {/* Brand */}
        <div className="p-4 font-bold text-lg border-b border-white/30 flex items-center justify-between">
          {open ? (
            <span className="tracking-wide">🧁 BakeryOps</span>
          ) : (
            <span className="text-xl">🧁</span>
          )}

          <button
            onClick={() => setOpen(!open)}
            className="text-xs px-2 py-1 rounded bg-white/60 hover:bg-white transition"
          >
            {open ? "←" : "→"}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-3 space-y-2">
          {menu.map((item, i) => {
            const active = pathname === item.path;

            return (
              <a
                key={i}
                href={item.path}
                className={`flex items-center gap-3 p-2 rounded-xl transition-all duration-200
                hover:scale-[1.02]
                ${active
                    ? "bg-[#f3e8d3] shadow-md font-semibold"
                    : "hover:bg-white/60"}`}
              >
                <item.icon size={18} className="opacity-80" />
                {open && <span className="text-sm">{item.name}</span>}
              </a>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/30">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full p-2 rounded-xl bg-red-100/70 hover:bg-red-200 transition-all duration-200 hover:scale-[1.02]"
          >
            <LogOut size={18} />
            {open && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            {role === "admin" ? "Admin Dashboard" : "Worker Dashboard"}
          </h1>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-gray-600">Live</span>
          </div>
        </div>

        {/* Content Card Wrapper */}
        <div className="bg-white/60 backdrop-blur-lg border border-white/40 rounded-2xl shadow-xl p-6 min-h-[70vh] transition-all">
          {children}
        </div>
      </main>
    </div>
  );
}