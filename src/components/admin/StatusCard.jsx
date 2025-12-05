import React from "react";

export default function StatusCard({ label, count, color }) {
  return (
    <div className="bg-background rounded-lg flex overflow-hidden h-16 items-center">
      <div className={`${color} w-8 h-full flex items-center justify-center`}>
        <span className="text-[10px] font-bold text-background -rotate-90 tracking-widest uppercase">
          {label}
        </span>
      </div>

      <div className="flex-1 flex justify-center items-center">
        <span className="text-2xl font-bold text-slate-800">{count}</span>
      </div>
    </div>
  );
}
