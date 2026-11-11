import { NavLink } from "react-router-dom";
import ButtonAlternate from "./ButtonAlternate";
import ButtonPrimary from "./ButtonPrimary";
import Brand from "./Brand";
export default function Header() {
  //check if user exists to display varied status bar
  return (
    <nav className="logo flex justify-between py-5 px-10 h-20">
      <Brand />
      <div className="flex justify-between gap-3">
        <div className="actions flex items-center gap-4">
          <NavLink to="/listings" className="text-text hover:text-primary">
            Browse
          </NavLink>
          <NavLink to="/listings/new" className="text-text hover:text-primary">
            New Listing
          </NavLink>
          <NavLink to="/listing/new" className="text-text hover:text-primary">
            My Inquiries
          </NavLink>
        </div>
        <div className="auth flex items-center gap-3">
          <ButtonAlternate onclick={() => {}} text="Log in" />
          <ButtonPrimary onclick={() => {}} text="Sign Up" />
        </div>
      </div>
    </nav>
  );
}
