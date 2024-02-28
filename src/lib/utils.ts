import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import {
  GetValueFromStorage,
  MONTH_NAMES,
  SetValueToStorage,
  StorageKey,
  StorageType,
  SupportedCurrencyCode,
} from "./definitions"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMoney(amount: number, currency: SupportedCurrencyCode) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    amount
  )
}

export function formatEntry(month: number, year: number): string {
  return `${MONTH_NAMES[month]} ${year}`
}

export function createDateFromMonthYear(month: number, year: number): Date {
  return new Date(year, month, 1, 0, 0, 0, 0)
}

export function typedObjectKeys<
  T extends Record<string | number | symbol, unknown>,
>(object: T) {
  return Object.keys(object) as (keyof typeof object)[]
}

export type NonNullablePropsObject<T> = {
  [P in keyof T]: NonNullable<T[P]>
}

export const setValueToStorage: SetValueToStorage = <T>(
  key: StorageKey,
  value: T,
  storageType: StorageType
) => {
  if (typeof window === "undefined") {
    return
  }
  const storage = storageType === "localStorage" ? localStorage : sessionStorage
  storage.setItem(key, JSON.stringify(value))
}

export const getValueFromStorage: GetValueFromStorage = <T>(
  key: StorageKey,
  storageType: StorageType
) => {
  if (typeof window === "undefined") {
    return null
  }
  const storage = storageType === "localStorage" ? localStorage : sessionStorage
  const storedValue = storage.getItem(key)
  return storedValue ? JSON.parse(storedValue) : null
}
