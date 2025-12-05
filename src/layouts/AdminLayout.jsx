import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { supabase } from "../lib/supabase";
import SidebarAdmin from "../components/admin/SidebarAdmin";

export default function AdminLayout() {
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
        navigate("/login");
        return;
      }

      // Kalau role bukan bendahara, redirect ke anggota (/)
      if (profile.role !== "bendahara") {
        navigate("/");
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
    <div className="min-h-screen flex flex-row">
      <SidebarAdmin />
      <main className="h-full w-full ml-64">
        <Outlet />
      </main>
    </div>
  );
}
