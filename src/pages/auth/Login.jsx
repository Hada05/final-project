import React, { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../lib/supabase";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signInWithEmail() {
    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (loginError) {
      alert("Login gagal: " + loginError.message);
      return;
    }

    const user = loginData.user;
    if (!user) {
      alert("User tidak ditemukan!");
      return;
    }

    // Ambil role dari tabel profiles
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      alert("Gagal mengambil role user!");
      return;
    }

    // Redirect sesuai role
    switch (profile.role) {
      case "bendahara":
        navigate("/admin/");
        break;
      case "anggota":
        navigate("/"); // misal halaman anggota
        break;
      default:
        navigate("/"); // fallback
        break;
    }
  }

  const handleLoginClick = (e) => {
    e.preventDefault();
    signInWithEmail();
  };

  return (
    <div className="min-h-screen bg-[#5e9bf5] flex items-center justify-center font-sans">
      <div className="bg-white p-10 rounded-[30px] shadow-xl w-full max-w-md mx-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-1">Login</h1>
          <p className="text-slate-400 font-light">Log in to your account</p>
        </div>

        <form onSubmit={handleLoginClick} className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="agung@gmail.com"
              className="w-full border border-slate-200 rounded-xl px-5 py-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-slate-700"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="....."
              className="w-full border border-slate-200 rounded-xl px-5 py-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-slate-700"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#0f172a] hover:bg-slate-800 text-white font-bold py-3.5 rounded-full transition-all shadow-lg active:scale-[0.98] mt-4 cursor-pointer"
          >
            Login
          </button>
        </form>

        <p className="text-center text-slate-500 mt-8 text-sm">
          Belum punya akun? Daftar{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-500 font-semibold cursor-pointer hover:underline ml-1"
          >
            disini
          </span>
          !
        </p>
      </div>
    </div>
  );
}
