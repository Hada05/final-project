import React, { useState, useEffect } from "react";
import StatusCard from "../../components/admin/StatusCard";
import RequestCardAdmin from "../../components/admin/RequestCardAdmin";
import { supabase } from "../../lib/supabase";

export default function DashboardAdmin() {
  const userName = "Admin Contoh";
  const [latestRequest, setLatestRequest] = useState(null);
  const [statusCounts, setStatusCounts] = useState({
    diterima: 0,
    pending: 0,
    ditolak: 0,
  });
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    async function fetchLatestReimbursement() {
      const { data, error } = await supabase
        .from("reimbursements")
        .select("*")
        .order("created_at", { ascending: false }) // urut dari terbaru
        .limit(1) // ambil 1 data paling baru
        .single(); // ambil langsung objectnya

      if (error) console.error("Error fetching latest reimbursement:", error);
      else setLatestRequest(data);
    }

    async function fetchCountsByStatus() {
      const statuses = ["diterima", "pending", "ditolak"];

      const results = await Promise.all(
        statuses.map(async (s) => {
          const { count } = await supabase
            .from("reimbursements")
            .select("*", { count: "exact", head: true })
            .eq("status", s);

          return { status: s, count: count ?? 0 };
        })
      );

      // Convert array → object {approved: X, pending: Y, ...}
      const mapped = {
        approved: results.find((r) => r.status === "diterima")?.count || 0,
        pending: results.find((r) => r.status === "pending")?.count || 0,
        rejected: results.find((r) => r.status === "ditolak")?.count || 0,
      };

      setStatusCounts(mapped);
    }

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

    fetchLatestReimbursement();
    fetchCountsByStatus();
    fetchTotalAmount();
  }, []);

  return (
    <div className="p-8 bg-blue-50/30 min-h-screen font-sans">
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">
        Selamat datang, <span className="font-bold">{userName}!</span>
      </h2>

      {/* Banner */}
      <section className="flex flex-row justify-between items-center w-full px-8 drop-shadow-normal drop-shadow-foreground/25">
        <div className="z-10">
          <img src="/thinking.svg" alt="Heya!" />
        </div>

        <div className="text-center w-full z-10">
          <h3 className="text-2xl font-medium text-foreground">
            Here's the recap for today!
          </h3>
        </div>
      </section>

      <div className="space-y-6">
        {/* Latest Reimbursement */}
        <div className="bg-foreground rounded-xl overflow-hidden shadow-lg">
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-background font-medium">
              Latest Reimbursement Request
            </h3>
          </div>

          <div className="p-4 bg-foreground">
            {latestRequest ? (
              <RequestCardAdmin
                data={{
                  title: latestRequest.title,
                  amount: latestRequest.amount,
                  status: latestRequest.status,
                  id: latestRequest.id,
                }}
              />
            ) : (
              <p className="text-slate-500">Tidak ada pengajuan terbaru.</p>
            )}
          </div>
        </div>

        {/* Status Summary */}
        <div className="bg-foreground rounded-xl overflow-hidden shadow-lg">
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-background font-medium">
              Total Reimbursement Request
            </h3>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatusCard
              label="Approved"
              count={statusCounts.approved}
              color="bg-approved"
            />
            <StatusCard
              label="Pending"
              count={statusCounts.pending}
              color="bg-pending"
            />
            <StatusCard
              label="Rejected"
              count={statusCounts.rejected}
              color="bg-rejected"
            />
          </div>
        </div>

        {/* Total Amount */}
        <div className="bg-foreground rounded-xl overflow-hidden shadow-lg">
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-background font-medium">
              Total Amount of Reimbursement
            </h3>
          </div>

          <div className="p-6">
            <div className="bg-background rounded-lg p-4 w-full">
              <p className="text-2xl text-slate-500 font-light">
                Rp {totalAmount.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
