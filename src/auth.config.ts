import type { NextAuthConfig } from "next-auth"

import { User } from "@/lib/definitions"

export const authConfig = {
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl))
      }
      return true
    },
    jwt({ token, user, profile }) {
      if ((user as User)?.key && user?.id) {
        token.user = user
      }
      return token
    },
    session({ session, token }) {
      if (token.user) {
        session.user = token.user as User
      }
      return session
    },
    async signIn({ user }) {
      return true
    },
  },
  session: {
    strategy: "jwt",
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig
