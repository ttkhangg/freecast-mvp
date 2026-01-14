import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Hàm cn (classnames) huyền thoại - Must Have cho mọi dự án Next.js
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}