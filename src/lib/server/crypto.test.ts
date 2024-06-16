import { decrypt, encrypt } from "./crypto"

describe("encrypt", () => {
  it("should encrypt the text", () => {
    const text = "Hello, World!"
    const encrypted = encrypt(text)
    expect(encrypted).toBeDefined()
    expect(encrypted).not.toEqual(text)
  })
})

describe("decrypt", () => {
  it("should decrypt the hash", () => {
    const text = "Hello, World!"
    const encrypted = encrypt(text)
    const decrypted = decrypt(encrypted)
    expect(decrypted).toBeDefined()
    expect(decrypted).toEqual(text)
  })
})
