import type { AuthDeps } from "./types";

export async function logout({ authRepository, session }: AuthDeps): Promise<void> {
  const current = session.session;
  await session.set(null);
  if (!current) return;
  try {
    await authRepository.logout(current.refreshToken);
  } catch {
    // A sessão local já foi encerrada; o refresh token expira sozinho no servidor.
  }
}
