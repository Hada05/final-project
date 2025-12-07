import React, { useEffect, useState } from "react";
import { User, Pencil } from "lucide-react";
import { data, useNavigate } from "react-router";
import { supabase } from "../../lib/supabase";
import imageCompression from "browser-image-compression";

export default function ProfileAnggota() {
  const [userFullName, setUserFullName] = useState();
  const [userJabatan, setUserJabatan] = useState();
  const [userEmail, setUserEmail] = useState();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUploadAvatar = async (e) => {
    try {
      setUploading(true);

      let file = e.target.files[0];
      if (!file) return;

      if (file.size > 1024 * 1024) {
        file = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 512,
          useWebWorker: true,
        });
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Ambil avatar lama (PATH, bukan URL)
      const { data: profile } = await supabase
        .from("profiles")
        .select("avatar_path")
        .eq("id", user.id)
        .single();

      // Hapus avatar lama
      if (profile?.avatar_path) {
        await supabase.storage.from("avatars").remove([profile.avatar_path]);
      }

      // Path baru
      const newPath = `${user.id}-${Date.now()}.png`;

      // Upload
      const { error } = await supabase.storage
        .from("avatars")
        .upload(newPath, file);

      if (error) throw error;

      // Generate public URL
      const { data } = supabase.storage.from("avatars").getPublicUrl(newPath);

      // Update DB
      await supabase
        .from("profiles")
        .update({
          avatar_path: newPath,
          avatar_url: data.publicUrl,
        })
        .eq("id", user.id);

      setAvatarUrl(data.publicUrl);
    } catch (err) {
      console.error(err);
      alert("Upload avatar gagal 😭");
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("id", (await supabase.auth.getUser()).data.user.id)
        .single();

      setUserFullName(data.full_name);
      setUserJabatan(data.role);
      setUserEmail(data.email);
      setAvatarUrl(data.avatar_url);

      console.log(error);
    };
    fetchUserProfile();
  }, []);

  console.log("AVATAR URL:", avatarUrl);
  return (
    <main className="flex flex-col gap-8 p-8 bg-blue-50/30 font-sans">
      <div className="bg-background rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-dashed border-slate-300 flex items-center">
          {/* Avatar */}
          <div className="relative w-24 h-24">
            {/* Avatar circle */}
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-background shadow-md bg-slate-200 flex items-center justify-center">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={56} className="text-slate-500" />
              )}
            </div>

            {/* Pencil button */}
            <div
              onClick={() =>
                !uploading && document.getElementById("avatar-upload").click()
              }
              className="absolute -bottom-1 -right-1 bg-background p-1.5 rounded-full border border-slate-200 shadow-sm cursor-pointer hover:bg-slate-50"
            >
              <Pencil size={14} className="text-foreground" />
            </div>

            {/* Hidden input */}
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              hidden
              onChange={handleUploadAvatar}
            />
          </div>

          {/* Title */}
          <div className="flex-1 flex justify-center">
            <h3 className="text-3xl font-semibold text-foreground tracking-wide">
              Profile
            </h3>
          </div>

          <div className="w-24"></div>
        </div>

        {/* Form */}
        <div className="p-8 space-y-6">
          <div>
            <label className="block text-slate-600 font-medium mb-2 pl-1">
              Full Name
            </label>
            <div className="bg-background border border-slate-300 rounded-xl p-3 shadow-sm">
              <input
                type="text"
                value={userFullName}
                readOnly
                className="w-full bg-transparent outline-none text-slate-700 font-medium"
                disabled
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-2 pl-1">
              Jabatan
            </label>
            <div className="bg-background border border-slate-300 rounded-xl p-3 shadow-sm">
              <input
                type="text"
                value={userJabatan}
                readOnly
                className="w-full bg-transparent outline-none text-slate-700 font-medium"
                disabled
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-2 pl-1">
              Email
            </label>
            <div className="bg-background border border-slate-300 rounded-xl p-3 shadow-sm">
              <input
                type="email"
                value={userEmail}
                readOnly
                className="w-full bg-transparent outline-none text-slate-700 font-medium"
                disabled
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
