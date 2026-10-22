import { useCallback } from "react";
import { useDependencies } from "@/main/di";
import { logout } from "../../domain/usecases";

export function useLogout() {
  const dependencies = useDependencies();
  return useCallback(() => logout(dependencies), [dependencies]);
}
