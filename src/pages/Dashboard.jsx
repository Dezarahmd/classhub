import DashboardSummary from "../components/DashboardSummary";
import { useMembership } from "../contexts/MembershipContext";
import { canManageTasks } from "../utils/permissions";

export default function Dashboard() {
  const membership = useMembership();
  const canManage = canManageTasks(membership?.role);

  return (
    <>
      <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-muted">Selamat datang kembali,</p>

          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-bold text-foreground">
              Dashboard Kelas 👋
            </h2>
            {membership?.role && (
              <span className="rounded-full border border-primary/30 bg-primary-light px-3 py-0.5 text-xs font-medium capitalize text-primary-hover">
                Role: {membership.role}
              </span>
            )}
          </div>

          <p className="mt-2 text-muted">
            Pantau aktivitas dan tugas kelasmu di satu tempat.
          </p>
        </div>

        {canManage && (
          <button
            type="button"
            className="w-fit cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary shadow-sm transition-colors hover:bg-primary-hover"
          >
            + Tambah Tugas
          </button>
        )}
      </header>
      <DashboardSummary />
    </>
  );
}
