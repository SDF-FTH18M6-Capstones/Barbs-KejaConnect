import { mockPendingApprovals } from "../../data/mockAdminData";
import StatusBadge from "./StatusBadge";
function ApprovalPreview() {
  return (
    <section className="rounded-xl border border-[#E1E5E0] bg-white p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#16211C]">
            Pending Approvals
          </h2>
          <p className="mt-1 text-sm text-[#56625B]">
            Review poster applications awaiting approval.
          </p>
        </div>

        <span className="rounded-full bg-[#FFF3D6] px-3 py-1 text-sm font-medium text-[#946200]">
          {mockPendingApprovals.length} Pending
        </span>
      </div>
