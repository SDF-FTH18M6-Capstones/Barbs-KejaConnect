import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Signup from "../pages/Signup";
import ListingDetail from "../pages/ListingDetail";
import MyInquiries from "../pages/MyInquiries";

export default function SignupRoutes({ children }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/signup"
          element={<Navigate to="/signup/tenant" replace />}
        />
        <Route path="/signup/:role" element={<Signup />} />
        <Route path="/listings/:id" element={<ListingDetail />} />
        <Route path="/my-inquiries" element={<MyInquiries />} />
        <Route path="*" element={children} />
      </Routes>
    </BrowserRouter>
  );
}
