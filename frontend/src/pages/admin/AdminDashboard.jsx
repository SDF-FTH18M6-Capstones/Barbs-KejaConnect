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
      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        <StatCard
          title="Listings"
          value={stats.listings}
          description={`${stats.availableListings} available · ${stats.takenListings} taken`}
        />

        <StatCard
          title="Approved posters"
          value={stats.approvedPosters}
          description={`Of ${stats.registeredPosters} registered`}
        />

        <StatCard
          title="Tenants"
          value={stats.tenants}
          description="All emails confirmed"
        />

        <StatCard
          title="Inquiries sent"
          value={stats.inquiries}
          description="Last 10 days"
        />

      </div>