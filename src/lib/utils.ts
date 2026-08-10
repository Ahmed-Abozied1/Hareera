import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * الرسالة اللي نعرضها للمستخدم من أي حاجة اترمت في catch.
 * TypeScript بيدي الـ catch نوع unknown، فده المكان الوحيد اللي بنضيق فيه النوع.
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message
  if (typeof error === "string" && error) return error
  return fallback
}
