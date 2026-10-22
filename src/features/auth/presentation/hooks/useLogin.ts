import { useMutation } from "@tanstack/react-query";
import { useDependencies } from "@/main/di";
import type { Credentials } from "../../domain/models";
import { login } from "../../domain/usecases";

export function useLogin() {
  const dependencies = useDependencies();
  return useMutation({
    mutationFn: (credentials: Credentials) => login(dependencies, credentials),
  });
}
