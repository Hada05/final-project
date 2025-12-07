import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../lib/supabase";
import { User } from "lucide-react";

export default function DaftarUsers() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUsers() {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, role, avatar_url");

      if (error) {
        console.error(error);
      } else {
        setUsers(data);
      }
    }
    fetchUsers();
  }, []);

  return (
    <main className="flex-1 p-8 bg-blue-50/30 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">Manage Users</h2>

      <div className="space-y-3">
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => navigate(`/admin/users/${user.id}`)}
            className="cursor-pointer bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-gray-400" />
                )}
              </div>

              <div>
                <p className="font-medium">{user.full_name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <span
              className={`px-3 py-1 text-sm rounded-full 
              ${
                user.role === "bendahara"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {user.role}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
