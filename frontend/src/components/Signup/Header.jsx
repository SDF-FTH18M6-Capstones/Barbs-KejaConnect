import { Link } from "react-router-dom";
import Brand from "../Brand";

export default function SignupHeader() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Brand />
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
