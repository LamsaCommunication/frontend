"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function AgenceScrollHandler() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  useEffect(() => {
    if (!category) return;

    const timer = setTimeout(() => {
      const section = document.getElementById("categories");

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        window.scrollBy({
          top: -90,
          behavior: "smooth",
        });
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [category]);

  return null;
}