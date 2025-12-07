import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { Image } from "lucide-react";
import { supabase } from "../../lib/supabase";
import UserCard from "../../components/user/UserCard";

export default function DetailPengajuan() {
  const navigate = useNavigate();
  const { id } = useParams(); // ambil ID dari URL
  const [data, setData] = useState(null);
  const [keputusan, setKeputusan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewData, setReviewData] = useState({
    reimbursement_id: 0,
    status: "",
    reason: "",
    reviewer_id: "",
  });
  const [imageUrl, setImageUrl] = useState(null);
  const [pengaju, setPengaju] = useState(null);
  const [reviewer, setReviewer] = useState(null);

  useEffect(() => {
    async function fetchDetail() {
      const { data, error } = await supabase
        .from("reimbursements")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Fetch error:", error);
      } else {
        setData(data);
        setKeputusan(data.status);

        // Fetch review
        const { data: existingReview } = await supabase
          .from("reimbursement_reviews")
          .select("*")
          .eq("reimbursement_id", id)
          .single();

        if (existingReview) setReviewData(existingReview);

        // Fetch signed URL untuk private image
        if (data.proof_url) {
          const { data: urlData, error: urlError } = await supabase.storage
            .from("buktiPengajuan")
            .createSignedUrl(data.proof_url, 60);

          if (!urlError) setImageUrl(urlData.signedUrl);
        }
        // fetch pengaju
        if (data.user_id) {
          const { data: pengajuData } = await supabase
            .from("profiles")
            .select("full_name, email, avatar_url, role")
            .eq("id", data.user_id)
            .single();

          if (pengajuData) setPengaju(pengajuData);
        }

        // fetch reviewer (kalau sudah ada review)
        if (existingReview?.reviewer_id) {
          const { data: reviewerData } = await supabase
            .from("profiles")
            .select("full_name, email, avatar_url, role")
            .eq("id", existingReview.reviewer_id)
            .single();

          if (reviewerData) setReviewer(reviewerData);
        }
      }

      setLoading(false);
    }

    fetchDetail();
  }, [id]);

  if (loading) return <p className="p-8 text-slate-600">Loading...</p>;
  if (!data) return <p className="p-8 text-red-600">Data tidak ditemukan.</p>;

  return (
    <main className="flex-1 p-8 bg-background min-h-screen font-sans">
      <h2 className="text-2xl font-semibold text-slate-800 mb-8">
        Review Pengajuan
      </h2>

      <div className="flex flex-col md:flex-row gap-10 mb-10">
        {/* LEFT */}
        <div className="flex-1 space-y-6">
          <input
            type="text"
            disabled
            value={data.title}
            className="w-full bg-slate-100/50 text-slate-600 rounded-xl px-4 py-3 border border-slate-200 shadow-md outline-none"
          />

          <input
            type="text"
            disabled
            value={`Rp ${Number(data.amount).toLocaleString("id-ID")}`}
            className="w-full bg-slate-100/50 text-slate-600 rounded-xl px-4 py-3 border border-slate-200 shadow-md outline-none"
          />

          <textarea
            disabled
            value={data.description}
            rows={6}
            className="w-full bg-slate-100/50 text-slate-600 rounded-xl px-4 py-3 border border-slate-200 shadow-md outline-none resize-none"
          />
        </div>

        {/* RIGHT */}
        <div className="flex-1 flex items-center justify-center">
          <img
            src={imageUrl ? imageUrl : "/no-image.png"}
            alt="Bukti"
            className="max-w-xs rounded-xl shadow"
          />
        </div>
      </div>

      {/* USER INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <UserCard title="Pengaju" user={pengaju} />
        <UserCard title="Reviewer" user={reviewer} />
      </div>

      {/* REVIEW BOX */}
      <div className="bg-foreground rounded-2xl p-8 shadow-lg mb-8">
        <h3 className="text-background text-xl font-medium mb-8 text-center">
          Review Pengajuan
        </h3>

        <div className="flex items-center justify-between mb-6 px-2">
          <span className="text-slate-200 font-light text-lg">
            Keputusan Pengajuan
          </span>

          <div className="flex gap-4">
            <button
              disabled
              className={`px-8 py-2 rounded-xl font-bold transition-all cursor-not-allowed ${
                keputusan === "diterima"
                  ? "bg-approved text-background shadow-[0_0_15px_rgba(0,0,0,0.3)] scale-105"
                  : "bg-background text-foreground"
              }`}
            >
              Diterima
            </button>

            <button
              disabled
              className={`px-8 py-2 rounded-xl font-bold transition-all cursor-not-allowed ${
                keputusan === "ditolak"
                  ? "bg-rejected text-background shadow-[0_0_15px_rgba(0,0,0,0.3)] scale-105"
                  : "bg-background text-foreground"
              }`}
            >
              Ditolak
            </button>
          </div>
        </div>

        <textarea
          placeholder="Keterangan"
          rows={5}
          value={reviewData.reason}
          disabled
          className="w-full bg-slate-50 rounded-xl px-4 py-3 outline-none text-slate-800 placeholder-slate-400"
        />
      </div>

      <button
        className="w-full bg-blue-500 hover:bg-blue-600 text-background py-4 rounded-xl font-bold text-xl shadow-lg transition-transform active:scale-[0.99] cursor-pointer"
        onClick={() => navigate("/")}
      >
        Back to dashboard
      </button>
    </main>
  );
}
