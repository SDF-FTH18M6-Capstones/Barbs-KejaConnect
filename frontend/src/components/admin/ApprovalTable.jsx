import { mockAdminApplications } from "../../data/mockAdminData";
import StatusBadge from "./StatusBadge";

function ApprovalTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-background">
          <tr>
            <th className="px-5 py-4 font-semibold">Poster</th>
            <th className="px-5 py-4 font-semibold">Role</th>
            <th className="px-5 py-4 font-semibold">Documents</th>
            <th className="px-5 py-4 font-semibold">Submitted</th>
            <th className="px-5 py-4 font-semibold">Status</th>
            <th className="px-5 py-4 font-semibold">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {mockAdminApplications.map((poster) => (
            <tr key={poster.id} className="hover:bg-background/60">
              <td className="px-5 py-4">
                <p className="font-medium">{poster.name}</p>
                <p className="mt-1 text-xs text-text-muted">{poster.email}</p>
                {poster.company && (
                  <p className="mt-1 text-xs text-text-muted">
                    {poster.company}
                  </p>
                )}
              </td>

              <td className="px-5 py-4">{poster.role}</td>

              <td className="px-5 py-4">{poster.documents.join(", ")}</td>

              <td className="px-5 py-4 text-text-muted">
                {poster.submittedAt}
              </td>

              <td className="px-5 py-4">
                <StatusBadge status={poster.status} />
              </td>

              <td className="px-5 py-4">
                <button
                  type="button"
                  className="font-medium text-[#0E6B4E] hover:underline"
                >
                  Review
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ApprovalTable;
