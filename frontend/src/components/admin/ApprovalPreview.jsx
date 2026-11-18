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

      <div className="space-y-4">
        {mockPendingApprovals.map((poster) => (
          <div
            key={poster.id}
            className="flex flex-col justify-between gap-4 border-b border-[#E1E5E0] pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center"
          >
            <div>
              <h3 className="font-medium text-[#16211C]">{poster.name}</h3>

              <p className="mt-1 text-sm text-[#56625B]">{poster.email}</p>

              <p className="mt-1 text-xs text-[#7A857E]">
                {poster.role}
                {poster.company && ` · ${poster.company}`}
              </p>

              <p className="mt-2 text-xs text-[#7A857E]">
                Documents: {poster.documents.join(", ")}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <StatusBadge status={poster.status} />

              <button
                type="button"
                className="rounded-lg bg-[#0E6B4E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0B563E]"
              >
                Review
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ApprovalPreview;
