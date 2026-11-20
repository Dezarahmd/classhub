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

import { useNavigate, NavLink } from "react-router";
import { supabase } from "../lib/supabase";
import { useMembership } from "../contexts/MembershipContext";
import { canManageMembers } from "../utils/permissions";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Tugas", icon: ClipboardList, path: "/tasks" },
  { label: "Jadwal", icon: CalendarDays, path: "/schedule" },
  { label: "Materi", icon: BookOpen, path: "/materials" },
  { label: "Kelompok", icon: Users, path: "/groups" },
  { label: "Pengumuman", icon: Bell, path: "/announcements" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const membership = useMembership();
  const canManage = canManageMembers(membership?.role);

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

      <span className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Menu Utama
      </span>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`
              }
            >
              <Icon size={19} />
              {item.label}
            </NavLink>
          );
        })}
        {canManage && (
          <div className="mt-6 space-y-2">
            <p className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Administrasi Kelas
            </p>

            <NavLink
              to="/members"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`
              }
            >
              <Users size={19} />
              Kelola Anggota
            </NavLink>
          </div>
        )}
      </nav>

      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
            isActive
              ? "bg-blue-50 text-blue-700"
              : "text-slate-600 hover:bg-slate-50"
          }`
        }
      >
        <Settings size={19} />
        Pengaturan
      </NavLink>
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
