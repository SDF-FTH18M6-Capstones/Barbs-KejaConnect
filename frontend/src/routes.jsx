import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/auth/Login";
import MyInquiries from "./pages/MyInquiries/MyInquiries";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ListingDetail from "./pages/ListingDetail";
import PosterDashboard from "./pages/PosterDashboard/PosterDashboard";

export const router = createBrowserRouter([
  { path: "/signup", element: <Navigate to="/signup/tenant" replace /> },
  { path: "/signup/:role", element: <Signup /> },
  { path: "/login", element: <Login /> },
  { path: "/verify-email", element: <VerifyEmail /> },
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/my-inquiries", element: <MyInquiries /> },
      { path: "/listings/:id", element: <ListingDetail /> },
    ],
  },
  { path: "/poster_dashboard", element: <PosterDashboard /> },
]);
