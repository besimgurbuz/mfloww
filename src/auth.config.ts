import type { NextAuthConfig } from "next-auth"

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
    jwt({ token, user }) {
      if (user?.key && user?.id) {
        token.id = user.id
        token.key = user.key
      }
      return token
    },
    session({ session, token }) {
      if (token.key && token.id) {
        session.user.id = token.id as string
        session.user.key = token.key as string
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
  providers: [],
} satisfies NextAuthConfig
