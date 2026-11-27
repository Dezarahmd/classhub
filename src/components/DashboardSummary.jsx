
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
    color: "bg-primary-light text-primary",
  },
  {
    title: "Sedang Dikerjakan",
    value: 5,
    description: "Tugas belum selesai",
    icon: Clock3,
    color: "bg-info-light text-info",
  },
  {
    title: "Tugas Selesai",
    value: 5,
    description: "Berhasil diselesaikan",
    icon: CircleCheck,
    color: "bg-success-light text-success",
  },
  {
    title: "Tugas Terlambat",
    value: 2,
    description: "Perlu segera diperiksa",
    icon: AlertCircle,
    color: "bg-danger-light text-danger",
  },
];

const upcomingTasks = [
  {
    subject: "Pemrograman Web",
    title: "Membuat landing page",
    deadline: "20 Okt 2026",
    status: "Segera",
    statusColor: "bg-warning-light text-warning",
  },
  {
    subject: "Basis Data",
    title: "Merancang ERD",
    deadline: "22 Okt 2026",
    status: "Mendatang",
    statusColor: "bg-info-light text-info",
  },
  {
    subject: "Rekayasa Perangkat Lunak",
    title: "Menyusun dokumen kebutuhan",
    deadline: "24 Okt 2026",
    status: "Mendatang",
    statusColor: "bg-info-light text-info",
  },
];

export default function DashboardSummary() {
  return (
    <div className="space-y-8">
      {/* Ringkasan tugas */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Ringkasan Tugas
          </h2>

          <p className="mt-1 text-sm text-muted">
            Gambaran umum progres tugas kelasmu.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="min-w-0 rounded-2xl border border-border bg-surface p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.color}`}
                  >
                    <Icon size={21} aria-hidden="true" />
                  </div>

                  <span className="text-2xl font-bold tabular-nums text-foreground">
                    {item.value}
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-foreground">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs text-muted">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Deadline terdekat */}
      <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-foreground">
              Deadline Terdekat
            </h2>

            <p className="mt-1 text-sm text-muted">
              Jangan sampai ada tugas yang terlewat.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-sm font-medium text-accent transition-colors duration-200 motion-reduce:transition-none hover:bg-accent-light hover:text-accent-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Lihat semua
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="divide-y divide-border">
          {upcomingTasks.map((task) => (
            <div
              key={task.title}
              className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                  <CalendarDays size={19} aria-hidden="true" />
                </div>

                <div className="min-w-0">
                  <h3 className="wrap-break-word font-semibold text-foreground">
                    {task.title}
                  </h3>

                  <p className="mt-1 text-sm text-muted">
                    {task.subject}
                  </p>

                  <p className="mt-1 text-xs text-muted">
                    Deadline: {task.deadline}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center pl- sm:justify-end sm:pl-0">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${task.statusColor}`}
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
