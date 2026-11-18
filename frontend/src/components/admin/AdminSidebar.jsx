import { NavLink, Link } from "react-router-dom";

const navigationItems = [
  {
    label: "Overview",
    path: "/admin",
    icon: "▦",
    end: true,
  },
  {
    label: "Approval queue",
    path: "/admin/verifications",
    icon: "✓",
  },
  {
    label: "Platform stats",
    path: "/admin/stats",
    icon: "▥",
  },
  {
    label: "Reports",
    path: "/admin/reports",
    icon: "▤",
  },
];
function AdminSidebar() {
  return (
    <aside className="flex min-h-screen w-64 flex-col bg-[#16211C] px-5 py-6 text-white">
      {/* Brand */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold">KejaConnect</h1>
        <span className="mt-2 inline-block rounded-full bg-[#0E6B4E] px-3 py-1 text-xs">
          Admin
        </span>
      </div>
