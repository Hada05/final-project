import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import NavbarAnggota from "../components/user/NavbarAnggota";
import { supabase } from "../lib/supabase";

export default function AnggotaLayout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkRole() {
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();

      if (userErr || !user) {
        navigate("/login"); // belum login
        return;
      }

      // Ambil role dari table profiles
      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileErr || !profile) {
        navigate("/login"); // kalau error ambil role
        return;
      }

      // Kalau role bukan anggota & admin, redirect ke /admin
      if (profile.role !== "anggota" && profile.role !== "admin") {
        navigate("/admin");
      }

      setLoading(false);
    }

    checkRole();
  }, []);

  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarAnggota />
      <main className="h-full w-full">
        <Outlet />
      </main>
    </div>
  );
}
