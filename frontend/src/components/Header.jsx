import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import ButtonAlternate from "./ButtonAlternate";
import ButtonPrimary from "./ButtonPrimary";
import ButtonText from "./ButtonText";
export default function Header() {
  //check if user exists to display varied status bar
  return (
    <nav className="logo flex justify-between py-5 px-10 h-20">
      <div className="flex gap-2 items-center">
        <img src={logo} alt="" className="h-15 w-15 object-contain" />
        <p className="text-2xl font-semibold text-primary">KejaConnect</p>
      </div>
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
