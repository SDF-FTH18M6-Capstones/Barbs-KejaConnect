import { mockAdminApplications } from "../../data/mockAdminData";
import StatusBadge from "../../components/admin/StatusBadge";

function PosterReview() {
  // For now, display the first pending application
  const poster = mockAdminApplications.find(
    (application) => application.status === "pending",
  );

  if (!poster) {
    return <p>No pending applications available.</p>;
  }

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-3xl font-semibold text-[#16211C]">
          Review application
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Review the poster's details and submitted verification documents.
        </p>
      </div>

      {/* Poster information */}
      <section className="rounded-xl border border-border bg-surface p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Poster information</h2>
          <StatusBadge status={poster.status} />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <p className="text-sm text-text-muted">Full name</p>
            <p className="mt-1 font-medium">{poster.name}</p>
          </div>

          <div>
            <p className="text-sm text-text-muted">Email address</p>
            <p className="mt-1 font-medium">{poster.email}</p>
          </div>

          <div>
            <p className="text-sm text-text-muted">Poster role</p>
            <p className="mt-1 font-medium">{poster.role}</p>
          </div>

          <div>
            <p className="text-sm text-text-muted">Company</p>
            <p className="mt-1 font-medium">
              {poster.company || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-sm text-text-muted">Date submitted</p>
            <p className="mt-1 font-medium">{poster.submittedAt}</p>
          </div>
        </div>
      </section>

      {/* Submitted documents */}
      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-4 text-lg font-semibold">Submitted documents</h2>

        <div className="space-y-3">
          {poster.documentFiles?.length > 0 ? (
            poster.documentFiles.map((document) => (
              <div
                key={document.id}
                className="flex flex-col justify-between gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <p className="font-medium">{document.name}</p>
                  <p className="mt-1 text-xs text-text-muted">
                    {document.fileName}
                  </p>
                </div>

                {document.url ? (
                  <a
                    href={document.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-[#0E6B4E] hover:underline"
                  >
                    View document
                  </a>
                ) : (
                  <span className="text-xs text-text-muted">
                    Preview unavailable (mock file)
                  </span>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-text-muted">
              No document file details available.
            </p>
          )}
        </div>
      </section>

      {/* Review actions */}
      <section className="flex flex-wrap justify-end gap-3">
        <button
          type="button"
          className="rounded-lg border border-red-200 px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Reject application
        </button>

        <button
          type="button"
          className="rounded-lg bg-[#0E6B4E] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0B563E]"
        >
          Approve application
        </button>
      </section>
    </div>
  );
}

export default PosterReview;
