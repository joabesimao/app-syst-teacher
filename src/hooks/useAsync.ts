import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";

export function useAsync<T>(load: () => Promise<T>, { refetchOnFocus = false } = {}) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);

  const run = useCallback(
    () =>
      load()
        .then((result) => {
          setData(result);
          setError(undefined);
        })
        .catch((err: unknown) => {
          setError(err instanceof Error ? err.message : "Falha ao carregar dados");
        })
        .finally(() => setLoading(false)),
    [load]
  );

  const reload = useCallback(async () => {
    setLoading(true);
    await run();
  }, [run]);

  useEffect(() => {
    if (!refetchOnFocus) void run();
  }, [run, refetchOnFocus]);

  useFocusEffect(
    useCallback(() => {
      if (refetchOnFocus) void run();
    }, [run, refetchOnFocus])
  );

  return { data, error, loading, reload };
}
