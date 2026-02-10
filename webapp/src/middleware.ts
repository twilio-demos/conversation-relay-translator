export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/profiles/:path*",
    "/sessions/:path*",
    "/conversations/:path*",
    "/api/profiles/:path*",
    "/api/sessions/:path*",
    "/api/conversations/:path*",
  ],
};
