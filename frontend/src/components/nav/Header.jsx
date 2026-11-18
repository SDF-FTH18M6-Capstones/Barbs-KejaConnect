import { NavLink, useNavigate } from "react-router-dom";
import ButtonAlternate from "../ButtonAlternate";
import ButtonPrimary from "../ButtonPrimary";
import Brand from "../Brand";
import { getCurrentUser } from "../inquiries/data/currentUser";
import { POSTER, ROUTES } from "../../paths";

// "Faith Njeri" -> "FN"
const initials = (name) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase(); // ← added

export default function Header() {
  //check if user exists to display varied status bar
  const navigate = useNavigate();
  const user = getCurrentUser(); // ← added: { full_name, role } or null
  const isPoster = user?.role === "manager" || user?.role === "owner"; // ← added

  const handleButtonClick = (type) => {
    console.log(type);
    if (type == "login") {
      navigate("/login");
    } else {
      navigate("/signup");
    }
  };

  // ← added: clears the saved user and goes to the home page
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
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
          {isPoster && ( // ← only posters can create listings
            <NavLink to={POSTER.home} className="text-text hover:text-primary">
              Dashboard
            </NavLink>
          )}
          {user?.role === "tenant" && ( // ← only tenants send inquiries
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
            // ← added: logged in shows initials, name and Log out
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
            // unchanged: visitors see Log in / Sign Up
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
