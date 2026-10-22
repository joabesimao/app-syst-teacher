import { ValidationError } from "@/core/domain/errors";
import type { AuthUser, Credentials } from "../models";
import type { AuthDeps } from "./types";

export async function login({ authRepository, session }: AuthDeps, credentials: Credentials): Promise<AuthUser> {
  const email = credentials.email.trim().toLowerCase();
  if (!email || !credentials.password) {
    throw new ValidationError("Informe email e senha");
  }
  const created = await authRepository.login({ email, password: credentials.password });
  await session.set(created);
  return created.user;
}
