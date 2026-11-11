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
  return (
    <h1 className="bg-primary text-text-on-primary px-4 py-2">{`Api status: ${health.message}`}</h1>
  );
}
