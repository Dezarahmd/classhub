import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router";
import { Loader2, ShieldAlert, CircleAlert } from "lucide-react";
import { supabase } from "../lib/supabase";
import { MembershipContext } from "../contexts/MembershipContext";

const feedbackClass =
  "flex items-center justify-center gap-2 p-6 text-center text-sm";

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("loading");
  const [membership, setMembership] = useState(null);
  const requestId = useRef(0);

  useEffect(() => {
    let active = true;
    const requestTracker = requestId;

    async function checkAccess() {
      const currentRequestId = ++requestId.current;

      setMembership(null);
      setStatus("loading");

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (!active || currentRequestId !== requestId.current) {
          return;
        }

        if (userError) {
          if (userError.name === "AuthSessionMissingError") {
            setStatus("unauthenticated");
          } else {
            console.error(
              "Gagal memeriksa autentikasi:",
              userError.name
            );
            setStatus("error");
          }

          return;
        }

        if (!user) {
          setStatus("unauthenticated");
          return;
        }

        const { data, error } = await supabase
          .from("class_members")
          .select("class_id, role")
          .eq("user_id", user.id)
          .limit(1);

        if (!active || currentRequestId !== requestId.current) {
          return;
        }

        if (error) {
          console.error("Gagal mengambil keanggotaan:", error);
          setStatus("error");
          return;
        }

        setMembership(data?.[0] ?? null);
        setStatus(
          data && data.length > 0 ? "authorized" : "forbidden"
        );
      } catch (error) {
        console.error("Pemeriksaan akses gagal:", error);

        if (active && currentRequestId === requestId.current) {
          setStatus("error");
        }
      }
    }

    checkAccess();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (!active) return;

      if (event === "SIGNED_OUT") {
        requestTracker.current++;
        setMembership(null);
        setStatus("unauthenticated");
      }

      if (event === "SIGNED_IN") {
        checkAccess();
      }
    });

    return () => {
      active = false;
      requestTracker.current++;
      subscription.unsubscribe();
    };
  }, []);

  if (status === "loading") {
    return (
      <div
        role="status"
        className={`${feedbackClass} text-muted`}
      >
        <Loader2
          className="h-5 w-5 shrink-0 animate-spin motion-reduce:animate-none"
          aria-hidden="true"
        />
        <p>Memeriksa akses...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  if (status === "forbidden") {
    return (
      <div
        role="alert"
        className={`${feedbackClass} text-danger`}
      >
        <ShieldAlert
          className="h-5 w-5 shrink-0"
          aria-hidden="true"
        />
        <p>Akun kamu belum terdaftar sebagai anggota kelas.</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div
        role="alert"
        className={`${feedbackClass} text-danger`}
      >
        <CircleAlert
          className="h-5 w-5 shrink-0"
          aria-hidden="true"
        />
        <p>Gagal memeriksa akses. Silakan refresh halaman.</p>
      </div>
    );
  }

  return (
    <MembershipContext.Provider value={membership}>
      {children}
    </MembershipContext.Provider>
  );
}