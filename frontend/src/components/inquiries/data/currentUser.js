const DEV_USERS = {
  visitor: null, // not logged in, even if localStorage has a saved user
  tenant: { full_name: "Faith Njeri", role: "tenant", phone: "0710445566" },
  manager: {
    id: 11,
    full_name: "Wanjiku Mwangi",
    role: "manager",
    approval_status: "approved",
    company_name: "Greenleaf Property Managers",
  },
  pending_manager: {
    id: 19,
    full_name: "Kevin Mutua",
    role: "manager",
    approval_status: "pending",
    company_name: "Mutua Agencies",
  },
  owner: {
    id: 13,
    full_name: "Amina Hassan",
    role: "owner",
    approval_status: "approved",
  },
  pending_owner: {
    id: 17,
    full_name: "Joyce Achieng",
    role: "owner",
    approval_status: "pending",
  },
  admin: { full_name: "KejaConnect Admin", role: "admin" },
};

export function getCurrentUser() {
  const devUser = import.meta.env.VITE_DEV_USER;
  if (import.meta.env.DEV && devUser in DEV_USERS) {
    return DEV_USERS[devUser];
  }
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
}
