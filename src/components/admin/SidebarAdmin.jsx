import React from "react";
import { useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  User,
  LogOut,
} from "lucide-react";

export default function SidebarAdmin() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Ambil segment URL → /admin/dashboard → "dashboard"
  const activePage = pathname.split("/")[2] || "dashboard";

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "pengajuan", label: "Daftar Pengajuan", icon: FileText },
    { key: "laporan", label: "Laporan Keuangan", icon: BookOpen },
    { key: "profile", label: "Profile", icon: User },
  ];

  const handleLogout = () => {
    // kalau kamu punya supabase.auth.signOut tambahin di sini ya
    // await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-foreground text-background flex flex-col fixed h-full z-50">
      {/* LOGO / HEADER */}
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary p-2 rounded-lg">
          <LayoutDashboard size={24} />
        </div>
        <h1 className="text-2xl font-bold tracking-wide">FundHub</h1>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map(({ key, label, icon: Icon }) => {
          const isActive = activePage === key;

          return (
            <div
              key={key}
              onClick={() =>
                navigate(`/admin/${key === "dashboard" ? "" : key}`)
              }
              className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all ${
                isActive
                  ? "bg-primary/20 text-primary border-l-4 border-primary"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{label}</span>
            </div>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="p-6">
        <button
          onClick={handleLogout}
          className="w-full bg-rejected hover:bg-red-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-semibold transition-colors cursor-pointer"
        >
          <LogOut size={20} />
          Log Out
        </button>
      </div>
    </aside>
  );
}
