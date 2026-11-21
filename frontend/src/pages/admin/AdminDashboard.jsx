import AdminLayout from "../../components/admin/AdminLayout";
import StatCard from "../../components/admin/StatCard";
import { mockAdminStats } from "../../data/mockAdminData";
import ApprovalPreview from "../../components/admin/ApprovalPreview";
import { useAdminStats } from "../../providers/AdminStatsProvider";

function AdminDashboard() {
  const { adminStatsData } = useAdminStats();
  const { listings, users, approvals, total_approved, loading, error } =
    adminStatsData;

  if (loading) {
    return <div>Loading admin stats..</div>;
  }
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page heading */}
        <div>
          <h1 className="text-3xl font-semibold">Platform overview</h1>
          <p className="text-text-muted mt-1">
            Monitor activity across KejaConnect.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Listings"
            value={listings.taken.total + listings.available.total}
            description={`${listings.available.total} available · ${listings.taken.total} taken`}
          />

          <StatCard
            title="Approved posters"
            value={total_approved}
            description={`Of ${users.managers.total + users.owners.total} registered`}
          />

          <StatCard
            title="Tenants"
            value={users.tenats.total}
            description="All emails confirmed"
          />

          <StatCard
            title="Inquiries sent"
            value="70"
            description="Last 10 days"
          />
        </div>

        {/* Approval queue preview */}
        <ApprovalPreview approvals={approvals} />
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
