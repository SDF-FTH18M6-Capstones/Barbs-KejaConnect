import { createContext, useReducer, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

export const ListingsContext = createContext(null);

const initalState = {
  items: [],
  page: 1,
  per_page: 10,
  total: 0,
  pages: 0,
  loading: false,
  error: null,
};
function handleListings(state, action) {
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
export function ListingsProvider({ children }) {
  const [listingsData, listingsDispatch] = useReducer(
    handleListings,
    initalState,
  );

  const navigate = useNavigate();

  function setPage(page) {
    listingsDispatch({ type: "SET_PAGE", payload: page });
  }

  useEffect(() => {
    get_listings();
  }, [listingsData.page, listingsData.per_page]);

  async function get_listings() {
    listingsDispatch({ type: "INIT" });
    try {
      const params = new URLSearchParams({
        page: listingsData.page,
        per_page: listingsData.per_page,
      });
      const res = await fetch(`/api/v1/listings?${params}`);
      if (!res.ok) throw new Error("Failed to fetch listings.");
      const data = await res.json();
      listingsDispatch({ type: "SUCCESS", payload: data.listings });
    } catch (error) {
      listingsDispatch({ type: "SUCCESS", payload: data.listings });
    } finally {
      listingsDispatch({ type: "INIT" });
    }
  }

  async function get_listings() {
    listingsDispatch({ type: "INIT" });
    try {
      const params = new URLSearchParams({
        page: listingsData.page,
        per_page: listingsData.per_page,
      });
      const res = await fetch(`/api/v1/listings?${params}`);
      if (!res.ok) throw new Error("Failed to fetch listings.");
      const data = await res.json();
      listingsDispatch({ type: "SUCCESS", payload: data.listings });
    } catch (error) {
      listingsDispatch({ type: "SUCCESS", payload: data.listings });
    } finally {
      listingsDispatch({ type: "INIT" });
    }
  }

  function loginUser(login) {
    listingsDispatch({ type: "LOADING" });
    fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(login),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Login failed");
        }
        return res.json();
      })
      .then((data) => {
        const token = data.token;
        localStorage.setItem("token", token);
        listingsDispatch({ type: "SUCCESS", payload: data.user });
      })
      .catch((error) => {
        if (error.message === "Email not verified") {
          navigate("/verify-email", { state: { email: login.email } });
          return;
        }
        listingsDispatch({ type: "ERROR", payload: error.message });
      })
      .finally(() => listingsDispatch({ type: "INIT" }));
  }

  function signupUser(signup) {
    console.log(signup);
    listingsDispatch({ type: "LOADING" });
    fetch("/api/v1/auth/signup", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(signup),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "signup failed");
        }
        return res.json();
      })
      .then((data) => {
        if (data.email_sent) {
          navigate("/verify-email", { state: { email: signup.email } });
        }
        listingsDispatch({ type: "SUCCESS", payload: data.user });
      })
      .catch((error) => {
        listingsDispatch({ type: "ERROR", payload: error.message });
      })
      .finally(() => listingsDispatch({ type: "INIT" }));
  }

  const value = { listingsData, listingsDispatch, setPage };

  return (
    <ListingsContext.Provider value={value}>
      {children}
    </ListingsContext.Provider>
  );
}

export function useListings() {
  const context = useContext(ListingsContext);
  if (context === null || context === undefined) {
    throw new Error("Cannot use ListingsContext outside of provider.");
  }
  return context;
}
