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
import { POSTER } from "./paths";
import EditListing from "./pages/PosterDashboard/EditListing";
import RootLayout from "./layouts/RootLayout";
import DocumentsLayout from "./layouts/DocumentsLayout";
import AdminLayout from "./layouts/AdminLayout";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
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
      {
        element: <DocumentsLayout />,
        children: [
          { path: POSTER.home, element: <PosterDashboard /> },
          { path: POSTER.listings, element: <MyListings /> },
          { path: POSTER.newListing, element: <NewListing /> },
          { path: POSTER.editListing(":id"), element: <EditListing /> },
          { path: POSTER.inquiries, element: <PosterInquiries /> },
          { path: POSTER.verification, element: <Verification /> },
          // "Browse listings" buttons link here; the listings are on the home page
          { path: "/listings", element: <Navigate to="/" replace /> },

          //admin
          {
            element: <AdminLayout />,
            children: [
              { path: "/admin_dashboard", element: <AdminDashboard /> },
              {
                path: "/admin_dashboard/approval_queue",
                element: <AdminApprovalQueue />,
              },
              {
                path: "/admin_dashboard/poster_review",
                element: <PosterReview />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
