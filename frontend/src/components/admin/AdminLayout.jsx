import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[#F7F8F5]">
      <AdminSidebar />
      <main className="min-w-0 flex-1 px-8 py-8">
        <div className="mx-auto max-w-5xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
