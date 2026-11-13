import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/auth/Login";
import MyInquiries from "./pages/MyInquiries/MyInquiries";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/enquiries", element: <MyInquiries /> },
    ],
  },
  { path: "/signup", element: <Navigate to="/signup/tenant" replace /> },
  { path: "/signup/:role", element: <Signup /> },
  { path: "/login", element: <Login /> },
  
]);
