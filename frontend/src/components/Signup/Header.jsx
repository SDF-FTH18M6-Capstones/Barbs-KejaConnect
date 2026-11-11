import { Link } from "react-router-dom";

export default function SignupHeader() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-text"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-text-on-primary">
            K
          </span>
          KejaConnect
        </Link>
        <p className="text-[15px] text-text-muted">
          Have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:text-primary-dark"
          >
            Log in
          </Link>
        </p>
      </div>
    </header>
  );
}
