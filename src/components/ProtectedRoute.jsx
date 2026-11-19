import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router";
import { supabase } from "../lib/supabase";
import { MembershipContext } from "../contexts/MembershipContext";

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("loading");
  const [membership, setMembership] = useState(null)
  const requestId = useRef(0);

  useEffect(() => {
    let active = true;
    const requestTracker = requestId;

    async function checkAccess() {
      const currentRequestId = ++requestId.current;

      setMembership(null)
      setStatus("loading");

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (!active || currentRequestId !== requestId.current) {
          return;
        }

        if (userError || !user) {
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
        setStatus(data && data.length > 0 ? "authorized" : "forbidden");
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
        setMembership(null)
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
    return <p className="p-6 text-center">Memeriksa akses...</p>;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  if (status === "forbidden") {
    return (
      <p className="p-6 text-center text-red-600">
        Akun kamu belum terdaftar sebagai anggota kelas.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="p-6 text-center text-red-600">
        Gagal memeriksa akses. Silakan refresh halaman.
      </p>
    );
  }

  return (
    <MembershipContext.Provider value={membership}>
      {children}
    </MembershipContext.Provider>
  )
}
