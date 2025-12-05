import { useNavigate } from "react-router";

export default function RequestCard({ data }) {
  const navigate = useNavigate();
  const { title, amount, status, id } = data;

  const statusColors = {
    pending: "bg-pending",
    ditolak: "bg-rejected",
    diterima: "bg-approved",
  };

  const color = statusColors[status] || "bg-gray-300";

  return (
    <div className="bg-white rounded-xl flex overflow-hidden shadow-sm border border-foreground hover:shadow-md transition-shadow h-16 items-center cursor-pointer">
      {/* Left strip color */}
      <div className={`${color} w-3 h-full mr-4`} />

      {/* Content */}
      <div className="flex-1 flex justify-between items-center pr-6 py-3">
        <span className="font-medium text-slate-700 text-sm md:text-base flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
          {title}
        </span>

        <span className="text-slate-500 text-sm md:text-base flex-1 text-center">
          Rp {Number(amount).toLocaleString("id-ID")}
        </span>

        <span
          className="text-blue-600 text-sm font-medium hover:underline cursor-pointer"
          onClick={() => navigate(`/admin/pengajuan/${id}`)}
        >
          Lihat
        </span>
      </div>
    </div>
  );
}
