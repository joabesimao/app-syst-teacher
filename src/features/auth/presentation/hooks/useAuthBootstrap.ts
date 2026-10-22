import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDependencies } from "@/main/di";
import { restoreSession } from "../../domain/usecases";
import { useSessionStore } from "../store/useSessionStore";

export function useAuthBootstrap() {
  const dependencies = useDependencies();
  const queryClient = useQueryClient();
  const setSession = useSessionStore((state) => state.setSession);

  useEffect(() => {
    let userId = dependencies.session.session?.user.id;
    const unsubscribe = dependencies.session.subscribe((session) => {
      const nextUserId = session?.user.id;
      if (nextUserId !== userId) queryClient.clear();
      userId = nextUserId;
      setSession(session);
    });

    let active = true;
    void restoreSession(dependencies).then((session) => {
      userId = session?.user.id;
      if (active) setSession(session);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [dependencies, queryClient, setSession]);

  return useSessionStore((state) => state.status);
}
