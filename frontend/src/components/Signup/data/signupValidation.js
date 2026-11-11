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

  if (
    form.password.length < 8 ||
    !/[A-Za-z]/.test(form.password) ||
    !/\d/.test(form.password)
  ) {
    errors.password = "Use at least 8 characters with a letter and a number.";
  }

  if (form.confirm !== form.password)
    errors.confirm = "Passwords do not match.";

  if (!form.agree) errors.agree = "You need to agree before signing up.";

  return errors;
}
