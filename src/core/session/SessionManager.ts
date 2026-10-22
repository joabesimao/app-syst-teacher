import type { Session, SessionGateway, SessionRenewer, SessionStorage } from "./types";

type SessionListener = (session: Session | null) => void;

export class SessionManager implements SessionGateway {
  private current: Session | null = null;
  private refreshing: Promise<Session | null> | null = null;
  private renewer: SessionRenewer = async () => null;
  private readonly listeners = new Set<SessionListener>();

  constructor(private readonly storage: SessionStorage) {}

  setRenewer(renewer: SessionRenewer) {
    this.renewer = renewer;
  }

  get session() {
    return this.current;
  }

  subscribe(listener: SessionListener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  async load(): Promise<Session | null> {
    const stored = await this.storage.load();
    this.current = stored?.user ? stored : null;
    return this.current;
  }

  async set(session: Session | null) {
    this.current = session;
    if (session) {
      await this.storage.save(session);
    } else {
      await this.storage.clear();
    }
    this.listeners.forEach((listener) => listener(session));
  }

  refresh(): Promise<Session | null> {
    if (!this.refreshing) {
      this.refreshing = this.renew().finally(() => {
        this.refreshing = null;
      });
    }
    return this.refreshing;
  }

  private async renew(): Promise<Session | null> {
    const session = this.current;
    if (!session) return null;

    let renewed: Session | null;
    try {
      renewed = await this.renewer(session.refreshToken);
    } catch {
      return null;
    }

    if (!renewed) {
      if (this.current === session) await this.set(null);
      return null;
    }

    await this.set(renewed);
    return renewed;
  }
}
