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