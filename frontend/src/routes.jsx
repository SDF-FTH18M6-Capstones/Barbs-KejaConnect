import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./pages/Layout";
import ExamplePage from "./pages/Example";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/auth/Login";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [{ path: "/", element: <ExamplePage /> }],
  },
  { path: "/signup", element: <Navigate to="/signup/tenant" replace /> },
  { path: "/signup/:role", element: <Signup /> },
  { path: "/login", element: <Login /> },
]);
