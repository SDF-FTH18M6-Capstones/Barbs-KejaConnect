import { Link } from "react-router-dom";
import PosterLayout from "./PosterLayout";
import { getCurrentUser } from "../inquiries/data/currentUser";

const isPoster = (user) => user?.role === "manager" || user?.role === "owner";

function Notice({ title, children }) {
  return (
    <div className="grid min-h-screen place-items-center bg-bg p-4 text-text">
      <div className="max-w-md space-y-3 rounded-2xl border border-border bg-surface p-6 text-center">
        <h1 className="text-xl font-semibold">{title}</h1>
        {children}
      </div>
    </div>
  );
}

export default function PosterGate({ needsAproval = false, children }) {
  const user = getCurrentUser();

  if (!isPoster(user)) {
    return (
      <Notice title="This Page is for propoerty Managers and Owners only.">
        <p className="text-text-muted">
          {user
            ? "Your account is a tenant account."
            : "Login with a property manager or owner account to access this page."}
        </p>
        <Link
          to={user ? "/" : "/login"}
          className="inline-block rounded-lg bg-primary px-5 py-2.5 font-medium text-text-on-primary hover:bg-primary-dark"
        >
          {user ? "Browse Listings" : "Log in"}
        </Link>
      </Notice>
    );
  }

  const approved = user.approval_status === "approved";

  return (
    <PosterLayout user={user}>
      {needsAproval && !approved ? (
        <div className="space-y-2 rounded-2xl bg-accent/20 p-5 text-text-on-accent">
          <h1 className="text-xl font-semibold">
            {user.approval_status === "rejected"
              ? "Your documents were not approved"
              : "Your account is waiting for approval"}
          </h1>
          <p>
            You can create and manage listings once an admin has approved your
            documents.
          </p>
          <Link to="/dashboard/verification" className="font-medium underline">
            Go to verification
          </Link>
        </div>
      ) : typeof children === "function" ? (
        children(user)
      ) : (
        children
      )}
    </PosterLayout>
  );
}
