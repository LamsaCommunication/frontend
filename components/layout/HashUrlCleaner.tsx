"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

export function HashUrlCleaner() {
  const pathname = usePathname();

  React.useEffect(() => {
    // 1. Check if an intent to scroll was stored from another page
    const target = sessionStorage.getItem("scrollToSection");
    if (target) {
      sessionStorage.removeItem("scrollToSection");
      const tryScroll = (attempts = 0) => {
        const el = document.getElementById(target);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else if (attempts < 15) {
          setTimeout(() => tryScroll(attempts + 1), 100);
        }
      };
      tryScroll();
    }

    // 2. If the URL contains any '#' (like /#accueil#contact or /#contact), scroll & clean immediately
    if (window.location.hash) {
      const hash = window.location.hash;
      const targetId = hash.split("#").filter(Boolean).pop();
      if (targetId) {
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
      // Strip hash from address bar cleanly without page reload
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }
  }, [pathname]);

  return null;
}
