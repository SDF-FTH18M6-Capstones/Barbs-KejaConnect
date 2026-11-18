import AdminHeader from "../../components/admin/AdminHeader";
import ApprovalTable from "../../components/admin/ApprovalTable";
import { mockAdminApplications } from "../../data/mockAdminData";

function AdminApprovalQueue() {
  const pendingCount = mockAdminApplications.filter(
    (poster) => poster.status === "pending",
  ).length;

  const approvedCount = mockAdminApplications.filter(
    (poster) => poster.status === "approved",
  ).length;

  const rejectedCount = mockAdminApplications.filter(
    (poster) => poster.status === "rejected",
  ).length;

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <AdminHeader
        title="Approval queue"
        description="Review and manage poster verification applications."
      />

      {/* Application summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-sm text-text-muted">Pending</p>
          <h2 className="mt-2 text-2xl font-semibold text-amber-600">
            {pendingCount}
          </h2>
          <p className="mt-1 text-xs text-text-muted">Awaiting review</p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-sm text-text-muted">Approved</p>
          <h2 className="mt-2 text-2xl font-semibold text-green-700">
            {approvedCount}
          </h2>
          <p className="mt-1 text-xs text-text-muted">Successfully verified</p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-sm text-text-muted">Rejected</p>
          <h2 className="mt-2 text-2xl font-semibold text-red-600">
            {rejectedCount}
          </h2>
          <p className="mt-1 text-xs text-text-muted">Applications declined</p>
        </div>
      </div>

      {/* Applications and filters */}
      <ApprovalTable />
    </div>
  );
}

export default AdminApprovalQueue;
