import { Link, useNavigate } from "react-router";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="flex flex-col items-center text-center max-w-md">
        <h1 className="flex items-center gap-1 sm:gap-2" aria-label="Error 404">
          <span className="text-8xl font-extrabold text-blue-500">404</span>
        </h1>

        <p className="mt-3 text-2xl font-semibold text-blue-500">
          Halaman tidak ditemukan
        </p>
        <p className="mt-2 text-slate-500 leading-relaxed">
          Alamat yang kamu buka tidak tersedia atau sudah dipindahkan.
        </p>

        <div className="mt-8 flex flex-col-reverse sm:flex-row gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg px-5 py-2.5 bg-slate-900 text-white"
          >
            Halaman sebelumnya
          </button>
          <Link
            to="/"
            className="rounded-lg bg-blue-500 px-5 py-2.5 font-medium text-white shadow-sm hover:bg-blue-600 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
