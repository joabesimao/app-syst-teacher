import { HttpError, NetworkError, UnauthorizedError } from "../domain/errors";
import type { SessionManager } from "../session/SessionManager";
import type { HttpClient, RequestOptions } from "./HttpClient";
import { toQueryString } from "./HttpClient";

type Method = "GET" | "POST" | "PUT" | "PATCH";

interface FetchHttpClientOptions {
  baseUrl: string;
  session: SessionManager;
  fetchFn?: typeof fetch;
}

const isAbort = (error: unknown) => error instanceof Error && error.name === "AbortError";

export class FetchHttpClient implements HttpClient {
  private readonly baseUrl: string;
  private readonly session: SessionManager;
  private readonly fetchFn: typeof fetch;

  constructor({ baseUrl, session, fetchFn }: FetchHttpClientOptions) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.session = session;
    this.fetchFn = fetchFn ?? ((input, init) => fetch(input, init));
  }

  get<T>(path: string, options?: RequestOptions) {
    return this.request<T>("GET", path, undefined, options);
  }

  post<T>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>("POST", path, body, options);
  }

  put<T>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>("PUT", path, body, options);
  }

  patch<T>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>("PATCH", path, body, options);
  }

  private async request<T>(method: Method, path: string, body: unknown, options: RequestOptions = {}) {
    const { query, signal, authenticated = true } = options;
    const url = `${this.baseUrl}${path}${toQueryString(query)}`;
    const accessToken = authenticated ? this.session.session?.accessToken : undefined;

    let response = await this.send(method, url, body, signal, accessToken);

    if (response.status === 401 && accessToken) {
      const current = this.session.session;
      const renewed = current && current.accessToken !== accessToken ? current : await this.session.refresh();
      if (renewed) {
        response = await this.send(method, url, body, signal, renewed.accessToken);
      }
    }

    return this.parse<T>(response);
  }

  private async send(method: Method, url: string, body: unknown, signal?: AbortSignal, accessToken?: string) {
    try {
      return await this.fetchFn(url, {
        method,
        signal,
        body: body === undefined ? undefined : JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });
    } catch (error) {
      if (isAbort(error)) throw error;
      throw new NetworkError();
    }
  }

  private async parse<T>(response: Response): Promise<T> {
    const raw = await response.text();
    let data: { message?: string } | null = null;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      data = null;
    }

    if (!response.ok) {
      const message = data?.message ?? `Falha na requisição (${response.status})`;
      if (response.status === 401) throw new UnauthorizedError(message);
      throw new HttpError(message, response.status);
    }

    return data as T;
  }
}
