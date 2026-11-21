import { createContext, useReducer, useEffect, useContext } from "react";
import { matchPath, useLocation, useNavigate } from "react-router-dom";

export const ListingsContext = createContext(null);

const initalState = {
  items: [],
  page: 1,
  per_page: 10,
  total: 0,
  pages: 0,
  loading: true,
  error: null,
};
const initialNewListing = {
  listing: null,
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
function handleCreateListing(state, action) {
  switch (action.type) {
    case "INIT":
      return { ...state, loading: false };
    case "LOADING":
      return { ...state, loading: true, error: null };
    case "SUCCESS":
      return {
        ...state,
        loading: false,
        listing: action.payload,
      };
    case "ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
export function ListingsProvider({ children }) {
  const [listingsData, listingsDispatch] = useReducer(
    handleListings,
    initalState,
  );

  const [newlisting, newListingDispatch] = useReducer(
    handleCreateListing,
    initialNewListing,
  );

  const navigate = useNavigate();
  const location = useLocation();

  function setPage(page) {
    listingsDispatch({ type: "SET_PAGE", payload: page });
  }

  useEffect(() => {
    if (matchPath("/api/v1/listings/mine", location.pathname)) {
      getPosterListings();
    } else {
      getAllListings();
    }
  }, [listingsData.page, listingsData.per_page]);

  async function get_listings(url) {
    listingsDispatch({ type: "LOADING" });
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Unauthorized user.");
    }
    try {
      const params = new URLSearchParams({
        page: listingsData.page,
        per_page: listingsData.per_page,
      });
      const res = await fetch(`${url}?${params}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch listings.");
      const data = await res.json();
      listingsDispatch({ type: "SUCCESS", payload: data.listings });
    } catch (error) {
      listingsDispatch({ type: "ERROR", payload: error.message });
    } finally {
      listingsDispatch({ type: "INIT" });
    }
  }

  async function getAllListings() {
    await get_listings("/api/v1/listings");
  }

  async function getPosterListings() {
    await get_listings("/api/v1/listings/mine");
  }

  async function createListing(formdata) {
    newListingDispatch({ type: "LOADING" });
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Unauthorized user.");
      }
      const res = await fetch("/api/v1/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formdata),
      });
      if (!res.ok) throw new Error("Failed to fetch listings.");
      const data = await res.json();
      console.log(data);
      newListingDispatch({ type: "SUCCESS", payload: data.listing });
    } catch (error) {
      console.log("Error::::", error);
      newListingDispatch({ type: "ERROR", payload: error.message });
    } finally {
      listingsDispatch({ type: "INIT" });
    }
  }
  const value = {
    listingsData,
    listingsDispatch,
    newlisting,
    createListing,
    setPage,
    getPosterListings,
  };

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
