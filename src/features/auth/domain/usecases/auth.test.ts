import { NetworkError, UnauthorizedError, ValidationError } from "@/core/domain/errors";
import type { Session, SessionGateway } from "@/core/session/types";
import type { AuthRepository } from "../AuthRepository";
import { login, logout, restoreSession } from ".";

const session: Session = {
  accessToken: "a",
  refreshToken: "r",
  user: { id: "u1", name: "Ana", email: "ana@escola.com", role: "TEACHER", teacherId: "t1" },
};

const makeDeps = (stored: Session | null = null) => {
  let current: Session | null = null;
  const gateway: SessionGateway = {
    get session() {
      return current;
    },
    load: jest.fn(async () => {
      current = stored;
      return stored;
    }),
    set: jest.fn(async (value: Session | null) => {
      current = value;
    }),
  };
  const authRepository: jest.Mocked<AuthRepository> = {
    login: jest.fn().mockResolvedValue(session),
    renew: jest.fn(),
    logout: jest.fn().mockResolvedValue(undefined),
    checkSession: jest.fn().mockResolvedValue(undefined),
  };
  return { session: gateway, authRepository };
};

describe("login", () => {
  it("exige email e senha", async () => {
    const deps = makeDeps();
    await expect(login(deps, { email: " ", password: "x" })).rejects.toBeInstanceOf(ValidationError);
    expect(deps.authRepository.login).not.toHaveBeenCalled();
  });

  it("normaliza o email e grava a sessão", async () => {
    const deps = makeDeps();
    const user = await login(deps, { email: " Ana@Escola.com ", password: "123" });
    expect(deps.authRepository.login).toHaveBeenCalledWith({ email: "ana@escola.com", password: "123" });
    expect(deps.session.set).toHaveBeenCalledWith(session);
    expect(user.name).toBe("Ana");
  });
});

describe("restoreSession", () => {
  it("retorna null sem sessão salva", async () => {
    const deps = makeDeps(null);
    await expect(restoreSession(deps)).resolves.toBeNull();
    expect(deps.authRepository.checkSession).not.toHaveBeenCalled();
  });

  it("descarta a sessão quando o servidor recusa", async () => {
    const deps = makeDeps(session);
    deps.authRepository.checkSession.mockRejectedValueOnce(new UnauthorizedError());
    await expect(restoreSession(deps)).resolves.toBeNull();
    expect(deps.session.set).toHaveBeenCalledWith(null);
  });

  it("mantém a sessão quando está sem internet", async () => {
    const deps = makeDeps(session);
    deps.authRepository.checkSession.mockRejectedValueOnce(new NetworkError());
    await expect(restoreSession(deps)).resolves.toEqual(session);
  });
});

describe("logout", () => {
  it("limpa a sessão local mesmo se a API falhar", async () => {
    const deps = makeDeps(session);
    await deps.session.load();
    deps.authRepository.logout.mockRejectedValueOnce(new NetworkError());
    await logout(deps);
    expect(deps.session.session).toBeNull();
    expect(deps.authRepository.logout).toHaveBeenCalledWith("r");
  });
});
