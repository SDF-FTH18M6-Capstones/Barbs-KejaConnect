import { Outlet, useNavigate } from "react-router-dom";
import { AdminStatsProvider } from "../providers/AdminStatsProvider";
import { useAuth } from "../providers/AuthProvider";
import { useEffect } from "react";

export default function AdminLayout() {
  const { userData } = useAuth();
  const { data, loading, error } = userData || {};
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (!data || data.role !== "admin") {
      navigate("/");
    }
  }, [data, loading, navigate]);

  if (loading) return <p>Checking permissions...</p>;
  if (data?.role !== "admin") return null;

  return (
    <AdminStatsProvider>
      <Outlet />
    </AdminStatsProvider>
  );
}
