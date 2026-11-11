export async function registerUser(form, role) {
  const res = await fetch("/api/v1/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      full_name: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.replace(/\s/g, ""),
      password: form.password,
      role,
      company_name: form.company.trim() || undefined,
      area: form.area || undefined,
    }),
  });

  const data = await res.json().catch(() => ({}));
  // Errors follow the agreed shape { error, code, details }
  if (!res.ok)
    throw new Error(data.error || "Could not create your account. Try again.");
  return data;
}
