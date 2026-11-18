import StatCard from "../../components/admin/StatCard";
import { mockAdminStats, mockPendingApprovals } from "../../data/mockAdminData";
function AdminDashboard() {
  const stats = mockAdminStats;

  return (
    <div className="space-y-6">

      {/* Page heading */}
      <div>
        <h1 className="text-3xl font-semibold">
          Platform overview
        </h1>
        <p className="text-text-muted mt-1">
          Monitor activity across KejaConnect.
        </p>
      </div>