export type UserRole = "ADMIN" | "TEACHER";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teacherId: string | null;
}

export interface Session {
  accessToken: string;
  refreshToken: string;
  user: SessionUser;
}

export interface SessionStorage {
  load(): Promise<Session | null>;
  save(session: Session): Promise<void>;
  clear(): Promise<void>;
}

export type SessionRenewer = (refreshToken: string) => Promise<Session | null>;

export interface SessionGateway {
  readonly session: Session | null;
  load(): Promise<Session | null>;
  set(session: Session | null): Promise<void>;
}
