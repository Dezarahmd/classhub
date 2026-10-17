
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardSummary from "./components/DashboardSummary";

export default function App() {
  return (
    <DashboardLayout>
      <header className="mb-8">
        <p className="text-sm text-slate-500">
          Selamat datang kembali,
        </p>

        <h2 className="mt-1 text-3xl font-bold text-slate-900">
          Dashboard Kelas 👋
        </h2>

        <p className="mt-2 text-slate-500">
          Pantau aktivitas dan tugas kelasmu di satu tempat.
        </p>
      </header>

      <DashboardSummary />
    </DashboardLayout>
  );
}
  