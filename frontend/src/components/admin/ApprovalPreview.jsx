function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function ApprovalPreview({ approvals = [], onDecision }) {
  return (
    <section className="rounded-xl border border-[#E1E5E0] bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#16211C]">
          Approval queue
        </h2>
        <span className="text-xs text-[#56625B]">Oldest first</span>
      </div>

      {approvals.length === 0 && (
        <p className="text-sm text-[#56625B]">No pending approvals.</p>
      )}

      <div className="space-y-3">
        {approvals.map((poster) => (
          <div
            key={poster.id}
            className="rounded-lg border border-[#E1E5E0] p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F6E3B4] text-xs font-semibold text-[#6B4405]">
                  {initials(poster.name)}
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-semibold text-[#16211C]">
                      {poster.name}
                    </span>
                    <span className="text-[#56625B]">
                      {" · "}
                      {poster.role}
                      {poster.company && `, ${poster.company}`}
                    </span>
                  </p>
                  <p className="text-xs text-[#56625B]">
                    {poster.email} · submitted {poster.submittedAt}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onDecision?.(poster, "rejected")}
                  className="rounded-md border border-[#CBD2CC] px-4 py-1.5 text-sm text-[#16211C] hover:bg-gray-50"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => onDecision?.(poster, "approved")}
                  className="rounded-md bg-[#0E6B4E] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#0B563E]"
                >
                  Approve
                </button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 pl-12">
              {poster.documents.map((doc) => (
                <span
                  key={doc}
                  className="rounded-md border border-[#E1E5E0] px-3 py-1.5 text-xs text-[#0E6B4E]"
                >
                  {doc} (PDF)
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ApprovalPreview;
