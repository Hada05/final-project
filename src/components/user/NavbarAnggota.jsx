import React from "react";
import { useNavigate, useLocation } from "react-router";

function NavbarAnggota() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const navItems = [
    { path: "/", label: "Reimbursements" },
    { path: "/profile", label: "Profile" },
  ];

  return (
    <div className="w-full h-fit flex flex-row items-center justify-between bg-foreground px-8 py-4 drop-shadow-normal drop-shadow-foreground/25 rounded-b-2xl">
      <div>
        <img src="/icon.svg" alt="icon" />
      </div>

      <div className="flex flex-row gap-8">
        {navItems.map(({ path, label }) => {
          const isActive = pathname === path;
          return (
            <p
              key={path}
              className={`
                cursor-pointer transition-all
                ${
                  isActive
                    ? "text-primary"
                    : "text-background/70 hover:text-background"
                }
              `}
              onClick={() => navigate(path)}
            >
              {label}
            </p>
          );
        })}
      </div>
    </div>
  );
}

export default NavbarAnggota;
