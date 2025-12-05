import { useEffect, useState } from "react";
import RequestCardAdmin from "../../components/admin/RequestCardAdmin";
import { supabase } from "../../lib/supabase";

export default function DaftarPengajuan() {
  const [reimbursements, setReimbursements] = useState([]);

  useEffect(() => {
    async function fetchRequest() {
      const { data, error } = await supabase.from("reimbursements").select("*");
      if (error) {
        console.error("Error fetching reimbursements:", error);
      } else {
        setReimbursements(data);
      }
    }
    fetchRequest();
  }, []);

  return (
    <main className="flex-1 p-8 bg-blue-50/30 min-h-screen font-sans">
      <h2 className="text-2xl font-semibold text-foreground mb-6">
        Daftar Pengajuan Reimbursement
      </h2>

      {/* Banner bisa tetap inline */}
      <section>
        <div className="flex flex-row px-8 items-center justify-between z-10 drop-shadow-normal drop-shadow-foreground/25">
          <img src="/computer.svg" alt="Heya!" />
          <div className="w-full text-center z-10">
            <h3 className="text-2xl font-medium text-foreground tracking-wide">
              Do not forget to review the requests !
            </h3>
          </div>
        </div>
      </section>

      <div className="space-y-4 mt-6">
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
      </div>
    </main>
  );
}
