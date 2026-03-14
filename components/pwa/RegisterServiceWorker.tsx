"use client";

import { useEffect } from "react";

export function RegisterServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    void navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((reg) => {
        void reg.unregister();
      });
    });

    if (process.env.NEXT_PUBLIC_ENABLE_PWA === "true") {
      void navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  return null;
}
