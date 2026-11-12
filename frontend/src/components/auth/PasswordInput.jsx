import { useState } from "react";
export default function PasswordInput({
  value,
  onChange,
  error,
})
{
  const [showPassword, setShowPassword] = useState(false);
  
  <div className="space-y-2">
      <label
        htmlFor="password"
        className="block text-sm font-medium text-text"
      >
        Password
      </label>

      <div className="relative">
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder="Enter your password"
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 pr-20 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        </div>

    </div>
  return ();}