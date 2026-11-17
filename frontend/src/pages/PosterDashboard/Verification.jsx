import { useRef, useState } from "react";
import PosterGate from "../../components/poster dashboard/PosterGate";
import Field from "../../components/poster dashboard/Field";
import LoadError from "../../components/poster dashboard/LoadError";
import useLoad from "../../components/poster dashboard/useLoad";
import {
  DOC_LABELS,
  MAX_FILE_MB,
  REQUIRED_DOCS,
  checkFile,
  latestByType,
} from "../../components/poster dashboard/data/documents";
import { getMyDocuments, uploadDocument } from "../../api/verification";
import { formatDate } from "../../components/inquiries/data/formart";

const BANNERS = {
  approved: {
    title: "Your account is approved",
    text: "You can create and manage listings. Tenants see a verified badge on them.",
    className: "bg-success/10 text-success",
  },
  pending: {
    title: "We're checking your documents",
    text: "An admin will review them, usually within 2 working days. You'll get an email when it's done.",
    className: "bg-accent/20 text-text-on-accent",
  },
  rejected: {
    title: "Your documents were not approved",
    text: "Read the reason below, then upload a clearer or correct document.",
    className: "bg-error/10 text-error",
  },
  not_required: {
    title: "Upload your documents to get approved",
    text: "An admin checks them before you can post listings.",
    className: "bg-accent/20 text-text-on-accent",
  },
};

const DOC_STATUS = {
  approved: { label: "Approved", className: "bg-success/10 text-success" },
  pending: {
    label: "In review",
    className: "bg-accent/20 text-text-on-accent",
  },
  rejected: { label: "Rejected", className: "bg-error/10 text-error" },
  missing: { label: "Not uploaded", className: "bg-border text-text-muted" },
};

function Badge({ status }) {
  const s = DOC_STATUS[status] ?? DOC_STATUS.pending;
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${s.className}`}
    >
      {s.label}
    </span>
  );
}

function VerificationContent({ user }) {
  const docs = useLoad(getMyDocuments);
  const fileInput = useRef(null);

  const required = REQUIRED_DOCS[user.role] ?? ["national_id"];
  const [docType, setDocType] = useState(required[0]);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState("");
  const [justUploaded, setJustUploaded] = useState(false);

  const status = justUploaded ? "pending" : user.approval_status;
  const banner = BANNERS[status] ?? BANNERS.not_required;
  const latest = latestByType(docs.data?.items);

  function chooseFile(e) {
    const chosen = e.target.files?.[0] ?? null;
    setFile(chosen);
    setFileError(chosen ? checkFile(chosen) : "");
    setUploaded("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const problem = checkFile(file);
    setFileError(problem);
    if (problem) return;

    setUploading(true);
    try {
      const { document } = await uploadDocument(docType, file);
      docs.setData((d) => ({
        ...d,
        items: [document, ...d.items],
        total: d.total + 1,
      }));
      setUploaded(`${DOC_LABELS[docType]} uploaded. An admin will review it.`);
      setJustUploaded(true);
      setFile(null);
      if (fileInput.current) fileInput.current.value = "";
    } catch (err) {
      setFileError(
        err.code === "INVALID_FILE"
          ? `Upload a JPG, PNG or PDF of ${MAX_FILE_MB} MB or less`
          : err.message || "Could not upload the file. Try again.",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold">Verification</h1>
        <p className="text-text-muted">
          We check every {user.role} before their listings go live, so tenants
          know the listings are real.
        </p>
      </div>

      <div
        role="status"
        className={`space-y-1 rounded-2xl p-5 ${banner.className}`}
      >
        <h2 className="text-lg font-semibold">{banner.title}</h2>
        <p>{banner.text}</p>
      </div>

      {docs.loading && (
        <div
          aria-busy="true"
          className="h-40 animate-pulse rounded-2xl bg-border"
        >
          <span className="sr-only">Loading your documents…</span>
        </div>
      )}
      {docs.error && <LoadError error={docs.error} onRetry={docs.retry} />}

      {docs.data && (
        <section className="space-y-3 rounded-2xl border border-border bg-surface p-5">
          <h2 className="text-lg font-semibold">Documents you need</h2>
          <ul className="divide-y divide-border">
            {required.map((type) => {
              const doc = latest[type];
              return (
                <li
                  key={type}
                  className="flex flex-wrap items-center justify-between gap-2 py-3"
                >
                  <div>
                    <p className="font-medium">{DOC_LABELS[type]}</p>
                    {doc && (
                      <p className="text-[13px] text-text-muted">
                        Uploaded {formatDate(doc.created_at)}
                        {doc.file_url && (
                          <>
                            {" · "}
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary hover:text-primary-dark"
                            >
                              View file
                            </a>
                          </>
                        )}
                      </p>
                    )}
                    {doc?.status === "rejected" && doc.rejection_reason && (
                      <p className="text-sm text-error">
                        Reason: {doc.rejection_reason}
                      </p>
                    )}
                  </div>
                  <Badge status={doc ? doc.status : "missing"} />
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-4 rounded-2xl border border-border bg-surface p-5"
      >
        <h2 className="text-lg font-semibold">Upload a document</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Document">
            {(props) => (
              <select
                {...props}
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
              >
                {required.map((type) => (
                  <option key={type} value={type}>
                    {DOC_LABELS[type]}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Field
            label="File"
            hint={`JPG, PNG or PDF, up to ${MAX_FILE_MB} MB`}
            error={fileError}
          >
            {(props) => (
              <input
                {...props}
                ref={fileInput}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={chooseFile}
                className={`${props.className} py-2 file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:font-medium file:text-primary-dark`}
              />
            )}
          </Field>
        </div>

        {uploaded && (
          <p
            role="status"
            className="rounded-lg bg-success/10 p-3 text-sm font-medium text-success"
          >
            {uploaded}
          </p>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="rounded-lg bg-primary px-6 py-3 font-medium text-text-on-primary hover:bg-primary-dark disabled:opacity-60"
        >
          {uploading ? "Uploading…" : "Upload"}
        </button>
      </form>
    </>
  );
}

export default function Verification() {
  return (
    <PosterGate>{(user) => <VerificationContent user={user} />}</PosterGate>
  );
}
