//認証ミドルウェア
import { NextRequest, NextResponse } from "next/server";
import { fetchAuthSession } from "aws-amplify/auth/server";
import { runWithAmplifyServerContext } from "@/utils/amplify-utils";

// 公開パス
const PUBLIC_PATHS = [
  "/login/dreamer",
  "/login/mentor",
  "/public",
  "/favicon.ico",
  "/_next",
];

const middleware = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const requiresAuth = !isPublicPath;
  const isLoginPage = pathname.startsWith("/login");
  const response = NextResponse.next();
  const authenticated = await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec, {});
        return session.tokens !== undefined;
      } catch (error) {
        return false;
      }
    },
  });

  //未認証+保護パスへのアクセスはログインへリダイレクト
  if (!authenticated && !isPublicPath) {
    const loginUrl = new URL("/login/dreamer", request.url); //dreamerとmentorはどう振り分けるのか？
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  //認証済み+ログインページへのアクセスはマッチングページへリダイレクト
  if (authenticated && isLoginPage) {
    return NextResponse.redirect(new URL("/job/match", request.url));
  }

  return response;
};

// ミドルウェアの適用範囲を指定
export const config = {
  matcher: [
    "/",
    "/job/detail/[job_id]/chat",
    "/job/detail/[job_id]",
    "/job/match",
    "/job/search",
    "/login/dreamer",
    "/login/mentor",
    "/mentor/dreamer/detail/[dreamer_id]",
    "/mentor/dreamer/group/detail/[group_id]",
    "/mentor/dreamer/group/new",
    "/mentor/dreamer",
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)).*)",
  ],
};

export default middleware;
