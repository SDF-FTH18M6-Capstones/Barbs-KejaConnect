import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import StatCard from "../../components/admin/StatCard";
import ApprovalPreview from "../../components/admin/ApprovalPreview";
import ListingsByArea from "../../components/admin/ListingsByArea";
import RecentDecisions from "../../components/admin/RecentDecisions";
import { mockAdminStats, mockPendingApprovals } from "../../data/mockAdminData";

const areas = [
  { name: "Kilimani", count: 3 },
  { name: "Westlands", count: 3 },
  { name: "Kileleshwa", count: 2 },
  { name: "Lavington", count: 2 },
  { name: "Karen", count: 2 },
  { name: "Ruaka", count: 2 },
];

const initialDecisions = [
  {
    id: 1,
    name: "Dennis Kiprop",
    note: "Unsigned management agreement",
    date: "6 Nov 2026",
    status: "rejected",
  },
  {
    id: 2,
    name: "Peter Kamau",
    note: "Eastlands Lettings",
    date: "4 Nov 2026",
    status: "approved",
  },
  {
    id: 3,
    name: "Aisha Hassan",
    note: "Owner",
    date: "2 Nov 2026",
    status: "approved",
  },
];

function AdminDashboard() {
  const stats = mockAdminStats;
  const [pending, setPending] = useState(mockPendingApprovals);
  const [decisions, setDecisions] = useState(initialDecisions);

  // Approve/Reject: remove from the queue and add to recent decisions
  function handleDecision(poster, status) {
    setPending((list) => list.filter((p) => p.id !== poster.id));
    setDecisions((list) =>
      [
        {
          id: `d-${poster.id}`,
          name: poster.name,
          note: poster.company || poster.role,
          date: "Today",
          status,
        },
        ...list,
      ].slice(0, 3),
    );
  }

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="mb-2">
          <h1 className="text-3xl font-semibold text-[#16211C]">
            Platform overview
          </h1>
          <p className="mt-1 text-sm text-[#56625B]">
            Updated just now · {today}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Listings"
            value={stats.listings}
            description={`${stats.availableListings} available · ${stats.takenListings} taken`}
          />
          <StatCard
            title="Approved posters"
            value={stats.approvedPosters}
            description={`of ${stats.registeredPosters} registered`}
          />
          <StatCard
            title="Tenants"
            value={stats.tenants}
            description="all emails confirmed"
          />
          <StatCard
            title="Inquiries sent"
            value={stats.inquiries}
            description="last 10 days"
          />
        </div>

        <ApprovalPreview approvals={pending} onDecision={handleDecision} />

        <div className="grid gap-4 lg:grid-cols-2">
          <ListingsByArea areas={areas} totalAreas={20} />
          <RecentDecisions decisions={decisions} />
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
