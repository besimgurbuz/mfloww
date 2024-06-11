import crypto from "crypto-js"

export function encrypt(key: string, value: string): string {
  return crypto.AES.encrypt(value, key).toString()
}

export function decrypt(key: string, encryptedText: string): string {
  return crypto.AES.decrypt(encryptedText, key).toString()
}

export function decryptObject<T>(key: string, encryptedText: string): T {
  const result = crypto.AES.decrypt(encryptedText, key).toString(
    crypto.enc.Utf8
  )
  return JSON.parse(result) as T
}
