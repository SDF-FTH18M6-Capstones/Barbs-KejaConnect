import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[#F7F8F5]">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <main className="min-w-0 flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
