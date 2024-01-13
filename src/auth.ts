import { randomBytes } from "crypto"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient, User } from "@prisma/client"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

import { authConfig } from "./auth.config"

const prisma = new PrismaClient()

export const dbAdapter = PrismaAdapter(prisma)
dbAdapter.createUser = (async (user: User) => {
  if (user.email) {
    const foundUser = await prisma.user.findUnique({
      where: { email: user.email },
    })
    if (foundUser) {
      return foundUser
    }

    const savedUser = await prisma.user.create({
      data: {
        key: generateUserKey(),
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
      },
    })
    return savedUser
  }
  return user
}) as any

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  ...authConfig,
  adapter: dbAdapter as any,
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
          id: "",
          email: "",
          name: "anonymous",
          image: "",
          emailVerified: null,
          key: generateUserKey(),
        }
        return anonymousUser
      },
    }),
    GitHub,
    Google,
  ],
})

function generateUserKey() {
  return randomBytes(64).toString("hex")
}
