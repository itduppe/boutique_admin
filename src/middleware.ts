import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;
    const publicPaths = ["/login", "/register", "/api", "/favicon.ico", "/_next", "/static"];
    const isPublic = publicPaths.some((path) => pathname.startsWith(path));

    if (!token && !isPublic) {
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    if (token && pathname === "/login") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|login|register|api).*)",
    ],
};