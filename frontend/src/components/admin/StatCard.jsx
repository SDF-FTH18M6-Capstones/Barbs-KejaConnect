function StatCard({ title, value, description, icon }) {
  return (
    <div className="rounded-xl border border-[#E1E5E0] bg-white p-5 shadow-sm">
      {/* Card heading and icon */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[#56625B]">{title}</p>

        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E7F2EC] text-lg text-[#0E6B4E]">
          {icon}
        </span>
      </div>

      {/* Statistic value */}
      <h2 className="mt-4 text-3xl font-bold text-[#16211C]">{value}</h2>

      {/* Description */}
      <p className="mt-2 text-xs text-[#56625B]">{description}</p>
    </div>
  );
}

export default StatCard;
