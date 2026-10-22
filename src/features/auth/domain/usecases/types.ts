import type { SessionGateway } from "@/core/session/types";
import type { AuthRepository } from "../AuthRepository";

export interface AuthDeps {
  authRepository: AuthRepository;
  session: SessionGateway;
}
