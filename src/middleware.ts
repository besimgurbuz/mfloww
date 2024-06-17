import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("__session")
  const sessionKey = session?.value
  const { pathname } = request.nextUrl
  const protectedPaths = ["/dashboard", "/settings"]
  const authoredPaths = ["/", "/sign-in", "/beta"]

  if (protectedPaths.includes(pathname)) {
    if (!sessionKey) {
      return NextResponse.redirect(
        new URL(`/sign-in?redirected=${pathname.replace("/", "")}`, request.url)
      )
    }

    const verifyUrl = new URL("/api/verify-token", request.url)
    const verifyRes = await fetch(verifyUrl, {
      method: "POST",
      headers: {
        cookie: `__session=${sessionKey}`,
      },
    })

    if (!verifyRes.ok) {
      return NextResponse.redirect(
        new URL(`/sign-in?redirected=${pathname.replace("/", "")}`, request.url)
      )
    }

    return NextResponse.next()
  }

  if (authoredPaths.includes(pathname)) {
    if (!sessionKey) {
      return NextResponse.next()
    }

    const verifyUrl = new URL("/api/verify-token", request.url)
    const verifyRes = await fetch(verifyUrl, {
      method: "POST",
      headers: {
        cookie: `__session=${sessionKey}`,
      },
    })

    if (verifyRes.ok) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
}
