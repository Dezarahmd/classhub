import {
  LayoutDashboard,
  ClipboardList,
  CalendarDays,
  BookOpen,
  Users,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";

import { replace, useNavigate } from "react-router";
import { supabase } from "../lib/supabase";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Tugas", icon: ClipboardList },
  { label: "Jadwal", icon: CalendarDays },
  { label: "Materi", icon: BookOpen },
  { label: "Kelompok", icon: Users },
  { label: "Pengumuman", icon: Bell },
];

export default function Sidebar() {
  const navigate = useNavigate();

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Gagal logout:", error);
      alert("Gagal logout. Silahkan coba lagi.");
      return;
    }

    navigate("/login", { replace: true });
  }

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-slate-200 bg-white p-5">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
          C
        </div>

        <div>
          <h1 className="text-lg font-bold text-slate-900">ClassHub</h1>
          <p className="text-xs text-slate-500">Class Management</p>
        </div>
      </div>

      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Menu Utama
      </p>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <a
              key={item.label}
              href="#"
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                item.active
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon size={19} />
              {item.label}
            </a>
          );
        })}
      </nav>

      <button className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-50">
        <Settings size={19} />
        Pengaturan
      </button>
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-600 transition hover:bg-red-50"
      >
        <LogOut size={19} />
        Keluar
      </button>
    </aside>
  );
}
