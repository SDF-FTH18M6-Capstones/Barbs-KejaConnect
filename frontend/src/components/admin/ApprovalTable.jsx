import { useState } from "react";
import ApprovalFilters from "./ApprovalFilters";
import StatusBadge from "./StatusBadge";
import ReviewModal from "./ReviewModal";
import RejectModal from "./RejectModal";

function ApprovalTable({ applications, setApplications }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");

  const [selectedPoster, setSelectedPoster] = useState(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  // Filter applications using the search and filter controls
  const filteredApplications = applications.filter((poster) => {
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

  // Open the review modal
  function handleReview(poster) {
    setSelectedPoster(poster);
    setIsReviewOpen(true);
  }

  // Approve an application
  function handleApprove(poster) {
    setApplications((currentApplications) =>
      currentApplications.map((application) =>
        application.id === poster.id
          ? { ...application, status: "approved" }
          : application,
      ),
    );

    setIsReviewOpen(false);
    setSelectedPoster(null);
  }

  // Open the rejection modal
  function handleStartReject(poster) {
    setIsReviewOpen(false);
    setSelectedPoster(poster);
    setIsRejectOpen(true);
  }

  // Save the rejection reason and update the application
  function handleConfirmReject(poster, reason) {
    setApplications((currentApplications) =>
      currentApplications.map((application) =>
        application.id === poster.id
          ? {
              ...application,
              status: "rejected",
              rejectionReason: reason,
            }
          : application,
      ),
    );

    setIsRejectOpen(false);
    setSelectedPoster(null);
  }

  // Close the review modal
  function handleCloseReview() {
    setIsReviewOpen(false);
    setSelectedPoster(null);
  }

  // Close the rejection modal
  function handleCloseReject() {
    setIsRejectOpen(false);
    setSelectedPoster(null);
  }

  return (
    <>
      <div className="space-y-4">
        <ApprovalFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
        />

        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="border-b border-border bg-background">
              <tr>
                <th className="px-5 py-4 font-medium">Poster</th>
                <th className="px-5 py-4 font-medium">Role</th>
                <th className="px-5 py-4 font-medium">Documents</th>
                <th className="px-5 py-4 font-medium">Submitted</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredApplications.length > 0 ? (
                filteredApplications.map((poster) => (
                  <tr
                    key={poster.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium">{poster.name}</p>
                      <p className="mt-1 text-text-muted">{poster.email}</p>
                    </td>

                    <td className="px-5 py-4">{poster.role}</td>

                    <td className="px-5 py-4">{poster.documents.join(", ")}</td>

                    <td className="px-5 py-4">{poster.submittedAt}</td>

                    <td className="px-5 py-4">
                      <StatusBadge status={poster.status} />
                    </td>

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => handleReview(poster)}
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
                    className="px-5 py-10 text-center text-text-muted"
                  >
                    No applications match your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review application modal */}
      <ReviewModal
        poster={selectedPoster}
        isOpen={isReviewOpen}
        onClose={handleCloseReview}
        onApprove={handleApprove}
        onReject={handleStartReject}
      />

      {/* Reject application modal */}
      <RejectModal
        poster={selectedPoster}
        isOpen={isRejectOpen}
        onClose={handleCloseReject}
        onConfirm={handleConfirmReject}
      />
    </>
  );
}

export default ApprovalTable;
