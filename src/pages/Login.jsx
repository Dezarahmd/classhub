
import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../lib/supabase";

import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  LogIn,
  CircleAlert,
} from "lucide-react";

const formControlClass =
  "w-full rounded-lg border border-input-border bg-surface py-2.5 pl-9 text-sm text-foreground placeholder:text-muted transition-colors duration-200 motion-reduce:transition-none focus:border-accent focus:ring-2 focus:ring-accent focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-light";

const formLabelClass =
  "block text-sm font-medium text-foreground";

const inputIconClass =
  "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted";

const primaryButtonClass =
  "mt-2 flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-on-primary transition-colors duration-200 motion-reduce:transition-none enabled:hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      // 1. Login menggunakan Supabase Authentication
      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        setError("Email atau password salah.");
        return;
      }

      // 2. Ambil user yang sedang login
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("Gagal memverifikasi akun. Silakan coba lagi.");
        return;
      }

      // 3. Periksa keanggotaan kelas
      const { data: memberships, error: membershipError } =
        await supabase
          .from("class_members")
          .select("class_id, role")
          .eq("user_id", user.id)
          .limit(1);

      if (membershipError) {
        console.error("Membership error:", membershipError);
        setError("Gagal memeriksa keanggotaan kelas.");
        return;
      }

      // 4. Tolak akun yang bukan anggota kelas
      if (!memberships || memberships.length === 0) {
        setError("Akun kamu belum terdaftar sebagai anggota kelas.");
        await supabase.auth.signOut();
        return;
      }

      // 5. Redirect ke Dashboard
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface px-6 py-8 shadow-sm">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-xl bg-primary p-3">
              <GraduationCap
                className="h-8 w-8 text-on-primary"
                aria-hidden="true"
              />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-foreground">
            Selamat Datang!
          </h1>

          <p className="mt-1 text-sm text-muted">
            Masuk ke akun ClassHub kamu
          </p>
        </header>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className={`${formLabelClass} mb-2`}
            >
              Email
            </label>

            <div className="relative">
              <span className={inputIconClass}>
                <Mail
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </span>

              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                required
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nim@bsi.ac.id"
                className={`${formControlClass} pr-3`}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor="password"
                className={formLabelClass}
              >
                Password
              </label>

              <span className="text-xs text-muted">
                Lupa password?
              </span>
            </div>

            <div className="relative">
              <span className={inputIconClass}>
                <Lock
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </span>

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                required
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`${formControlClass} pr-12`}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={
                  showPassword
                    ? "Sembunyikan password"
                    : "Tampilkan password"
                }
                className="absolute inset-y-0 right-0 flex w-11 cursor-pointer items-center justify-center rounded-r-lg text-muted transition-colors duration-200 motion-reduce:transition-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
              >
                {showPassword ? (
                  <EyeOff
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                ) : (
                  <Eye
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-danger/20 bg-danger-light p-3 text-sm text-danger"
            >
              <CircleAlert
                className="mt-0.5 h-4 w-4 shrink-0"
                aria-hidden="true"
              />

              <p className="min-w-0 wrap-break-word">
                {error}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={primaryButtonClass}
          >
            {isLoading ? (
              <>
                <Loader2
                  className="h-4 w-4 animate-spin motion-reduce:animate-none"
                  aria-hidden="true"
                />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <span>Masuk</span>
                <LogIn
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </>
            )}
          </button>
        </form>

        {/* Accessible Loading Announcement */}
        <div role="status" className="sr-only">
          {isLoading ? "Sedang memproses login." : ""}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-muted">
          Hanya untuk mahasiswa yang terdaftar di ClassHub
        </p>
      </div>
    </main>
  );
}
