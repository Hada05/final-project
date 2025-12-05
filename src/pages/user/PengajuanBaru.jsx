import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router";

export default function PengajuanBaruAnggota() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    amount: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleImage(e) {
    const file = e.target.files[0];
    setImageFile(file);

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  }

async function handleSubmit() {
  setLoading(true);

  let proofPath = null;

  // Upload image kalau ada
  if (imageFile) {
    const ext = imageFile.name.split(".").pop();
    const fileName = `proof-${Date.now()}.${ext}`;

    const { data: uploadData, error: uploadErr } = await supabase.storage
      .from("buktiPengajuan")
      .upload(fileName, imageFile);

    if (uploadErr) {
      console.error(uploadErr);
      alert("Gagal upload gambar!");
      setLoading(false);
      return;
    }

    proofPath = uploadData.path; // <— simpen path aja, bukan publicUrl
    console.log("Uploaded image path:", proofPath);
  }

  // Insert ke database
  const { data, error } = await supabase.from("reimbursements").insert({
    title: form.title,
    amount: form.amount,
    description: form.description,
    proof_url: proofPath, // simpen path
    status: "pending",
    user_id: (await supabase.auth.getUser()).data.user.id,
  });

  if (error) {
    console.error(error);
    alert("Gagal membuat pengajuan!");
  } else {
    alert("Berhasil membuat pengajuan!");
    navigate("/");
  }

  setLoading(false);
}


  return (
    <main className="flex-1 p-8 bg-background min-h-screen">
      <h2 className="text-2xl font-semibold mb-8">Buat Pengajuan Baru</h2>

      <div className="flex flex-col md:flex-row gap-10">
        {/* LEFT: FORM */}
        <div className="flex-1 space-y-6">
          <input
            type="text"
            name="title"
            placeholder="Judul pengajuan"
            className="w-full bg-slate-100 px-4 py-3 rounded-xl border"
            value={form.title}
            onChange={handleChange}
          />

          <input
            type="number"
            name="amount"
            placeholder="Jumlah (Rp)"
            className="w-full bg-slate-100 px-4 py-3 rounded-xl border"
            value={form.amount}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Deskripsi..."
            rows={6}
            className="w-full bg-slate-100 px-4 py-3 rounded-xl border resize-none"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        {/* RIGHT: UPLOAD IMAGE */}
        <div className="flex-1 flex flex-col items-center">
          <div className="w-full flex justify-center">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-xs rounded-xl shadow"
              />
            ) : (
              <div className="w-64 h-64 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500">
                No Image
              </div>
            )}
          </div>

          <label className="mt-4 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-xl shadow">
            Upload Bukti
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImage}
              required
            />
          </label>
        </div>
      </div>

      <button
        disabled={loading}
        onClick={handleSubmit}
        className="mt-10 w-full text-background bg-primary cursor-pointer py-4 rounded-xl text-lg font-bold"
      >
        {loading ? "Mengirim..." : "Kirim Pengajuan"}
      </button>
    </main>
  );
}
