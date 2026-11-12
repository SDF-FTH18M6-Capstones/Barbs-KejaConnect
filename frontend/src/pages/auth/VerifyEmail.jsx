import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout";
import FormInput from "../../components/auth/FormInput";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();

  const initialStatus = searchParams.get("status") || "pending";

  const [status, setStatus] = useState(initialStatus);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

   function handleResend(event) {
    event.preventDefault();

    if (!email.trim()) {
      setError("Email address is required");
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    setStatus("sent");
  }

  return (
    <AuthLayout>
      <div className="space-y-6">

        {/* Pending verification */}
        {status === "pending" && (
          <div className="space-y-5 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
              ✉
            </div>

            <div>
              <h2 className="text-3xl font-bold">
                Verify your email address
              </h2>

              <p className="mt-3 leading-relaxed text-text-muted">
                We've sent a verification link to your email address.
                Please check your inbox and click the link to verify
                your account.
              </p>
            </div>
          </div>
        )}
        {/* Successful verification */}
        {status === "success" && (
          <div className="space-y-5 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-3xl">
              ✓
            </div>
           <div>
              <h2 className="text-3xl font-bold">
                Email verified!
              </h2>

              <p className="mt-3 text-text-muted">
                Your email address has been successfully verified.
                You can now log in to your KejaConnect account.
              </p>
            </div>
            <Link
              to="/login"
              className="inline-block w-full rounded-lg bg-primary px-4 py-3 font-semibold text-white transition hover:bg-primary-dark"
            >
              Continue to login
            </Link>
          </div>
        )}

        {/* Expired link */}
        {status === "expired" && (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">
              Verification link expired
            </h2>

            <p className="text-text-muted">
              Your verification link has expired. Enter your email
              address below to request a new one.
            </p>
          </div>
        )}
        
