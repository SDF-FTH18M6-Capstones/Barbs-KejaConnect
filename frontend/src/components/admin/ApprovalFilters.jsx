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