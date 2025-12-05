import React, { useEffect, useState } from "react";
import { Coins } from "lucide-react";
import RequestCardAdmin from "../../components/admin/RequestCardAdmin";
import { supabase } from "../../lib/supabase";

export default function LaporanKeuangan() {
  const [totalAmount, setTotalAmount] = useState(0);
  const [reimbursements, setReimbursements] = useState([]);

  useEffect(() => {
    async function fetchTotalAmount() {
      const { data, error } = await supabase
        .from("reimbursements")
        .select(`sum_amount:amount.sum()`)
        .eq("status", "diterima")
        .single();

      if (error) {
        console.error("Error fetching total amount:", error);
        return;
      }

      setTotalAmount(data.sum_amount || 0);
    }
    async function fetchRequest() {
      const { data, error } = await supabase
        .from("reimbursements")
        .select("*")
        .eq("status", "diterima");
      if (error) {
        console.error("Error fetching reimbursements:", error);
      } else {
        setReimbursements(data);
      }
    }

    fetchTotalAmount();
    fetchRequest();
  }, []);

  return (
    <main className="flex-1 p-8 bg-blue-50/30 min-h-screen font-sans">
      <h2 className="text-2xl font-semibold text-foreground mb-6">
        Laporan Keuangan
      </h2>

      {/* Top Section */}
      <section className="flex flex-col md:flex-row items-center gap-8 mb-10 drop-shadow-normal drop-shadow-foreground/25">
        <div>
          <img src="/bills.svg" alt="Heya!" />
        </div>

        <div className="bg-foreground rounded-2xl p-8 shadow-lg flex-1 w-full relative overflow-hidden">
          <h3 className="text-background text-xl font-medium mb-6 relative z-10">
            Total Amount of Reimbursement
          </h3>

          <div className="bg-background rounded-xl p-4 relative z-10">
            <p className="text-2xl text-slate-500 font-light">
              Rp {totalAmount.toLocaleString("id-ID")}
            </p>{" "}
          </div>

          <div className="absolute right-0 bottom-0 opacity-5 text-background pointer-events-none">
            <Coins size={150} />
          </div>
        </div>
      </section>

      {/* Report List */}
      <div className="space-y-4 mt-6">
        {reimbursements.map((item) => (
          <RequestCardAdmin
            key={item.id}
            data={{
              id: item.id,
              title: item.title,
              amount: item.amount,
              status: item.status, // sesuai DB: pending, ditolak, diterima
            }}
          />
        ))}
      </div>
    </main>
  );
}
