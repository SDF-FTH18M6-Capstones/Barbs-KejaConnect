import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

export default function App() {
  const [health, setHealth] = useState({ waiting: "Preparing" });
  useEffect(() => {
    fetch("/api/v1/me")
      .then((r) => {
        if (!r.ok) {
          throw new Error("Failed to fetch.");
        }
        return r.json();
      })
      .then((data) => {
        setHealth(data);
      })
      .catch((err) => console.error(err));
  }, []);
  return <RouterProvider router={router} />;
}
