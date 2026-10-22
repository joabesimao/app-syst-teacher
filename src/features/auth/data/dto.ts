import type { UserRole } from "../domain/models";

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teacherId: string | null;
}

export interface ApiSession {
  accessToken: string;
  refreshToken: string;
  user: ApiUser;
}
