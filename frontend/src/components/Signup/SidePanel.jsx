const CIRCLE = {
  now: "bg-primary text-text-on-primary",
  next: "bg-border text-text",
};

function FileIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 shrink-0"
    >
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M14 3v5h5" />
    </svg>
  );
}

export default function SidePanel({ role }) {
  const { side } = role;

  return (
    <aside className="space-y-4">
      <section className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="mb-4 text-lg font-semibold text-text">
          What happens next
        </h2>
        <ol className="space-y-4">
          {role.steps.map((step, i) => (
            <li key={step.title} className="flex items-start gap-3">
              <span
                className={`grid size-7 shrink-0 place-items-center rounded-full text-sm font-semibold ${CIRCLE[step.state]}`}
              >
                {i + 1}
              </span>
              <div>
                <p className="text-[15px] font-semibold text-text">
                  {step.title}
                </p>
                <p className="text-sm leading-relaxed text-text-muted">
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {side.type === "documents" ? (
        <section className="rounded-2xl border border-primary/20 bg-primary/10 p-5 text-primary-dark">
          <h2 className="mb-3 text-lg font-semibold">{side.title}</h2>
          <ul className="space-y-2.5 text-sm leading-relaxed">
            {side.items.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <FileIcon />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[13px]">{side.note}</p>
        </section>
      ) : (
        <section className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="mb-2 text-lg font-semibold text-text">{side.title}</h2>
          <p className="text-sm leading-relaxed text-text-muted">{side.text}</p>
        </section>
      )}
    </aside>
  );
}
