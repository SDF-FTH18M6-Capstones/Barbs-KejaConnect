import { useState } from "react";

function RejectModal({ poster, isOpen, onClose, onConfirm }) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  if (!isOpen || !poster) {
    return null;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedReason = reason.trim();

    // Validate rejection reason
    if (!trimmedReason) {
      setError("Please provide a reason for rejecting this application.");
      return;
    }

    // Send poster and rejection reason to parent
    onConfirm(poster, trimmedReason);

    // Reset form
    setReason("");
    setError("");
  }

  function handleClose() {
    setReason("");
    setError("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-surface p-6 shadow-xl">
        {/* Modal heading */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Reject application</h2>

            <p className="mt-1 text-sm text-text-muted">
              Provide a reason for rejecting this application.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="text-xl text-text-muted hover:text-foreground"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Poster information */}
        <div className="mb-5 rounded-lg border border-border bg-background p-4">
          <p className="text-xs text-text-muted">Applicant</p>
          <p className="font-medium">{poster.name}</p>
          <p className="mt-1 text-sm text-text-muted">{poster.email}</p>
        </div>

        {/* Rejection reason form */}
        <form onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="rejection-reason"
              className="mb-2 block text-sm font-medium"
            >
              Reason for rejection
              <span className="ml-1 text-red-600">*</span>
            </label>

            <textarea
              id="rejection-reason"
              rows="4"
              value={reason}
              onChange={(event) => {
                setReason(event.target.value);
                setError("");
              }}
              placeholder="Explain why this application is being rejected..."
              className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-[#0E6B4E]"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "rejection-error" : undefined}
            />

            {error && (
              <p id="rejection-error" className="mt-2 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>

          {/* Modal actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-background"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Confirm rejection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RejectModal;
