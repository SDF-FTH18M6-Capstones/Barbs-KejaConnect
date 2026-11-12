import { useState } from "react";
import { Link } from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout";
import FormInput from "../../components/auth/FormInput";
import PasswordInput from "../../components/auth/PasswordInput";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });

    setMessage("");
  }
  function handleSubmit(event) {
    event.preventDefault();

    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }
    setMessage(
      "Frontend validation successful! Backend login is not connected yet.",
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Page heading */}
        <div>
          <h2 className="text-3xl font-bold">Log in</h2>

          <p className="mt-2 text-text-muted">
            Welcome back. Enter your details to continue.
          </p>
        </div>
        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormInput
            label="Email address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            error={errors.email}
          />
          <div>
            <PasswordInput
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />

            <div className="mt-2 text-right">
              <span className="text-sm text-text-muted">Forgot password?</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-white transition hover:bg-primary-dark"
          >
            Log in
          </button>
        </form>
        {/* Mock response */}
        {message && (
          <p className="rounded-lg bg-green-50 p-3 text-sm text-success">
            {message}
          </p>
        )}
        {/* Signup link */}
        <p className="text-center text-sm text-text-muted">
          New to KejaConnect?{" "}
          <Link
            to="/signup"
            className="font-semibold text-primary hover:underline"
          >
            Create an account
          </Link>
        </p>
        {/* Verification notice */}
        <div className="rounded-lg border border-border bg-bg p-4">
          <p className="text-sm text-text-muted">
            Haven't verified your email address yet?
          </p>

          <Link
            to="/verify-email"
            className="mt-1 inline-block text-sm font-semibold text-primary hover:underline"
          >
            Verify your email
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}