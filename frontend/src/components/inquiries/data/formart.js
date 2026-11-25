export function formatKES(amount) {
  return `KES ${Number(amount).toLocaleString("en-KE")}`;
}

export function formatDate(iso, now = new Date()) {
  const date = new Date(iso);
  const days = Math.floor((now - date) / 86400000);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
