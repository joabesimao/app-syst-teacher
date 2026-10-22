import { UnauthorizedError } from "@/core/domain/errors";
import type { Session } from "../models";
import type { AuthDeps } from "./types";

export async function restoreSession({ authRepository, session }: AuthDeps): Promise<Session | null> {
  const stored = await session.load();
  if (!stored) return null;

  try {
    await authRepository.checkSession();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      await session.set(null);
      return null;
    }
  }
  return session.session;
}
