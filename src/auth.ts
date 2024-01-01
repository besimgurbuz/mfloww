import { randomBytes, randomInt } from "crypto"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

import { authConfig } from "./auth.config"

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "anonymous",
      credentials: {
        id: { type: "string" },
        email: { type: "string" },
        name: { type: "string" },
        image: { type: "string" },
        key: { type: "string" },
      },
      async authorize(credentials, request) {
        const anonymousUser = {
          id: randomInt(99999).toString(),
          email: "",
          name: "anonymous",
          image: "",
          key: randomBytes(64).toString("hex"),
        }
        return anonymousUser
      },
    }),
    GitHub,
    Google,
  ],
})
