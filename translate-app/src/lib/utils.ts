import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export function decodeBase64(base64: string) {
  return atob(base64.trim());
}
