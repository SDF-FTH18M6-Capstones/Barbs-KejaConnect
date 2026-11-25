import { createContext, useReducer, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

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
    case "LOGOUT":
      return { error: null, loading: false, data: null };
    default:
      return state;
  }
}
export function AuthProvider({ children }) {
  const [userData, userDispatch] = useReducer(handleAuth, {
    error: null,
    loading: true,
    data: null,
  });

  const navigate = useNavigate();

  function get_current_user() {
    const token = localStorage.getItem("token");
    if (!token) {
      userDispatch({ type: "INIT" });
      return;
    }
    userDispatch({ type: "LOADING" });
    fetch("/api/v1/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to retrive user: ${res.status}.`);
        }
        return res.json();
      })
      .then((data) => {
        userDispatch({ type: "SUCCESS", payload: data.user });
      })
      .catch(() => userDispatch({ type: "INIT" }))
      .finally(() => userDispatch({ type: "INIT" }));
  }

  useEffect(() => {
    get_current_user();
  }, []);

  function loginUser(login) {
    userDispatch({ type: "LOADING" });
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
        userDispatch({ type: "SUCCESS", payload: data.user });
      })
      .catch((error) => {
        if (error.message === "Email not verified") {
          navigate("/verify-email", { state: { email: login.email } });
          return;
        }
        userDispatch({ type: "ERROR", payload: error.message });
      })
      .finally(() => userDispatch({ type: "INIT" }));
  }

  function signupUser(signup) {
    userDispatch({ type: "LOADING" });
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
        userDispatch({ type: "INIT" });
        if (data.email_sent) {
          navigate("/verify-email", { state: { email: signup.email } });
        }
      })
      .catch((error) => {
        userDispatch({ type: "ERROR", payload: error.message });
      })
      .finally(() => userDispatch({ type: "INIT" }));
  }

  function logout() {
    localStorage.removeItem("token");
    userDispatch({ type: "LOGOUT" });
    navigate("/");
  }

  const value = { userData, loginUser, signupUser, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null || context === undefined) {
    throw new Error("Cannot use Authcontext outside of provider.");
  }
  return context;
}
