import { NavLink } from "react-router-dom";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import NavBarLink from "../components/NavBarsLink";
export default function ExamplePage() {
  return (
    <>
      <SideBar mode="poster">
        <NavBarLink to="/" text="Dashboard" />
      </SideBar>
    </>
  );
}
