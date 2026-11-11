import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Field from "./Field";
import { ROLES, AREAS } from "./data/signupRoles";
import { validateSignup } from "./data/signupValidation";
import { registerUser } from "./data/signupApi";

const EMPTY = {
  fullName: "",
  phone: "",
  email: "",
  company: "",
  area: "",
  password: "",
  confirm: "",
  agree: false,
};

export default function Form({ roleId }) {
  const role = ROLES[roleId];
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    setErrors({ ...errors, [name]: undefined });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const found = validateSignup(form, role);
    setErrors(found);
    if (Object.keys(found).length) return;

    setLoading(true);
    setServerError("");
    try {
      await registerUser(form, roleId);
      navigate("/verify-email", { state: { email: form.email } });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const field = (name) => ({
    name,
    value: form[name],
    onChange: handleChange,
    error: errors[name],
  });

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-4 rounded-2xl border border-border bg-surface p-6"
    >
      {serverError && (
        <p className="rounded-lg bg-error/10 p-3 text-sm text-error">
          {serverError}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" {...field("fullName")} />
        <Field
          label="Phone"
          type="tel"
          placeholder="0712 345 678"
          {...field("phone")}
        />
      </div>

      <Field
        label="Email"
        type="email"
        placeholder="name@example.com"
        {...field("email")}
      />

      {role.showCompany && (
        <Field label="Company name (optional)" {...field("company")} />
      )}
      {role.areaLabel && (
        <Field label={role.areaLabel} options={AREAS} {...field("area")} />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Password" type="password" {...field("password")} />
        <Field label="Confirm password" type="password" {...field("confirm")} />
      </div>

      <label className="flex gap-2 text-sm text-text-muted">
        <input
          type="checkbox"
          name="agree"
          checked={form.agree}
          onChange={handleChange}
          className="accent-primary"
        />
        I agree to the terms of use and listing rules.
      </label>
      {errors.agree && <p className="text-sm text-error">{errors.agree}</p>}

      <button
        disabled={loading}
        className="w-full rounded-lg bg-primary py-3 font-medium text-text-on-primary hover:bg-primary-dark disabled:opacity-70"
      >
        {loading ? "Creating account…" : role.button}
      </button>

      <p className="text-center text-sm text-text-muted">
        Have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-primary hover:text-primary-dark"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
