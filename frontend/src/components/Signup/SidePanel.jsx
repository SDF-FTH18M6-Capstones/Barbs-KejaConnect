export default function SidePanel({ role }) {
  return (
    <aside className="space-y-4">
      <div className="rounded-2xl border border-border p-5 bg-surface">
        <h2 className="text-lg font-semibold text-text">What happens next?</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-text-muted">
          {role.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>

      {role.documents && (
        <div className="rounded-2xl bg-primary/10 p-5 text-primary-dark">
          <h2 className="mb-3 text-lg font-semibold">
            Have these documents ready
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {role.documents.map((doc) => (
              <li key={doc}>{doc}</li>
            ))}
            <li>PDF, JPG or PNG, up to 5MB each</li>
          </ul>
        </div>
      )}
    </aside>
  );
}
