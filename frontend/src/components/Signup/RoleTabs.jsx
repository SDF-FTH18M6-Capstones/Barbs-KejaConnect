import { NavLink } from "react-router-dom";
import { ROLES } from "./data/signupRoles";

export default function RoleTabs() {
  return (
    <nav>
      {Object.entries(ROLES).map(([id, role]) => (
        <NavLink
          key={id}
          to={`/signup/${id}`}
          className={({ isActive }) =>
            isActive ? "font-bold text-primary" : "font-medium text-text"
          }
        >
          {role.label}
        </NavLink>
      ))}
    </nav>
  );
}
