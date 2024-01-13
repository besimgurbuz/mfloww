import "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    key: string
    name: string | null | undefined
    email: string | null | undefined
    emailVerified: Date | null
    image: string | null | undefined
  }
  interface Session {
    user: User
  }
}
