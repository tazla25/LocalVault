"use client";

import { createContext, useContext, ReactNode } from "react";
import { usePrivacyGuard } from "@/hooks/usePrivacyGuard";

type PrivacyGuardReturn = ReturnType<typeof usePrivacyGuard>;

const PrivacyContext = createContext<PrivacyGuardReturn | null>(null);

export function PrivacyProvider({ children }: { children: ReactNode }) {
  const guard = usePrivacyGuard();
  return (
    <PrivacyContext.Provider value={guard}>
      {children}
    </PrivacyContext.Provider>
  );
}

export function usePrivacy(): PrivacyGuardReturn {
  const ctx = useContext(PrivacyContext);
  if (!ctx) {
    // Return a safe default when used outside provider (e.g., server components)
    return { events: [], blockedCount: 0, isActive: false, clearEvents: () => {} };
  }
  return ctx;
}
