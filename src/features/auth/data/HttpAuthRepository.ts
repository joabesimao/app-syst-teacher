import { HttpError } from "@/core/domain/errors";
import type { HttpClient } from "@/core/http/HttpClient";
import type { AuthRepository } from "../domain/AuthRepository";
import type { Credentials, Session } from "../domain/models";
import type { ApiSession } from "./dto";
import { toSession } from "./mappers";

export class HttpAuthRepository implements AuthRepository {
  constructor(private readonly http: HttpClient) {}

  async login(credentials: Credentials): Promise<Session> {
    return toSession(await this.http.post<ApiSession>("/auth/login", credentials, { authenticated: false }));
  }

  async renew(refreshToken: string): Promise<Session | null> {
    try {
      return toSession(
        await this.http.post<ApiSession>("/auth/refresh", { refreshToken }, { authenticated: false })
      );
    } catch (error) {
      if (error instanceof HttpError) return null;
      throw error;
    }
  }

  async logout(refreshToken: string): Promise<void> {
    await this.http.post("/auth/logout", { refreshToken }, { authenticated: false });
  }

  async checkSession(): Promise<void> {
    await this.http.get("/auth/me");
  }
}
