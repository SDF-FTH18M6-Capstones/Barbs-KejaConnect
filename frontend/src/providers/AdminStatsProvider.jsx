import { createContext, useReducer, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

export const AdminStatsContext = createContext(null);

const initalState = {
  error: null,
  loading: true,
  users: null,
  listings: null,
  approvals: null,
  total_approved: 0,
  page: 1,
  per_page: 10,
};
function handleAdminStats(state, action) {
  switch (action.type) {
    case "INIT":
      return { ...state, loading: false };
    case "LOADING":
      return { ...state, loading: true, error: null };
    case "SUCCESS":
      return {
        ...state,
        loading: false,
        users: action.payload.stats.users,
        listings: action.payload.stats.listings,
        approvals: action.payload.stats.approvals,
        total_approved: action.payload.stats.total_approved,
        page: action.payload.page,
        per_page: action.payload.per_page,
      };
    case "ERROR":
      return { ...state, loading: false, error: action.payload };
    case "SET_PAGE":
      return { ...state, loading: false, page: action.payload };
    case "SET_PER_PAGE":
      return { ...state, loading: false, per_page: action.payload, page: 1 };
    default:
      return state;
  }
}
export function AdminStatsProvider({ children }) {
  const [adminStatsData, adminStatsDispatch] = useReducer(
    handleAdminStats,
    initalState,
  );

  function setPage(page) {
    adminStatsDispatch({ type: "SET_PAGE", payload: page });
  }

  useEffect(() => {
    getAdminStats();
  }, [adminStatsData.page, adminStatsData.per_page]);

  async function getAdminStats() {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Unauthorized user.");
    }
    try {
      const params = new URLSearchParams({
        page: adminStatsData.page,
        per_page: adminStatsData.per_page,
      });
      const res = await fetch(`/api/v1/admin/stats?${params}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch admin stats.");
      const data = await res.json();
      console.log(data);
      adminStatsDispatch({ type: "SUCCESS", payload: data });
    } catch (error) {
      adminStatsDispatch({ type: "ERROR", payload: error.message });
    } finally {
      adminStatsDispatch({ type: "INIT" });
    }
  }

  const value = { adminStatsData, setPage };

  return (
    <AdminStatsContext.Provider value={value}>
      {children}
    </AdminStatsContext.Provider>
  );
}

export function useAdminStats() {
  const context = useContext(AdminStatsContext);
  if (context === null || context === undefined) {
    throw new Error("Cannot use InquiriesContext outside of provider.");
  }
  return context;
}
