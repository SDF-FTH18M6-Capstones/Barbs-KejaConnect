function StatCard({ title, value, description, icon }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="flex justify-between items-center">
        <p className="text-sm text-text-muted">{title}</p>
        {icon}
      </div>

      <h2 className="text-3xl font-semibold mt-3">{value}</h2>

      <p className="text-sm text-text-muted mt-1">{description}</p>
    </div>
  );
}

export default StatCard;
