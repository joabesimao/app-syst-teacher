import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { AppDependencies } from "./types";

const DependenciesContext = createContext<AppDependencies | null>(null);

export function DependenciesProvider({ value, children }: { value: AppDependencies; children: ReactNode }) {
  return <DependenciesContext.Provider value={value}>{children}</DependenciesContext.Provider>;
}

export function useDependencies(): AppDependencies {
  const dependencies = useContext(DependenciesContext);
  if (!dependencies) {
    throw new Error("useDependencies precisa estar dentro de <DependenciesProvider>");
  }
  return dependencies;
}
