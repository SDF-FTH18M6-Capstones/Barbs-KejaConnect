import { NavLink, useNavigate } from "react-router-dom";
import ButtonAlternate from "../ButtonAlternate";
import ButtonPrimary from "../ButtonPrimary";
import Brand from "../Brand";
import { POSTER, ROUTES } from "../../paths";
import { useAuth } from "../../providers/AuthProvider";

const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

export default function Header() {
  const { userData } = useAuth();
  const { data, loading, error } = userData;
  const user = data || null;

  const navigate = useNavigate();
  const isPoster = user?.role === "manager" || user?.role === "owner";

  const handleButtonClick = (type) => {
    console.log(type);
    if (type == "login") {
      navigate("/login");
    } else {
      navigate("/signup");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
    navigate("/");
  };

  return (
    <nav className="logo flex justify-between py-5 px-10 h-20">
      <Brand />
      <div className="flex justify-between gap-3">
        <div className="actions flex items-center gap-4">
          <NavLink to="/" className="text-text hover:text-primary">
            Browse
          </NavLink>
          {isPoster && (
            <NavLink to={POSTER.home} className="text-text hover:text-primary">
              Dashboard
            </NavLink>
          )}
          {user?.role === "tenant" && (
            <NavLink
              to={ROUTES.myInquiries}
              className="text-text hover:text-primary"
            >
              My Inquiries
            </NavLink>
          )}
        </div>
        <div className="auth flex items-center gap-3">
          {user ? (
            <>
              <span className="flex items-center gap-2">
                <span className="grid size-9 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary-dark">
                  {initials(user.full_name)}
                </span>
                <span className="text-sm text-text">{user.full_name}</span>
              </span>
              <ButtonAlternate onClick={handleLogout} text="Log out" />
            </>
          ) : (
            <>
              <ButtonAlternate
                onclick={() => handleButtonClick("login")}
                text="Log in"
              />
              <ButtonPrimary
                onclick={() => handleButtonClick("")}
                text="Sign Up"
              />
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
