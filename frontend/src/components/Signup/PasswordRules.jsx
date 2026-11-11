import { passwordChecks } from "../../data/signupValidation";

export default function PasswordRules({ password }) {
  return (
    <ul
      aria-label="Password rules"
      className="-mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px]"
    >
      {passwordChecks(password).map((rule) => (
        <li
          key={rule.label}
          className={rule.ok ? "text-success" : "text-error"}
        >
          <span aria-hidden="true">{rule.ok ? "✓" : "✕"}</span> {rule.label}
        </li>
      ))}
    </ul>
  );
}
