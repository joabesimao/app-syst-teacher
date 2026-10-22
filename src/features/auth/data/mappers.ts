import type { Session } from "../domain/models";
import type { ApiSession } from "./dto";

export const toSession = ({ accessToken, refreshToken, user }: ApiSession): Session => ({
  accessToken,
  refreshToken,
  user: { id: user.id, name: user.name, email: user.email, role: user.role, teacherId: user.teacherId },
});
