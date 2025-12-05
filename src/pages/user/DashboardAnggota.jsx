import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../lib/supabase";
import RequestCard from "../../components/user/RequestCardAnggota";

const DashboardAnggota = () => {
  const navigate = useNavigate();
  const [dataPengajuan, setDataPengajuan] = useState([]);

  useEffect(() => {
    async function fetchPengajuan() {
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();

      if (userErr || !user) {
        console.error("User not logged in:", userErr);
        return;
      }

      const { data, error } = await supabase
        .from("reimbursements")
        .select()
        .eq("user_id", user.id);

      if (error) {
        console.error("Gagal fetch reimbursements:", error);
        return;
      }

      setDataPengajuan(data);
    }

    fetchPengajuan();
  }, []);

  return (
    <div className="w-full h-full">
      <div className="w-full h-fit flex flex-row items-center justify-between px-8 py-16">
        <div>
          <img src="/handshake.svg" alt="Heya!" />
        </div>

        <div className="text-center w-full">
          <h2 className="text-2xl text-foreground w-full text-center font-semibold">
            Daftar Pengajuan Reimbursement
          </h2>
        </div>
      </div>

      <div className="px-8 flex flex-col gap-4">
        {dataPengajuan.length === 0 ? (
          <p className="text-center text-slate-500">Belum ada pengajuan.</p>
        ) : (
          dataPengajuan.map((item) => <RequestCard key={item.id} data={item} />)
        )}
      </div>

      <button
        onClick={() => navigate("/add")}
        className="fixed bottom-10 right-10 bg-slate-900 text-white w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-xl hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all duration-300 z-50 group cursor-pointer"
        title="Tambah Pengajuan"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 group-hover:rotate-90 transition duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  );
};

export default DashboardAnggota;
