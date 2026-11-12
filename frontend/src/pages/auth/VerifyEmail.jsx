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