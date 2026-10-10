export interface SessionTeacher {
  id: string;
  fullName: string;
  email: string;
}

export interface Session {
  accessToken: string;
  refreshToken: string;
  teacher: SessionTeacher;
}

export interface SessionStore {
  load(): Promise<Session | null>;
  save(session: Session): Promise<void>;
  clear(): Promise<void>;
}

type SessionListener = (session: Session | null) => void;

type ApiSession = {
  accessToken: string;
  refreshToken: string;
  teacher: SessionTeacher;
};

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const memoryStore = (): SessionStore => {
  let stored: Session | null = null;
  return {
    load: async () => stored,
    save: async (session) => {
      stored = session;
    },
    clear: async () => {
      stored = null;
    },
  };
};

let baseUrl = "http://localhost:3000/api";
let sessionStore: SessionStore = memoryStore();
let currentSession: Session | null = null;
let refreshing: Promise<Session | null> | null = null;
const listeners = new Set<SessionListener>();

export function configureApi(options: { baseUrl: string; sessionStore: SessionStore }) {
  baseUrl = options.baseUrl.replace(/\/$/, "");
  sessionStore = options.sessionStore;
}

export function onSessionChange(listener: SessionListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const getSession = () => currentSession;

async function setSession(session: Session | null) {
  currentSession = session;
  if (session) {
    await sessionStore.save(session);
  } else {
    await sessionStore.clear();
  }
  listeners.forEach((listener) => listener(session));
}

const toSession = ({ accessToken, refreshToken, teacher }: ApiSession): Session => ({
  accessToken,
  refreshToken,
  teacher: { id: teacher.id, fullName: teacher.fullName, email: teacher.email },
});

function send(path: string, options: RequestInit, accessToken?: string) {
  return fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(options.headers ?? {}),
    },
  });
}

async function parse<T>(response: Response): Promise<T> {
  const raw = await response.text();
  const data = raw ? JSON.parse(raw) : null;

  if (!response.ok) {
    const errorMessage = data?.message ?? `Falha na requisição (${response.status})`;
    throw new ApiError(errorMessage, response.status);
  }

  return data as T;
}

async function renewSession(): Promise<Session | null> {
  const session = currentSession;
  if (!session) return null;

  let response: Response;
  try {
    response = await send("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    });
  } catch {
    return null;
  }

  if (!response.ok) {
    if (currentSession === session) await setSession(null);
    return null;
  }

  const renewed = toSession(await response.json());
  await setSession(renewed);
  return renewed;
}

export function refreshSession(): Promise<Session | null> {
  if (!refreshing) {
    refreshing = renewSession().finally(() => {
      refreshing = null;
    });
  }
  return refreshing;
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const accessToken = currentSession?.accessToken;
  let response = await send(path, options, accessToken);

  if (response.status === 401 && accessToken) {
    const renewed =
      currentSession && currentSession.accessToken !== accessToken
        ? currentSession
        : await refreshSession();
    if (renewed) {
      response = await send(path, options, renewed.accessToken);
    }
  }

  return parse<T>(response);
}

export async function login(email: string, password: string): Promise<Session> {
  const response = await send("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const session = toSession(await parse<ApiSession>(response));
  await setSession(session);
  return session;
}

export async function logout(): Promise<void> {
  const session = currentSession;
  await setSession(null);
  if (!session) return;
  try {
    await send("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    });
  } catch {
    // A sessao local ja foi encerrada; o refresh token expira sozinho no servidor.
  }
}

export async function restoreSession(): Promise<Session | null> {
  currentSession = await sessionStore.load();
  if (!currentSession) return null;

  try {
    await request("/auth/me");
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      await setSession(null);
      return null;
    }
  }
  return currentSession;
}
