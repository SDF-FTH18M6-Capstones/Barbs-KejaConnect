import { NavLink } from "react-router-dom";

export default function NavBarLink({ to, text }) {
  const isNavActive = ({ isActive }) =>
    `px-3 py-2 text-center rounded-md ${
      isActive
        ? "text-primary bg-primary/20"
        : "text-text-muted hover:bg-primary/10"
    }`;

  return (
    <NavLink to={to} className={isNavActive}>
      {text}
    </NavLink>
  );
}
