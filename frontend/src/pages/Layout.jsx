import { Children } from "react";
import Header from "../components/nav/Header";
import { Outlet } from "react-router-dom";
import { getCurrentUser } from "../components/inquiries/data/currentUser";

export default function Layout() {
  const user = getCurrentUser();
  return (
    <>
      <Header user={user} />
      <Outlet />
    </>
  );
}
