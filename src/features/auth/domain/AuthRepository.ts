import type { Credentials, Session } from "./models";

export interface AuthRepository {
  login(credentials: Credentials): Promise<Session>;
  renew(refreshToken: string): Promise<Session | null>;
  logout(refreshToken: string): Promise<void>;
  checkSession(): Promise<void>;
}
