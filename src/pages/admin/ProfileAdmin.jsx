import React, { useEffect, useState } from "react";
import { User, Pencil } from "lucide-react";
import { useNavigate } from "react-router";
import { supabase } from "../../lib/supabase";

export default function ProfileAdmin() {
  const [userFullName, setUserFullName] = useState();
  const [userJabatan, setUserJabatan] = useState();
  const [userEmail, setUserEmail] = useState();

  const navigate = useNavigate();

  const handleLogout = () => {
    supabase.auth.signOut();
    navigate("/login");
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

      console.log(error);
    };
    fetchUserProfile();

    console.log;
  }, []);
  return (
    <main className="flex flex-col gap-8 p-8 bg-blue-50/30 font-sans">
      <div className="bg-background rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-dashed border-slate-300 flex items-center">
          {/* Avatar */}
          <div className="flex flex-col items-center mr-10">
            <div className="relative">
              <div className="w-24 h-24 bg-foreground rounded-full flex items-center justify-center text-background border-4 border-background shadow-md">
                <User size={56} />
              </div>
              <div className="absolute bottom-0 right-0 bg-background p-1.5 rounded-full border border-slate-200 shadow-sm cursor-pointer hover:bg-slate-50">
                <Pencil size={14} className="text-foreground" />
              </div>
            </div>
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
