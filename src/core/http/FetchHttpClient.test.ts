import { HttpError, NetworkError, UnauthorizedError } from "../domain/errors";
import { SessionManager } from "../session/SessionManager";
import type { Session, SessionStorage } from "../session/types";
import { FetchHttpClient } from "./FetchHttpClient";

const user = { id: "u1", name: "Ana", email: "ana@escola.com", role: "TEACHER" as const, teacherId: "t1" };
const session = (accessToken: string): Session => ({ accessToken, refreshToken: `r-${accessToken}`, user });

const memoryStorage = (): SessionStorage => {
  let stored: Session | null = null;
  return {
    load: async () => stored,
    save: async (value) => {
      stored = value;
    },
    clear: async () => {
      stored = null;
    },
  };
};

const json = (status: number, body: unknown) =>
  ({ status, ok: status >= 200 && status < 300, text: async () => JSON.stringify(body) }) as Response;

const setup = async () => {
  const manager = new SessionManager(memoryStorage());
  await manager.set(session("old"));
  const fetchFn = jest.fn<Promise<Response>, [RequestInfo | URL, RequestInit?]>();
  const client = new FetchHttpClient({ baseUrl: "http://api/", session: manager, fetchFn });
  return { manager, fetchFn, client };
};

const authHeader = (call: [RequestInfo | URL, RequestInit?]) =>
  (call[1]?.headers as Record<string, string>).Authorization;

describe("FetchHttpClient", () => {
  it("monta a URL com query e envia o token", async () => {
    const { client, fetchFn } = await setup();
    fetchFn.mockResolvedValueOnce(json(200, { ok: true }));

    await client.get("/lessons", { query: { classId: "c1", page: 2, term: undefined } });

    expect(fetchFn.mock.calls[0][0]).toBe("http://api/lessons?classId=c1&page=2");
    expect(authHeader(fetchFn.mock.calls[0])).toBe("Bearer old");
  });

  it("renova a sessão em 401 e repete a requisição", async () => {
    const { client, fetchFn, manager } = await setup();
    manager.setRenewer(async () => session("new"));
    fetchFn.mockResolvedValueOnce(json(401, {})).mockResolvedValueOnce(json(200, { value: 1 }));

    await expect(client.get("/auth/me")).resolves.toEqual({ value: 1 });
    expect(authHeader(fetchFn.mock.calls[1])).toBe("Bearer new");
    expect(manager.session?.accessToken).toBe("new");
  });

  it("faz um único refresh para várias requisições simultâneas", async () => {
    const { client, fetchFn, manager } = await setup();
    const renewer = jest.fn().mockResolvedValue(session("new"));
    manager.setRenewer(renewer);
    fetchFn.mockImplementation(async (_url, init) =>
      (init?.headers as Record<string, string>).Authorization === "Bearer new" ? json(200, {}) : json(401, {})
    );

    await Promise.all([client.get("/a"), client.get("/b"), client.get("/c")]);

    expect(renewer).toHaveBeenCalledTimes(1);
  });

  it("encerra a sessão quando o refresh é recusado", async () => {
    const { client, fetchFn, manager } = await setup();
    manager.setRenewer(async () => null);
    fetchFn.mockResolvedValue(json(401, { message: "Sessão expirada" }));

    await expect(client.get("/auth/me")).rejects.toBeInstanceOf(UnauthorizedError);
    expect(manager.session).toBeNull();
  });

  it("converte erros HTTP e de rede", async () => {
    const { client, fetchFn } = await setup();
    fetchFn.mockResolvedValueOnce(json(422, { message: "Nota inválida" }));
    await expect(client.post("/grades", {})).rejects.toEqual(new HttpError("Nota inválida", 422));

    fetchFn.mockRejectedValueOnce(new TypeError("Network request failed"));
    await expect(client.get("/x")).rejects.toBeInstanceOf(NetworkError);
  });

  it("não envia token em requisições anônimas", async () => {
    const { client, fetchFn } = await setup();
    fetchFn.mockResolvedValueOnce(json(200, {}));

    await client.post("/auth/login", { email: "a" }, { authenticated: false });

    expect(authHeader(fetchFn.mock.calls[0])).toBeUndefined();
  });
});
