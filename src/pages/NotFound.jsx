import { Link, useNavigate } from "react-router";

const buttonBaseClass =
  "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition-colors duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2";

const primaryButtonClass =
  `${buttonBaseClass} bg-primary text-on-primary hover:bg-primary-hover`;

const secondaryButtonClass =
  `${buttonBaseClass} bg-neutral-light text-neutral-foreground hover:bg-border`;

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-8">
      <div className="flex w-full max-w-md flex-col items-center text-center">
        <h1 className="text-7xl font-extrabold text-primary sm:text-8xl">
          404
        </h1>

        <p className="mt-3 text-2xl font-semibold text-foreground">
          Halaman tidak ditemukan
        </p>

        <p className="mt-2 leading-relaxed text-muted">
          Alamat yang kamu buka tidak tersedia atau sudah dipindahkan.
        </p>

        <div className="mt-8 flex w-full flex-col-reverse gap-3 sm:w-auto sm:flex-row">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={secondaryButtonClass}
          >
            Halaman sebelumnya
          </button>

          <Link
            to="/"
            className={primaryButtonClass}
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}