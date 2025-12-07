import { Image } from "lucide-react";
export default function UserCard({ title, user }) {
  return (
    <div className="bg-foreground rounded-xl p-4 shadow-md flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center">
        {user?.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.full_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Image className="w-6 h-6 textbackground" />
        )}
      </div>

      <div>
        <p className="text-sm text-background">{title}</p>
        {user ? (
          <>
            <p className="font-medium text-background">{user.full_name}</p>
            <p className="text-xs text-background">{user.email}</p>
          </>
        ) : (
          <p className="text-background italic">Belum ada</p>
        )}
      </div>
    </div>
  );
}
