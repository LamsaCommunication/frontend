"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type MarqueeProps = {
  items: React.ReactNode[];
  speed?: "normal" | "fast";
  separator?: React.ReactNode | null;
  className?: string;
  itemClassName?: string;
  pauseOnHover?: boolean;
};

export function Marquee({
  items,
  speed = "normal",
  separator,
  className,
  itemClassName,
  pauseOnHover = false,
}: MarqueeProps) {
  const sep =
    separator === null
      ? null
      : separator ?? (
        <span
          aria-hidden
          className="mx-8 inline-block h-1.5 w-1.5 rounded-full bg-current opacity-40"
        />
      );

  const renderRow = (key: string) => (
    <div
      key={key}
      className="flex shrink-0 items-center"
      aria-hidden={key === "b"}
    >
      {items.map((item, i) => (
        <div
          key={`${key}-${i}`}
          className={cn("flex items-center", itemClassName)}
        >
          {item}
          {sep}
        </div>
      ))}
    </div>
  );

  return (
    <div
      className={cn("group relative w-full overflow-hidden", className)}
      role="presentation"
    >
      <div
        className={cn(
          "flex w-max",
          speed === "fast" ? "marquee-track-fast" : "marquee-track",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
      >
        {renderRow("a")}
        {renderRow("b")}
      </div>
    </div>
  );
}
