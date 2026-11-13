export default function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="text-[13px] text-text-muted">{label}</p>
      <p className="text-3xl font-semibold text-text">{value}</p>
    </div>
  );
}
