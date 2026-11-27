
import { Plus } from "lucide-react";
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
          <p className="text-sm text-muted">
            Selamat datang kembali,
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">
              Dashboard Kelas
            </h1>

            {membership?.role && (
              <span className="rounded-full bg-accent-light px-3 py-1 text-xs font-medium capitalize text-accent-hover">
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
            className="inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-colors duration-200 motion-reduce:transition-none hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <Plus size={16} aria-hidden="true" />
            Tambah Tugas
          </button>
        )}
      </header>

      <DashboardSummary />
    </>
  );
}
