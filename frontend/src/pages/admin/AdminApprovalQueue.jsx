import { useState } from "react";

import { mockPendingApprovals } from "../../data/mockAdminData";

function AdminApprovalQueue() {
  const [applications, setApplications] = useState(
    mockPendingApprovals
  );