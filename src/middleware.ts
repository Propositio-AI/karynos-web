import { NextRequest, NextResponse } from "next/server";

const protectedPaths = ["/job", "/chat", "/dream-action", "/mentor"];
const mentorOnlyPaths = ["/mentor"];

function isProtected(pathname: string): boolean {
    return protectedPaths.some((p) => pathname.startsWith(p));
}

function isMentorOnly(pathname: string): boolean {
    return mentorOnlyPaths.some((p) => pathname.startsWith(p));
}

function getAuthTokenFromCookies(request: NextRequest): string | null {
    // Amplify v6 stores tokens under keys like:
    // CognitoIdentityServiceProvider.{clientId}.{username}.accessToken
    // We check for any cookie matching that pattern.
    const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID ?? "";
    for (const [key] of request.cookies) {
        if (key.includes(`CognitoIdentityServiceProvider.${clientId}`) && key.endsWith(".accessToken")) {
            return request.cookies.get(key)?.value ?? null;
        }
    }
    // Fallback: check explicit cookie set by server action on login
    return request.cookies.get("access_token")?.value ?? null;
}

function getUserRoleFromCookies(request: NextRequest): string | null {
    return request.cookies.get("user_role")?.value ?? null;
}

// AUTH_BYPASS: 認証チェックを一時的に無効化
const AUTH_BYPASS = true;

export function middleware(request: NextRequest) {
    if (AUTH_BYPASS) {
        return NextResponse.next();
    }

    const { pathname } = request.nextUrl;

    if (!isProtected(pathname)) {
        return NextResponse.next();
    }

    const token = getAuthTokenFromCookies(request);

    if (!token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (isMentorOnly(pathname)) {
        const role = getUserRoleFromCookies(request);
        if (role && role !== "mentor") {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
