import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminHeader from "../../components/admin/AdminHeader";
import ApprovalTable from "../../components/admin/ApprovalTable";
import { mockAdminApplications } from "../../data/mockAdminData";

function AdminApprovalQueue() {
  const [applications, setApplications] = useState(mockAdminApplications);

  const pendingCount = applications.filter(
    (poster) => poster.status === "pending",
  ).length;

  const approvedCount = applications.filter(
    (poster) => poster.status === "approved",
  ).length;

  const rejectedCount = applications.filter(
    (poster) => poster.status === "rejected",
  ).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminHeader
          title="Approval queue"
          description="Review and manage poster verification applications."
        />

        {/* Application status summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-surface p-5">
            <p className="text-sm text-text-muted">Pending</p>
            <h2 className="mt-2 text-2xl font-semibold">{pendingCount}</h2>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <p className="text-sm text-text-muted">Approved</p>
            <h2 className="mt-2 text-2xl font-semibold">{approvedCount}</h2>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <p className="text-sm text-text-muted">Rejected</p>
            <h2 className="mt-2 text-2xl font-semibold">{rejectedCount}</h2>
          </div>
        </div>

        {/* Applications table */}
        <ApprovalTable
          applications={applications}
          setApplications={setApplications}
        />
      </div>
    </AdminLayout>
  );
}

export default AdminApprovalQueue;
