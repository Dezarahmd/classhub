import DashboardLayout from "../layouts/DashboardLayout";
import DashboardSummary from "../components/DashboardSummary";
import { useMembership } from "../contexts/MembershipContext";
import { canManageTasks } from "../utils/permissions";


export default function Dashboard() {
  const membership = useMembership();
  const canManage = canManageTasks(membership?.role)

  return (
    <DashboardLayout>
      <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-slate-500">Selamat datang kembali,</p>

          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-bold text-slate-900">
              Dashboard Kelas 👋
            </h2>
            {membership?.role && (
              <span className="rounded-full border border-emerald-500 bg-emerald-100 px-3 py-0.5 text-xs font-medium capitalize text-emerald-800">
                Role: {membership.role}
              </span>
            )}
          </div>

          <p className="mt-2 text-slate-500">
            Pantau aktivitas dan tugas kelasmu di satu tempat.
          </p>
        </div>

        {canManage && (
          <button
            type="button"
            className="w-fit rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-600 cursor-pointer"
          >
            + Tambah Tugas
          </button>
        )}
      </header>
      <DashboardSummary />
    </DashboardLayout>
  );
}
