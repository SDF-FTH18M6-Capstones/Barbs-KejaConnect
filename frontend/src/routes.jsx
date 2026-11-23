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
import { ADMIN } from "./paths";
import AdminNewListing from "./pages/admin/AdminNewListing";
import AdminLayout from "./components/admin/AdminLayout";


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
  { path: "/dashboard", element: <PosterDashboard /> },
  { path: "/dashboard/listings", element: <MyListings /> },
  { path: "/listings/new", element: <NewListing /> },
  { path: "/dashboard/inquiries", element: <PosterInquiries /> },
  { path: "/dashboard/verification", element: <Verification /> },

  {
    element: <AdminLayout />,
    children: [
      { path: ADMIN.home, element: <AdminDashboard /> },
      { path: ADMIN.approvalQueue, element: <AdminApprovalQueue /> },
      { path: ADMIN.posterReview, element: <PosterReview /> },
      { path: ADMIN.newListing, element: <AdminNewListing /> },
      // placeholders until these pages are built
      { path: ADMIN.stats, element: <AdminDashboard /> },
      { path: ADMIN.reports, element: <AdminDashboard /> },
    ],
  },
]);
