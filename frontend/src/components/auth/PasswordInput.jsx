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
    </div>
  return ();}