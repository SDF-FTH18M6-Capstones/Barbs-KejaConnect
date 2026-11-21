import { NavLink } from "react-router-dom";
import Brand from "../Brand";
import { POSTER } from "../../paths";
import { useAuth } from "../../providers/AuthProvider";

const LINKS = [
  { to: POSTER.home, label: "Dashboard", end: true },
  { to: POSTER.listings, label: "My Listings", end: true },
  { to: POSTER.newListing, label: "New listing" },
  { to: POSTER.inquiries, label: "Inquiries" },
  { to: POSTER.verification, label: "Verification" },
];

const initials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function PosterLayout({ user, unread = 0, children }) {
  const { logout: authLogout } = useAuth();

  function logout() {
    localStorage.removeItem("dev_user");
    authLogout();
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg text-text md:flex-row">
      <aside className="flex flex-col gap-1 border-b border-border bg-surface p-4 md:w-60 md:shrink-0 md:border-r md:border-b-0">
        <div className="px-2 pb-4">
          <Brand />
        </div>

        <nav
          aria-label="Poster menu"
          className="flex flex-wrap gap-1 md:flex-col"
        >
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex min-h-11 items-center gap-2 rounded-lg px-3 text-[15px] font-medium ${
                  isActive
                    ? "bg-primary/10 text-primary-dark"
                    : "text-text-muted hover:bg-bg hover:text-text"
                }`
              }
            >
              {link.label}
              {link.badge && unread > 0 && (
                <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-text-on-primary">
                  {unread}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto hidden items-center gap-2.5 border-t border-border px-2 pt-4 md:flex">
          <span className="grid size-9 place-items-center rounded-full bg-primary text-sm font-semibold text-text-on-primary">
            {initials(user?.full_name)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{user?.full_name}</p>
            <button
              onClick={logout}
              className="text-[13px] text-primary hover:text-primary-dark"
            >
              Log out
            </button>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 space-y-6 p-4 sm:p-8">{children}</main>
    </div>
  );
}
