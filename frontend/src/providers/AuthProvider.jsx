import {
  createContext,
  useState,
  useReducer,
  useEffect,
  useContext,
} from "react";

const AuthContext = createContext(null);

function handleAuth(state, action) {
  switch (action.type) {
    case "INIT":
      return { ...state, loading: false };
    case "LOADING":
      return { ...state, loading: true };
    case "SUCCESS":
      return { ...state, loading: false, data: action.payload };
    case "ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      break;
  }
}
function AuthProvider({ children }) {
  const [user, userDispatch] = useReducer(handleAuth, {
    error: null,
    loading: false,
    data: null,
  });

  useEffect(() => {
    get_current_user();
  }, []);

  function get_current_user() {
    userDispatch({ type: "INIT" });
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    fetch("/api/v1/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to retrive user: ${res.status}.`);
        }
        return res.json();
      })
      .then((data) => userDispatch({ type: "SUCCESS", payload: data }))
      .catch((error) => userDispatch({ type: "ERROR", payload: error.message }))
      .finally(() => userDispatch({ type: "INIT" }));
  }

  const value = { user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === null || context === undefined) {
    throw new Error("Cannot use Authcontext outside of provider.");
  }
  return context;
}

export { AuthProvider, useAuth };
