"use client";

import { useEffect, useRef, useCallback } from "react";

interface NetworkEvent {
  type: "fetch" | "xhr";
  url: string;
  blocked: boolean;
  timestamp: number;
}

export function usePrivacyVerifier() {
  const eventsRef = useRef<NetworkEvent[]>([]);
  const originalFetch = useRef<typeof fetch>();
  const originalXHROpen = useRef<typeof XMLHttpRequest.prototype.open>();

  useEffect(() => {
    const ALLOWED_DOMAINS = [
      typeof window !== "undefined" ? window.location.host : "",
      "unpkg.com",
      "jsdelivr.net",
      "cdn.jsdelivr.net",
      "tessdata.projectnaptha.com",
    ];

    const isBlocked = (url: string): boolean => {
      try {
        const urlObj = new URL(url, window.location.href);
        return !ALLOWED_DOMAINS.some((domain) =>
          urlObj.host.includes(domain)
        );
      } catch {
        return false;
      }
    };

    originalFetch.current = window.fetch;
    window.fetch = async (...args) => {
      const url = args[0]?.toString() || "";
      const blocked = isBlocked(url);

      eventsRef.current.push({
        type: "fetch",
        url,
        blocked,
        timestamp: Date.now(),
      });

      if (blocked) {
        console.warn(`[LocalVault] BLOCKED external upload: ${url}`);
        throw new Error(
          `Privacy Block: External upload to ${url} is not allowed.`
        );
      }
      return originalFetch.current!(...args);
    };

    originalXHROpen.current = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (
      method: string,
      url: string | URL,
      ...rest: any[]
    ) {
      const urlStr = url.toString();
      const blocked = isBlocked(urlStr);

      eventsRef.current.push({
        type: "xhr",
        url: urlStr,
        blocked,
        timestamp: Date.now(),
      });

      return originalXHROpen.current!.call(this, method, url, ...(rest as [boolean, string | null | undefined, string | null | undefined]));
    };

    return () => {
      if (originalFetch.current) window.fetch = originalFetch.current;
      if (originalXHROpen.current) XMLHttpRequest.prototype.open = originalXHROpen.current;
    };
  }, []);

  const getEvents = useCallback(() => eventsRef.current, []);
  const clearEvents = useCallback(() => {
    eventsRef.current = [];
  }, []);
  const getBlockedCount = useCallback(
    () => eventsRef.current.filter((e) => e.blocked).length,
    []
  );

  return { getEvents, clearEvents, getBlockedCount };
}
