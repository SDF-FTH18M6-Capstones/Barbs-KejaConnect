import { Outlet } from "react-router-dom";
import Header from "../components/nav/Header";

export default function Layout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
