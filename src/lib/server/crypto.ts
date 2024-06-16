import { createCipheriv, createDecipheriv, randomBytes } from "crypto"

const algorithm = "aes-256-cbc"
const secretKey = "sDiVAmKrf9YzcFzDAt2t7wFRa5g3mWSB"

export function encrypt(text: string) {
  const iv = randomBytes(16)
  const cipher = createCipheriv(algorithm, Buffer.from(secretKey), iv)
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()])
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`
}

export function decrypt(hash: string) {
  const parts = hash.split(":")
  const iv = Buffer.from(parts.shift() as string, "hex")
  const decipher = createDecipheriv(algorithm, Buffer.from(secretKey), iv)
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(parts.join(":"), "hex")),
    decipher.final(),
  ])
  return decrypted.toString()
}
