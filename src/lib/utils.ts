import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { SupportedCurrencyCode } from "./definitions"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMoney(amount: number, currency: SupportedCurrencyCode) {
  return amount.toLocaleString("en-US", { style: "currency", currency })
}

export function typedObjectKeys<
  T extends Record<string | number | symbol, unknown>,
>(object: T) {
  return Object.keys(object) as (keyof typeof object)[]
}

export type NonNullablePropsObject<T> = {
  [P in keyof T]: NonNullable<T[P]>
}
