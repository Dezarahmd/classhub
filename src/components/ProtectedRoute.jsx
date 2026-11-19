import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router";
import { supabase } from "../lib/supabase";

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("loading");
  const requestId = useRef(0);

  useEffect(() => {
    let active = true;

    async function checkAccess() {
      const currentRequestId = ++requestId.current;

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
          .select("class_id")
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

        setStatus(data && data.length > 0 ? "authorized" : "forbidden");
      } catch (error) {
        console.error("Pemeriksaan akses gagal:", error);

        if (active && currentRequestId === requestId.current) {
          setStatus("error");
        }
      }
    }

    // Pemeriksaan awal ketika komponen dipasang
    checkAccess();

    // Pantau perubahan authentication
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (!active) return;

      if (event === "SIGNED_OUT") {
        // Batalkan pengaruh request sebelumnya
        requestId.current++;
        setStatus("unauthenticated");
      }

      if (event === "SIGNED_IN") {
        checkAccess();
      }
    });

    // Cleanup saat effect dibersihkan
    return () => {
      active = false;
      requestId.current++;
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

  return children;
}
