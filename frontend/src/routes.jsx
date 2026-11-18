import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/auth/Login";
import MyInquiries from "./pages/MyInquiries/MyInquiries";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ListingDetail from "./pages/ListingDetail";
import PosterDashboard from "./pages/PosterDashboard/PosterDashboard";
import MyListings from "./pages/PosterDashboard/MyListings";
import NewListing from "./pages/PosterDashboard/NewListing";
import PosterInquiries from "./pages/PosterDashboard/PosterInquiries";
import Verification from "./pages/PosterDashboard/Verification";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminApprovalQueue from "./pages/admin/AdminApprovalQueue";
import PosterReview from "./pages/admin/PosterReview";

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
  //poster dashboard
  { path: "/poster_dashboard", element: <PosterDashboard /> },
  { path: "/poster_dashboard/listings", element: <MyListings /> },
  { path: "/poster_dashboard/listings/new", element: <NewListing /> },
  { path: "/poster_dashboard/inquiries", element: <PosterInquiries /> },
  { path: "/poster_dashboard/verification", element: <Verification /> },
  //admin
  { path: "/admin_dashboard", element: <AdminDashboard /> },
  { path: "/admin_dashboard/approval_queue", element: <AdminApprovalQueue /> },
  { path: "/admin_dashboard/poster_review", element: <PosterReview /> },
]);
