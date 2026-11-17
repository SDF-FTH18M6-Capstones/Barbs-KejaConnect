import { useCallback, useEffect, useState } from "react";

export default function useLoad(load) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState({ load: null, attempt: -1 });

  useEffect(() => {
    let ignore = false; // stops an old request from overwriting a newer one
    load().then(
      (data) => !ignore && setResult({ load, attempt, data }),
      (error) => !ignore && setResult({ load, attempt, error }),
    );
    return () => {
      ignore = true;
    };
  }, [load, attempt]);

  const fresh = result.load === load && result.attempt === attempt;

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  const setData = useCallback(
    (update) => setResult((r) => ({ ...r, data: update(r.data) })),
    [],
  );

  return {
    loading: !fresh,
    data: fresh ? result.data : undefined,
    error: fresh ? result.error : undefined,
    retry,
    setData,
  };
}
