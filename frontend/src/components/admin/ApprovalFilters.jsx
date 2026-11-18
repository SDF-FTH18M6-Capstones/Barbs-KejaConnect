function ApprovalFilters({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedRole,
  onRoleChange,
}) {
    return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5">
      {/* Search */}
      <div>
        <label
          htmlFor="poster-search"
          className="mb-2 block text-sm font-medium"
        >
          Search posters
        </label>

        <input
          id="poster-search"
          type="text"
          placeholder="Search by name, email or company..."
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none focus:border-[#0E6B4E]"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Status filter */}
        <div>
          <label
            htmlFor="status-filter"
            className="mb-2 block text-sm font-medium"
          >
            Application status
          </label>

          <select
            id="status-filter"
            value={selectedStatus}
            onChange={(event) => onStatusChange(event.target.value)}
            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none focus:border-[#0E6B4E]"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>