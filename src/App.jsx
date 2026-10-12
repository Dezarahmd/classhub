import DashboardLayout from "./layouts/DashboardLayout";

export default function App() {
  return (
    <DashboardLayout>
      <header className="mb-8">
        <p className="text-sm text-slate-500">Selamat datang kembali,</p>
        <h2 className="mt-1 text-3xl font-bold text-slate-900">
          Dashboard Kelas 👋
        </h2>
        <p className="mt-2 text-slate-500">
          Pantau aktivitas dan tugas kelasmu di satu tempat.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">
          ClassHub siap dibangun!
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Dashboard awal berhasil dimuat. Selanjutnya kita akan menambahkan
          ringkasan tugas, deadline, dan aktivitas kelas.
        </p>
      </section>
    </DashboardLayout>
  );
}