import AdminSidebar from "./AdminSidebar";

function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#F7F8F5]">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <main className="min-w-0 flex-1 p-8">{children}</main>
    </div>
  );
}

export default AdminLayout;
