"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { PrivacyEvent } from "@/types";

const ALLOWED_DOMAINS = [
  "unpkg.com",
  "jsdelivr.net",
  "cdn.jsdelivr.net",
  "tessdata.projectnaptha.com",
];

interface PrivacyGuardState {
  events: PrivacyEvent[];
  blockedCount: number;
  isActive: boolean;
}

export function usePrivacyGuard() {
  const [state, setState] = useState<PrivacyGuardState>({
    events: [],
    blockedCount: 0,
    isActive: false,
  });

  const originalFetch = useRef<typeof fetch>();
  const originalXHROpen =
    useRef<typeof XMLHttpRequest.prototype.open>();
  const eventsRef = useRef<PrivacyEvent[]>([]);

  const isBlocked = useCallback((url: string): boolean => {
    try {
      const urlObj = new URL(
        url,
        typeof window !== "undefined" ? window.location.href : ""
      );
      const host = urlObj.host;

      if (
        typeof window !== "undefined" &&
        host === window.location.host
      )
        return false;

      if (
        ALLOWED_DOMAINS.some((domain) =>
          host.includes(domain)
        )
      )
        return false;

      if (urlObj.pathname.startsWith("/ingest")) return false;

      return true;
    } catch {
      return false;
    }
  }, []);

  const addEvent = useCallback((event: PrivacyEvent) => {
    eventsRef.current = [
      ...eventsRef.current.slice(-50),
      event,
    ];
    setState({
      events: [...eventsRef.current],
      blockedCount: eventsRef.current.filter((e) => e.blocked)
        .length,
      isActive: true,
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    originalFetch.current = window.fetch;
    window.fetch = async (...args) => {
      const url = args[0]?.toString() || "";
      const blocked = isBlocked(url);

      addEvent({
        type: "fetch",
        url,
        blocked,
        timestamp: Date.now(),
      });

      if (blocked) {
        console.warn(
          `[LocalVault] BLOCKED external request: ${url}`
        );
        throw new Error(
          `Privacy Block: External request to ${url} is not allowed.`
        );
      }
      return originalFetch.current!(...args);
    };

    originalXHROpen.current =
      XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (
      method: string,
      url: string | URL,
      ...rest: any[]
    ) {
      const urlStr = url.toString();
      const blocked = isBlocked(urlStr);

      addEvent({
        type: "xhr",
        url: urlStr,
        blocked,
        timestamp: Date.now(),
      });

      return originalXHROpen.current!.apply(
        this,
        [method, url, ...rest] as any
      );
    };

    setState((prev) => ({ ...prev, isActive: true }));

    return () => {
      if (originalFetch.current)
        window.fetch = originalFetch.current;
      if (originalXHROpen.current)
        XMLHttpRequest.prototype.open =
          originalXHROpen.current;
    };
  }, [isBlocked, addEvent]);

  const clearEvents = useCallback(() => {
    eventsRef.current = [];
    setState({
      events: [],
      blockedCount: 0,
      isActive: true,
    });
  }, []);

  return {
    events: state.events,
    blockedCount: state.blockedCount,
    isActive: state.isActive,
    clearEvents,
  };
}
