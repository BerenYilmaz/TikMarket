import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format price in Turkish Lira
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style:    "currency",
    currency: "TRY",
  }).format(price);
}

// Capitalize first letter
export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Truncate long text
export function truncate(str: string, length: number = 100): string {
  if (!str) return "";
  return str.length > length ? str.substring(0, length) + "..." : str;
}