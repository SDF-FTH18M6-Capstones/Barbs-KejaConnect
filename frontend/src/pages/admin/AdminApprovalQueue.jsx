import { useState } from "react";

import { mockPendingApprovals } from "../../data/mockAdminData";

function AdminApprovalQueue() {
  const [applications, setApplications] = useState(mockPendingApprovals);
  const [activeTab, setActiveTab] = useState("pending");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");

  const filteredApplications = applications.filter((poster) => {
    const matchesTab = activeTab === "all" || poster.status === activeTab;
    const matchesSearch = [poster.name, poster.email, poster.company]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesRole = role === "all" || poster.role.toLowerCase() === role;

    return matchesTab && matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Posters</h1>
        <p className="text-text-muted mt-1">
          Review proof from managers and owners.
        </p>
      </div>
      {/* Status tabs */}
      <div className="flex flex-wrap gap-2">
        {["pending", "approved", "rejected", "all"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg capitalize ${
              activeTab === tab
                ? "bg-primary text-white"
                : "bg-surface border border-border"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* Search and role filter */}
      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Name, email or company"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-border rounded-lg p-3 flex-1"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border border-border rounded-lg p-3"
        >
          <option value="all">All roles</option>
          <option value="manager">Manager</option>
          <option value="owner">Owner</option>
        </select>
      </div>
      {/* Application results */}
      <div className="bg-surface border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr>
              <th className="p-4">Poster</th>
              <th className="p-4">Role</th>
              <th className="p-4">Documents</th>
              <th className="p-4">Submitted</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredApplications.map((poster) => (
              <tr key={poster.id} className="border-t border-border">
                <td className="p-4">
                  <div className="font-medium">{poster.name}</div>
                  <div className="text-text-muted">{poster.email}</div>
                </td>

                <td className="p-4">{poster.role}</td>

                <td className="p-4">{poster.documents.join(", ")}</td>

                <td className="p-4">{poster.submittedAt}</td>

                <td className="p-4 capitalize">{poster.status}</td>

                <td className="p-4">
                  <button className="text-primary font-medium">Review</button>
                </td>
              </tr>
            ))}
            {filteredApplications.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center">
                  No applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminApprovalQueue;
