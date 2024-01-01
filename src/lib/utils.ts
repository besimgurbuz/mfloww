import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type NonNullablePropsObject<T> = {
  [P in keyof T]: NonNullable<T[P]>
}
