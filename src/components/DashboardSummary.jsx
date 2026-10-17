
import {
  ClipboardList,
  Clock3,
  CircleCheck,
  AlertCircle,
  ArrowRight,
  CalendarDays,
} from "lucide-react";

const summaryItems = [
  {
    title: "Total Tugas",
    value: 12,
    description: "Seluruh tugas kelas",
    icon: ClipboardList,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Sedang Dikerjakan",
    value: 5,
    description: "Tugas belum selesai",
    icon: Clock3,
    color: "bg-amber-50 text-amber-600",
  },
  {
    title: "Tugas Selesai",
    value: 5,
    description: "Berhasil diselesaikan",
    icon: CircleCheck,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Tugas Terlambat",
    value: 2,
    description: "Perlu segera diperiksa",
    icon: AlertCircle,
    color: "bg-red-50 text-red-600",
  },
];

const upcomingTasks = [
  {
    subject: "Pemrograman Web",
    title: "Membuat landing page",
    deadline: "20 Okt 2026",
    status: "Segera",
    statusColor: "bg-amber-50 text-amber-700",
  },
  {
    subject: "Basis Data",
    title: "Merancang ERD",
    deadline: "22 Okt 2026",
    status: "Mendatang",
    statusColor: "bg-blue-50 text-blue-700",
  },
  {
    subject: "Rekayasa Perangkat Lunak",
    title: "Menyusun dokumen kebutuhan",
    deadline: "24 Okt 2026",
    status: "Mendatang",
    statusColor: "bg-blue-50 text-blue-700",
  },
];

export default function DashboardSummary() {
  return (
    <div className="space-y-8">
      {/* Ringkasan tugas */}
      <section>
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900">
            Ringkasan Tugas
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Gambaran umum progres tugas kelasmu.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.color}`}
                  >
                    <Icon size={21} />
                  </div>
                  <span className="text-2xl font-bold text-slate-900">
                    {item.value}
                  </span>
                </div>

                <h4 className="mt-4 font-semibold text-slate-800">
                  {item.title}
                </h4>
                <p className="mt-1 text-sm text-slate-500">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Deadline terdekat */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Deadline Terdekat
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Jangan sampai ada tugas yang terlewat.
            </p>
          </div>

          <button
            type="button"
            className="flex shrink-0 items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-800"
          >
            Lihat semua
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {upcomingTasks.map((task) => (
            <div
              key={task.title}
              className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <CalendarDays size={19} />
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800">
                    {task.title}
                  </h4>
                  <p className="mt-1 text-sm text-slate-500">
                    {task.subject}
                  </p>
                  <p className="mt-2 text-xs text-slate-500 sm:hidden">
                    Deadline: {task.deadline}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <span className="hidden text-sm text-slate-500 sm:block">
                  {task.deadline}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${task.statusColor}`}
                >
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
