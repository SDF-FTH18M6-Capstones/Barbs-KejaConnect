// routing for the sign up pages based on user role (tenant, landlord, etc.)
// in the main.jsx import this file and wrap your app with <SignupRoutes> to enable signup routing

import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Signup from "../pages/Signup/Signup";

export default function SignupRoutes({ children }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/signup"
          element={<Navigate to="/signup/tenant" replace />}
        />
        <Route path="/signup/:role" element={<Signup />} />
        <Route path="*" element={children} />
      </Routes>
    </BrowserRouter>
  );
}
