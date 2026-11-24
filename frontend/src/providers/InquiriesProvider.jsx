import { createContext, useReducer, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

export const InquiriesContext = createContext(null);

const initalState = {
  items: [],
  page: 1,
  per_page: 10,
  total: 0,
  pages: 0,
  loading: false,
  error: null,
};
function handleInquiries(state, action) {
  switch (action.type) {
    case "INIT":
      return { ...state, loading: false };
    case "LOADING":
      return { ...state, loading: true, error: null };
    case "SUCCESS":
      return {
        ...state,
        loading: false,
        items: action.payload.items,
        page: action.payload.page,
        per_page: action.payload.per_page,
        total: action.payload.total,
        pages: action.payload.pages,
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
export function InquiriesProvider({ children }) {
  const [inquiriesData, inquiriesDispatch] = useReducer(
    handleInquiries,
    initalState,
  );

  function setPage(page) {
    inquiriesDispatch({ type: "SET_PAGE", payload: page });
  }

  useEffect(() => {
    getReceivedInquiries();
  }, [inquiriesData.page, inquiriesData.per_page]);

  async function get_inquiries() {
    inquiriesDispatch({ type: "INIT" });
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Unauthorized user.");
    }
    try {
      const params = new URLSearchParams({
        page: inquiriesData.page,
        per_page: inquiriesData.per_page,
      });
      const res = await fetch(`/api/v1/inquiries?${params}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch inquiries.");
      const data = await res.json();
      inquiriesDispatch({ type: "SUCCESS", payload: data.inquiries });
    } catch (error) {
      inquiriesDispatch({ type: "SUCCESS", payload: data.inquiries });
    } finally {
      inquiriesDispatch({ type: "INIT" });
    }
  }

  async function get_inquiries(url) {
    inquiriesDispatch({ type: "LOADING" });
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Unauthorized user.");
    }
    try {
      const params = new URLSearchParams({
        page: inquiriesData.page,
        per_page: inquiriesData.per_page,
      });
      const res = await fetch(`${url}?${params}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch inquiries.");
      const data = await res.json();
      inquiriesDispatch({ type: "SUCCESS", payload: data });
    } catch (error) {
      inquiriesDispatch({ type: "ERROR", payload: error.message });
    } finally {
      inquiriesDispatch({ type: "INIT" });
    }
  }

  function getReceivedInquiries() {
    get_inquiries("/api/v1/inquiries/received");
  }

  function get_poster_sent() {
    get_inquiries("/api/v1/inquiries/mine");
  }
  const value = { inquiriesData, setPage };

  return (
    <InquiriesContext.Provider value={value}>
      {children}
    </InquiriesContext.Provider>
  );
}

export function useInquiries() {
  const context = useContext(InquiriesContext);
  if (context === null || context === undefined) {
    throw new Error("Cannot use InquiriesContext outside of provider.");
  }
  return context;
}
