import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Deterministic price formatter that formats numbers with non-breaking spaces
 * preventing any SSR/client hydration mismatches across different Node.js / browser locales.
 */
export function formatPrice(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(Number(amount))) return "0";
  const num = Math.round(Number(amount));
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
