    import { useEffect, useState } from "react";
    import { Navigate } from "react-router";
    import { supabase } from "../lib/supabase";

    export default function ProtectedRoute({children}) {
        const [status, setStatus] = useState("loading")

        useEffect(() => {
            let active = true

            async function checkAccess() {
                setStatus("loading")

                try {
                    const {
                        data: {user},
                        error: userError,
                    } = await supabase.auth.getUser()

                    if (userError || !user) {
                        if (active) setStatus("unauthenticated")
                        return 
                    }

                    const {data, error} = await supabase
                        .from("class_members")
                        .select("class_id")
                        .eq("user_id", user.id)
                        .limit(1)

                    if (error) {
                        console.error("Gagal menerima keanggotaan:", error)
                        if (active) setStatus("error")
                        return 
                    }

                    if (active) {
                        setStatus(data.length > 0 ? "authorized" : "forbidden")
                    }
                } catch(error) {
                    console.error("Pemeriksaan akses gagal:", error)
                    if (active) setStatus("error")
                }
            }
            checkAccess()

            return () => {
                active = false
            }
        }, [])

        if (status === "loading") {
            return <p className="p-6 text-center">Memeriksa akses...</p>
        }

        if (status === "unauthenticated") {
            return <Navigate to="/login" replace/>
        }

        if (status === "forbidden") {
            return (
                <p className="p-6 text-center text-red-600">
                    Akun kamu belum terdaftar sebagai anggota kelas.
                </p>
            )
        }

        if (status === "error") {
            return (
                <p>
                    Gagal memeriksa akses. Silahkan refresh halaman.
                </p>
            )
        }
        return children
    }