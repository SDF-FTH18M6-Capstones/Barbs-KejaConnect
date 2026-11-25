function AdminHeader({ title, description, children }) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-[#16211C]">{title}</h1>

        <p className="mt-1 text-sm text-[#56625B]">{description}</p>
      </div>

      {/* Optional actions */}
      <div>{children}</div>
    </div>
  );
}

export default AdminHeader;
