import { useSessionStore } from "../store/useSessionStore";

export const useCurrentUser = () => useSessionStore((state) => state.user);

export const useCurrentTeacherId = () => useSessionStore((state) => state.user?.teacherId ?? undefined);
