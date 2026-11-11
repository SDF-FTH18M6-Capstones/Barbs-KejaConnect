import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto max-w-5xl items-center py-4 justify-between py-3">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-text"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-text-on-primary">
            K
          </span>
          KejaConnect
        </Link>
      </div>
    </header>
  );
}
