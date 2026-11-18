import { mockAdminApplications } from "../../data/mockAdminData";
import StatusBadge from "./StatusBadge";
import ApprovalFilters from "./ApprovalFilters";
import { useState } from "react";

function ApprovalTable() {
  // Store the values selected by the admin
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");

  // Filter applications based on the selected filters
  const filteredApplications = mockAdminApplications.filter((poster) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      poster.name.toLowerCase().includes(search) ||
      poster.email.toLowerCase().includes(search) ||
      (poster.company || "").toLowerCase().includes(search);

    const matchesStatus =
      selectedStatus === "all" || poster.status === selectedStatus;

    const matchesRole = selectedRole === "all" || poster.role === selectedRole;

    return matchesSearch && matchesStatus && matchesRole;
  });

  return (
    <div className="space-y-5">
      {/* Filters */}
      <ApprovalFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
      />

      {/* Results count */}
      <p className="text-sm text-text-muted">
        Showing {filteredApplications.length} of {mockAdminApplications.length}{" "}
        applications
      </p>

      {/* Applications table */}
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
            {filteredApplications.length > 0 ? (
              filteredApplications.map((poster) => (
                <tr key={poster.id} className="hover:bg-background/60">
                  <td className="px-5 py-4">
                    <p className="font-medium">{poster.name}</p>
                    <p className="mt-1 text-xs text-text-muted">
                      {poster.email}
                    </p>
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
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-5 py-8 text-center text-text-muted"
                >
                  No applications match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ApprovalTable;
