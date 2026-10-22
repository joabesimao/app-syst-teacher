import type { ReactElement } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react-native";
import { SessionManager } from "@/core/session/SessionManager";
import type { Session, SessionStorage } from "@/core/session/types";
import { DependenciesProvider } from "@/main/di";
import type { AppDependencies } from "@/main/di";

const SAFE_AREA_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

export const memoryStorage = (): SessionStorage => {
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

export function createTestDependencies(overrides: Partial<AppDependencies> = {}): AppDependencies {
  return {
    session: new SessionManager(memoryStorage()),
    authRepository: { login: jest.fn(), renew: jest.fn(), logout: jest.fn(), checkSession: jest.fn() },
    classRepository: { loadCurrentTeacher: jest.fn() },
    studentRepository: { listByClass: jest.fn(), listAllByClass: jest.fn() },
    lessonRepository: {
      list: jest.fn(),
      loadAttendance: jest.fn(),
      create: jest.fn().mockResolvedValue(undefined),
      update: jest.fn().mockResolvedValue(undefined),
      saveAttendance: jest.fn().mockResolvedValue(undefined),
    },
    assessmentRepository: {
      list: jest.fn(),
      create: jest.fn(),
      loadGrades: jest.fn(),
      saveGrades: jest.fn().mockResolvedValue(undefined),
    },
    dashboardRepository: { loadOverview: jest.fn() },
    ...overrides,
  };
}

export async function renderWithProviders(ui: ReactElement, dependencies = createTestDependencies()) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false, gcTime: Infinity },
    },
  });
  const result = await render(
    <DependenciesProvider value={dependencies}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider initialMetrics={SAFE_AREA_METRICS}>{ui}</SafeAreaProvider>
      </QueryClientProvider>
    </DependenciesProvider>
  );
  return { ...result, dependencies, queryClient };
}
