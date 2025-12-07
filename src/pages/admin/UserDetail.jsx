import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { User } from "lucide-react";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) {
        setUser(data);
        setRole(data.role);
      }
    }
    fetchUser();
  }, [id]);

  async function updateRole() {
    await supabase.from("profiles").update({ role }).eq("id", id);

    alert("Role updated ✅");
    navigate("/admin/users");
  }

  async function deleteUser() {
    const confirm = window.confirm(
      "Yakin hapus user ini? Data profile akan hilang."
    );

    if (!confirm) return;

    await supabase.from("profiles").delete().eq("id", id);
    navigate("/admin/users");
  }

  if (!user) return null;

  return (
    <main className="flex-1 p-8 bg-blue-50/30 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">Detail User</h2>

      <div className="bg-background rounded-xl p-6 shadow-sm space-y-4 max-w-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-gray-400" />
            )}
          </div>

          <div>
            <p className="text-lg font-semibold">{user.full_name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border rounded-md px-3 py-2 w-full"
          >
            <option value="anggota" className="cursor-pointer">
              Anggota
            </option>
            <option value="bendahara" className="cursor-pointer">
              Bendahara
            </option>
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={updateRole}
            className="px-4 py-2 rounded-lg bg-blue-600 text-background cursor-pointer"
          >
            Save
          </button>

          <button
            onClick={deleteUser}
            className="px-4 py-2 rounded-lg bg-red-600 text-background cursor-pointer"
          >
            Delete User
          </button>
        </div>
      </div>
    </main>
  );
}
