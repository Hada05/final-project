import React, { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../lib/supabase";

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    alert("Registrasi berhasil! Cek email untuk verifikasi.");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#5e9bf5] flex items-center justify-center font-sans">
      <div className="bg-white p-10 rounded-[30px] shadow-xl w-full max-w-md mx-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800 mb-1">Register</h1>
          <p className="text-slate-400 font-light italic">
            Register a new account
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-5 py-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-slate-700 placeholder-slate-400"
              required
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-5 py-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-slate-700 placeholder-slate-400"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-5 py-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-slate-700 placeholder-slate-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#0f172a] hover:bg-slate-800 text-white font-bold py-3.5 rounded-full transition-all shadow-lg active:scale-[0.98] mt-2 cursor-pointer"
          >
            Register
          </button>
        </form>

        <p className="text-center text-slate-500 mt-8 text-sm">
          Sudah punya akun? Masuk{" "}
          <span
            onClick={() => navigate("/")}
            className="text-blue-500 font-semibold cursor-pointer hover:underline"
          >
            disini
          </span>
          !
        </p>
      </div>
    </div>
  );
}
