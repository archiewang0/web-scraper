import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    })

    if (pathname === '/sign-in') {
        if (token)
            return NextResponse.redirect(new URL('/setting', request.url))
    }

    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/sign-in'],
}
