import { useState } from "react";
import Field from "./Field";
import PasswordRules from "./PasswordRules";
import { ROLES } from "../../components/Signup/data/signupRoles";
import { validateSignup } from "../../components/Signup/data/signupValidation";
import { toSignupBody } from "../../components/Signup/data/signupApi";
import { useAuth } from "../../providers/AuthProvider";

const EMPTY = {
  fullName: "",
  phone: "",
  email: "",
  password: "",
  confirm: "",
  agree: false,
};

export default function Form({ roleId }) {
  const role = ROLES[roleId];
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const { userData, signupUser } = useAuth();
  const { loading, error } = userData;

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    setErrors({ ...errors, [name]: undefined });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const found = validateSignup(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    signupUser(toSignupBody(form, roleId));
  }

  // Shared props for each input
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
      className="space-y-5 rounded-2xl border border-border bg-surface p-6 sm:p-7"
    >
      <h2 className="text-xl font-semibold text-text">Your details</h2>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-error/10 p-3 text-sm text-error"
        >
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" autoComplete="name" {...field("fullName")} />
        <Field
          label="Phone"
          type="tel"
          autoComplete="tel"
          placeholder="0712 345 678"
          {...field("phone")}
        />
      </div>

      <Field
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="name@example.com"
        hint="We'll send a confirmation link here."
        {...field("email")}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Password"
          type="password"
          autoComplete="new-password"
          {...field("password")}
        />
        <Field
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          {...field("confirm")}
        />
      </div>
      <PasswordRules password={form.password} />

      <div>
        <label className="flex items-start gap-2.5 text-sm leading-relaxed text-text-muted">
          <input
            type="checkbox"
            name="agree"
            checked={form.agree}
            onChange={handleChange}
            className="mt-1 size-4 shrink-0 accent-primary"
          />
          {role.consent}
        </label>
        {errors.agree && (
          <p className="mt-1.5 text-[13px] text-error">{errors.agree}</p>
        )}
      </div>

      <button
        disabled={loading}
        className="min-h-11 w-full rounded-lg bg-primary py-3 font-medium text-text-on-primary hover:bg-primary-dark disabled:opacity-70"
      >
        {loading ? "Creating account…" : role.button}
      </button>
    </form>
  );
}
