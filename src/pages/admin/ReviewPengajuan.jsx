import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import UserCard from "../../components/user/UserCard";

export default function ReviewPengajuan() {
  const navigate = useNavigate();
  const { id } = useParams();
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

  async function getCurrentUserProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, full_name, email, avatar_url, role")
      .eq("id", user.id)
      .single();

    return profile;
  }

  async function handleSubmit() {
    if (!data) return;

    const reviewerProfile = await getCurrentUserProfile();
    if (!reviewerProfile) {
      alert("Reviewer tidak valid");
      return;
    }

    const payload = {
      reimbursement_id: data.id,
      reason: reviewData.reason,
      reviewer_id: reviewerProfile.id,
    };

    // cek apakah review sudah ada
    const { data: existingReview } = await supabase
      .from("reimbursement_reviews")
      .select("*")
      .eq("reimbursement_id", data.id)
      .single();

    let result;

    if (existingReview) {
      result = await supabase
        .from("reimbursement_reviews")
        .update(payload)
        .eq("id", existingReview.id);
    } else {
      result = await supabase
        .from("reimbursement_reviews")
        .insert(payload)
        .select()
        .single();
    }

    if (result.error) {
      console.error("Submit error:", result.error);
      alert("Gagal submit review!");
    } else {
      alert("Review berhasil disimpan!");
      await supabase
        .from("reimbursements")
        .update({ status: keputusan })
        .eq("id", data.id);
      navigate("/admin/pengajuan");
    }
  }

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

        // fetch review if exists
        const { data: existingReview } = await supabase
          .from("reimbursement_reviews")
          .select("*")
          .eq("reimbursement_id", id)
          .single();

        if (existingReview) setReviewData(existingReview);

        // fetch signed URL if image exists
        if (data.proof_url) {
          const { data: urlData, error: urlError } = await supabase.storage
            .from("buktiPengajuan")
            .createSignedUrl(data.proof_url, 60); // 60 seconds valid

          if (!urlError) setImageUrl(urlData.signedUrl);
          else console.error("Signed URL error:", urlError);
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
      }
      const reviewerProfile = await getCurrentUserProfile();
      if (reviewerProfile) setReviewer(reviewerProfile);
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
              onClick={() => setKeputusan("diterima")}
              className={`px-8 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                keputusan === "diterima"
                  ? "bg-approved text-background shadow-[0_0_15px_rgba(0,0,0,0.3)] scale-105"
                  : "bg-background text-foreground hover:bg-slate-200"
              }`}
            >
              Diterima
            </button>

            <button
              onClick={() => setKeputusan("ditolak")}
              className={`px-8 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                keputusan === "ditolak"
                  ? "bg-rejected text-background shadow-[0_0_15px_rgba(0,0,0,0.3)] scale-105"
                  : "bg-background text-foreground hover:bg-red-600"
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
          onChange={(e) =>
            setReviewData((prev) => ({ ...prev, reason: e.target.value }))
          }
          className="w-full bg-slate-50 rounded-xl px-4 py-3 outline-none text-slate-800 placeholder-slate-400"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 hover:bg-blue-600 text-background py-4 rounded-xl font-bold text-xl shadow-lg transition-transform active:scale-[0.99] cursor-pointer"
      >
        Submit Review
      </button>
    </main>
  );
}
