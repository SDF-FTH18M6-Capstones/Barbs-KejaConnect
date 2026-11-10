import { useEffect, useState } from "react";

export default function App() {
  const [health, setHealth] = useState({ waiting: "Preparing" });
  useEffect(() => {
    fetch("/api/v1/health")
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
  return <h1>{`Api status: ${health.message}`}</h1>;
}
