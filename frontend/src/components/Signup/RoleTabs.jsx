import { NavLink } from "react-router-dom";
import { ROLES } from "./data/signupRoles";

export default function RoleTabs() {
  return (
    <nav className="grid gap-2 sm:grid-cols-3">
      {Object.entries(ROLES).map(([id, role]) => (
        <NavLink
          key={id}
          to={`/signup/${id}`}
          className={({ isActive }) =>
            `rounded-xl px-3 font-semibold text-text ${
              isActive
                ? "border-2 border-primary bg-primary/10"
                : "border border-border bg-surface"
            }`
          }
        >
          {role.label}
        </NavLink>
      ))}
    </nav>
  );
}
