import { useState } from "react";

import { mockPendingApprovals } from "../../data/mockAdminData";

function AdminApprovalQueue() {
  const [applications, setApplications] = useState(
    mockPendingApprovals
  );
  const [activeTab, setActiveTab] = useState("pending");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");

  const filteredApplications = applications.filter((poster) => {
    const matchesTab =
      activeTab === "all" || poster.status === activeTab;
    const matchesSearch = [
      poster.name,
      poster.email,
      poster.company,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesRole =
      role === "all" || poster.role.toLowerCase() === role;

    return matchesTab && matchesSearch && matchesRole;
  });
