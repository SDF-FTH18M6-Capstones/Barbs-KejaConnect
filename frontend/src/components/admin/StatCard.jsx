function StatCard({ title, value, description }) {
  return (
    <div className="rounded-xl border border-[#E1E5E0] bg-white p-4">
      <p className="text-xs text-[#56625B]">{title}</p>
      <h2 className="mt-2 text-3xl font-bold text-[#16211C]">{value}</h2>
      <p className="mt-1 text-xs text-[#56625B]">{description}</p>
    </div>
  );
}

export default StatCard;
