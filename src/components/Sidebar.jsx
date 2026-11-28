
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

const navigationBaseClass =
  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-sidebar-accent focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar";

function getNavigationClass({ isActive }) {
  return `${navigationBaseClass} relative pr-7 ${
    isActive
      ? "bg-sidebar-active text-sidebar-accent after:absolute after:right-2 after:top-1/2 after:h-5 after:w-0.75 after:-translate-y-1/2 after:rounded-full after:bg-sidebar-accent after:content-['']"
      : "text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-foreground"
  }`;
}

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
    <aside className="flex min-h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar p-5">
      {/* Brand */}
      <div className="mb-10 flex items-center gap-3">
        <div
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-foreground font-bold text-sidebar"
        >
          C
        </div>

        <div>
          <p className="text-lg font-bold text-sidebar-foreground">
            ClassHub
          </p>
          <p className="text-xs text-sidebar-muted">
            Class Management
          </p>
        </div>
      </div>

      <span className="mb-3 text-xs font-semibold uppercase tracking-wider text-sidebar-muted">
        Menu Utama
      </span>

      {/* Main Navigation */}
      <nav aria-label="Navigasi utama" className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === "/"}
              className={getNavigationClass}
            >
              <Icon size={19} aria-hidden="true" />
              {item.label}
            </NavLink>
          );
        })}

        {canManage && (
          <div className="mt-6 space-y-2">
            <p className="px-4 text-xs font-semibold uppercase tracking-wider text-sidebar-muted">
              Administrasi Kelas
            </p>

            <NavLink
              to="/members"
              className={getNavigationClass}
            >
              <Users size={19} aria-hidden="true" />
              Kelola Anggota
            </NavLink>
          </div>
        )}
      </nav>

      {/* Account Navigation */}
      <nav aria-label="Navigasi akun">
        <NavLink
          to="/settings"
          className={getNavigationClass}
        >
          <Settings size={19} aria-hidden="true" />
          Pengaturan
        </NavLink>

        <button
          type="button"
          onClick={handleLogout}
          className={`${navigationBaseClass} w-full cursor-pointer text-sidebar-muted hover:bg-sidebar-danger-light hover:text-sidebar-danger`}
        >
          <LogOut size={19} aria-hidden="true" />
          Keluar
        </button>
      </nav>
    </aside>
  );
}
