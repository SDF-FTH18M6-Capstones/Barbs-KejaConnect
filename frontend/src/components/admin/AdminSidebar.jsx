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
      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Menu
        </p>

        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                isActive
                  ? "bg-[#0E6B4E] font-semibold text-white"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
        <div className="pt-5">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
          >
            <span>↗</span>
            View site
          </Link>
        </div>
      </nav>

      {/* Admin profile */}
      <div className="border-t border-white/15 pt-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0E6B4E] font-semibold">
            A
          </div>

          <div>
            <p className="text-sm font-semibold">Admin</p>
            <p className="text-xs text-gray-400">Platform administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;
