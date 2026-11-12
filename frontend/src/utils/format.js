export const formatKES = (n) => Number(n).toLocaleString("en-KE");

export function timeAgo(isoDate, now = new Date()) {
  const days = Math.floor((now - new Date(isoDate)) / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "1 week ago";
  return new Date(isoDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
