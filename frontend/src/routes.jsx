import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/auth/Login";
import VerifyEmail from "./pages/auth/VerifyEmail";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [{ path: "/", element: <Home /> }],
  },
  { path: "/signup", element: <Navigate to="/signup/tenant" replace /> },
  { path: "/signup/:role", element: <Signup /> },
  { path: "/login", element: <Login /> },
  { path: "/verify-email", element: <VerifyEmail /> },
]);
