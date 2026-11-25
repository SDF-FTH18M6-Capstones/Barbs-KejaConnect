export function toSignupBody(form, role) {
  return {
    full_name: form.fullName.trim(),
    email: form.email.trim().toLowerCase(),
    phone: form.phone.replace(/\s/g, ""),
    password: form.password,
    role,
  };
}
