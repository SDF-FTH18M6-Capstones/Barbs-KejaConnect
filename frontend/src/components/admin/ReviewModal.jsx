function ReviewModal({ poster, isOpen, onClose, onApprove, onReject }) {
  if (!isOpen || !poster) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-surface p-6 shadow-xl">
        {/* Modal heading */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Review application</h2>
            <p className="mt-1 text-sm text-text-muted">
              Verify the poster's submitted information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xl text-text-muted hover:text-foreground"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Poster information */}
        <div className="space-y-3 rounded-lg border border-border p-4">
          <div>
            <p className="text-xs text-text-muted">Full name</p>
            <p className="font-medium">{poster.name}</p>
          </div>

          <div>
            <p className="text-xs text-text-muted">Email</p>
            <p className="font-medium">{poster.email}</p>
          </div>

          <div>
            <p className="text-xs text-text-muted">Role</p>
            <p className="font-medium">{poster.role}</p>
          </div>

          <div>
            <p className="text-xs text-text-muted">Company</p>
            <p className="font-medium">{poster.company || "Not provided"}</p>
          </div>

          <div>
            <p className="text-xs text-text-muted">Submitted documents</p>
            <ul className="mt-1 list-inside list-disc text-sm">
              {poster.documents.map((document, index) => (
                <li key={`${document}-${index}`}>{document}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal actions */}
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-background"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onReject(poster)}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Reject
          </button>

          <button
            type="button"
            onClick={() => onApprove(poster)}
            className="rounded-lg bg-[#0E6B4E] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B563E]"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewModal;
