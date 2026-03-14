"use client";

import { useState, useEffect } from "react";

export function OfflineBanner() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setOnline(navigator.onLine);
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div
      className="bg-amber-100 text-amber-900 text-center py-2 px-4 text-sm"
      role="status"
      aria-live="polite"
    >
      オフラインです。保存した復習はご利用いただけます。通信が復帰すると続きをお試しください。
    </div>
  );
}
