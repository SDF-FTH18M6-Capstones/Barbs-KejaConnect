import { NavLink, Link, useNavigate } from "react-router-dom";
import { ADMIN, ROUTES } from "../../paths";
import { mockPendingApprovals } from "../../data/mockAdminData";

const REPORTS_COUNT = 3; // placeholder

function AdminSidebar() {
  const navigate = useNavigate();

  const navigationItems = [
    { label: "Overview", path: ADMIN.home, end: true },
    {
      label: "Approval queue",
      path: ADMIN.approvalQueue,
      badge: mockPendingApprovals.length,
    },
    { label: "Platform stats", path: ADMIN.stats },
    { label: "Reports", path: ADMIN.reports, badge: REPORTS_COUNT },
  ];

  const linkBase =
    "flex items-center justify-between rounded-md px-3 py-2 text-[13px] transition";

  return (
    <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col bg-[#16211C] px-4 py-5 text-white">
      {/* Brand */}
      <div className="mb-6 flex items-center gap-2 px-1">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#E7F2EC] text-sm font-bold text-[#16211C]">
          K
        </span>
        <span className="text-[15px] font-semibold">KejaConnect</span>
        <span className="rounded-full bg-[#F6E3B4] px-2 py-0.5 text-[10px] font-medium text-[#6B4405]">
          Admin
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `${linkBase} ${
                isActive
                  ? "bg-white/10 font-semibold text-white"
                  : "text-[#7FD1B0] hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <span>{item.label}</span>
            {item.badge > 0 && (
              <span className="rounded-full bg-[#F6E3B4] px-2 py-0.5 text-[11px] font-medium leading-none text-[#6B4405]">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}

        <Link
          to={ROUTES.home}
          className={`${linkBase} text-[#7FD1B0] hover:bg-white/5 hover:text-white`}
        >
          View site
        </Link>
      </nav>

      {/* Admin profile */}
      <div className="flex items-center gap-3 border-t border-white/15 px-1 pt-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#CFEBDD] text-xs font-semibold text-[#16211C]">
          KA
        </div>
        <div>
          <p className="text-xs font-semibold">KejaConnect Admin</p>
          <button
            type="button"
            onClick={() => navigate(ROUTES.home)}
            className="text-xs text-[#7FD1B0] underline hover:text-white"
          >
            Log out
          </button>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;
