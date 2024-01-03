import { randomBytes } from "crypto"
import { AdapterUser } from "@auth/core/adapters"
import PostgresAdapter from "@auth/pg-adapter"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { Pool } from "pg"

import { authConfig } from "./auth.config"

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
})

export const dbAdapter = PostgresAdapter(pool)
dbAdapter.createUser = async (user: AdapterUser) => {
  if (user.email) {
    const savedUser = await pool.query<AdapterUser>(
      'INSERT INTO users(key, name, email, "emailVerified", image) VALUES($1, $2, $3, $4, $5) RETURNING *',
      [generateUserKey(), user.name, user.email, user.emailVerified, user.image]
    )
    return savedUser.rows[0]
  }
  return user
}

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
