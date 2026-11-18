function StatusBadge({ status }) {
  const statusStyles = {
    pending: "bg-[#FCEBC8] text-[#6B4405]",
    approved: "bg-[#DDF0E7] text-[#0A5039]",
    rejected: "bg-[#FBE1DE] text-[#8A2018]",
  };

  const normalizedStatus = status?.toLowerCase();

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
        statusStyles[normalizedStatus] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
