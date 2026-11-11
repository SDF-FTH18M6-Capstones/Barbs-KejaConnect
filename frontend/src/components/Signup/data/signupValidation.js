export function passwordChecks(password) {
  return [
    { label: "8 or more characters", ok: password.length >= 8 },
    { label: "a letter", ok: /[A-Za-z]/.test(password) },
    { label: "a number", ok: /\d/.test(password) },
  ];
}

export function validateSignup(form, role) {
  const errors = {};

  if (form.fullName.trim().length < 3)
    errors.fullName = "Enter your full name (at least 3 characters).";

  if (!/^(\+254|0)[17]\d{8}$/.test(form.phone.replace(/\s/g, ""))) {
    errors.phone = "Enter a Kenyan number, like 0712 345 678.";
  }

  if (!/^\S+@\S+\.\S{2,}$/.test(form.email.trim()))
    errors.email = "Enter a valid email address.";

  if (role.areaLabel && !form.area) errors.area = "Choose an area.";

  if (passwordChecks(form.password).some((rule) => !rule.ok)) {
    errors.password = "Use at least 8 characters with a letter and a number.";
  }

  if (!form.confirm) errors.confirm = "Confirm your password.";
  else if (form.confirm !== form.password)
    errors.confirm = "Passwords do not match.";

  if (!form.agree) errors.agree = "You need to agree before signing up.";

  return errors;
}
