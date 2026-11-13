const DEV_USERS = {
  tenant: { full_name: "Faith Njeri", role: "tenant", phone: "0710445566" },
  manager: {
    id: 11,
    full_name: "Wanjiku Mwangi",
    role: "manager",
    approval_status: "approved",
    company_name: "Greenleaf Property Managers",
  },
  admin: { full_name: "KejaConnect Admin", role: "admin" },
};

export function getCurrentUser() {
  if (import.meta.env.DEV && DEV_USERS[import.meta.env.VITE_DEV_USER]) {
    return DEV_USERS[import.meta.env.VITE_DEV_USER];
  }
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
}
