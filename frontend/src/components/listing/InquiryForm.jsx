import { useState } from "react";
import { Link } from "react-router-dom";
import { createInquiry } from "../../api/inquiries";
import { getToken } from "../../api/client";
import { USE_MOCKS } from "../../api/config";
import { ROUTES } from "../../paths";

const MIN = 10;
const MAX = 1000;
const DEFAULT_MESSAGE =
  "Hello, is this unit still available? I would like to view it this weekend.";

const ERRORS = {
  VALIDATION_ERROR: `Your message must be between ${MIN} and ${MAX} characters.`,
  FORBIDDEN:
    "Only tenant accounts can send inquiries. Log in with a tenant account to continue.",
  NOT_FOUND: "This listing is no longer available.",
  NETWORK_ERROR: "Can't reach the server. Check your connection and try again.",
  SERVER_ERROR: "Something went wrong on our side. Try again in a moment.",
};

const box = "rounded-[14px] border border-line bg-white p-5";

export default function InquiryForm({ listing }) {
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const [errorCode, setErrorCode] = useState(null);

  if (listing.status !== "available") {
    return (
      <div className={box}>
        <h2 className="font-display text-lg font-semibold">
          This unit has been taken
        </h2>
        <p className="mt-2 text-[15px] text-muted">
          The poster is no longer accepting inquiries for it.
        </p>
        <Link
          to={ROUTES.listings}
          className="mt-3 inline-block font-medium text-brand no-underline hover:text-brand-dark"
        >
          Browse other listings
        </Link>
      </div>
    );
  }

  if (!getToken() && !USE_MOCKS) {
    return (
      <div className={box}>
        <h2 className="font-display text-lg font-semibold">
          Ask about this unit
        </h2>
        <p className="mt-2 text-[15px] text-muted">
          Log in or sign up as a tenant to message the poster.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to={ROUTES.login}
            className="inline-flex min-h-11 items-center justify-center rounded-[10px] border border-brand bg-brand px-[18px] font-medium text-white no-underline hover:bg-brand-dark"
          >
            Log in
          </Link>
          <Link
            to={ROUTES.register}
            className="inline-flex min-h-11 items-center justify-center rounded-[10px] border border-line-strong bg-white px-[18px] font-medium text-ink no-underline hover:bg-canvas"
          >
            Sign up
          </Link>
        </div>
      </div>
    );
  }

  if (status === "sent") {
    return (
      <div className={box} role="status">
        <h2 className="font-display text-lg font-semibold">Inquiry sent</h2>
        <p className="mt-2 text-[15px] text-muted">
          The poster will get your message and the contact details on your
          account.
        </p>
      </div>
    );
  }

  const len = message.trim().length;
  const valid = len >= MIN && len <= MAX;

  const submit = async (e) => {
    e.preventDefault();
    if (!valid || status === "sending") return;
    setStatus("sending");
    setErrorCode(null);
    try {
      await createInquiry(listing.id, message.trim());
      setStatus("sent");
    } catch (err) {
      setErrorCode(err.code ?? "SERVER_ERROR");
      setStatus("idle");
    }
  };

  return (
    <form onSubmit={submit} className={box} noValidate>
      <h2 className="font-display text-lg font-semibold">
        Ask about this unit
      </h2>
      <label
        htmlFor="inq-message"
        className="mb-1.5 mt-4 block text-sm font-medium"
      >
        Message
      </label>
      <textarea
        id="inq-message"
        rows={5}
        maxLength={MAX}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full rounded-[10px] border border-line-strong bg-white px-3 py-2.5 text-[15px] text-ink focus:outline-2 focus:outline-offset-2 focus:outline-brand"
      />
      <div className="mt-1 flex justify-between text-[13px] text-muted">
        <span>{len < MIN ? `At least ${MIN} characters` : ""}</span>
        <span>
          {len} / {MAX}
        </span>
      </div>

      {errorCode && (
        <p role="alert" className="mt-3 text-[15px] text-ink">
          {ERRORS[errorCode] ?? ERRORS.SERVER_ERROR}
        </p>
      )}

      <button
        type="submit"
        disabled={!valid || status === "sending"}
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-[10px] border border-brand bg-brand px-[18px] font-medium text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : "Send inquiry"}
      </button>
    </form>
  );
} 