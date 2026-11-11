import { NavLink } from "react-router-dom";
import { ROLES } from "../../data/signupRoles";

export default function RoleTabs() {
  return (
    <nav aria-label="Account type" className="grid gap-2.5 sm:grid-cols-3">
      {Object.entries(ROLES).map(([id, role]) => (
        <NavLink
          key={id}
          to={`/signup/${id}`}
          className={({ isActive }) =>
            `flex min-h-11 flex-col gap-0.5 rounded-xl px-4 py-3 text-text ${
              isActive
                ? "border-2 border-primary bg-primary/10"
                : "border border-text-muted/40 bg-surface hover:bg-bg"
            }`
          }
        >
          <span className="text-[15px] font-semibold">{role.label}</span>
          <span className="text-[13px] text-text-muted">{role.hint}</span>
        </NavLink>
      ))}
    </nav>
  );
}
