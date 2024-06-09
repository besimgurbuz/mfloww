import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("__session")
  const sessionKey = session?.value
  const { pathname } = request.nextUrl

  if (pathname.includes("/dashboard")) {
    if (!sessionKey) {
      return NextResponse.redirect(
        new URL("/sign-in?redirected=true", request.url)
      )
    }

    const verifyUrl = new URL("/api/verify-token", request.url)
    const verifyRes = await fetch(verifyUrl.toString(), {
      method: "POST",
      headers: {
        cookie: `__session=${sessionKey}`,
      },
    })

    if (!verifyRes.ok) {
      return NextResponse.redirect(
        new URL("/sign-in?redirected=true", request.url)
      )
    }

    return NextResponse.next()
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
