import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // const isAuthPage =
  //   req.nextUrl.pathname.startsWith("/auth/") ||
  //   req.nextUrl.pathname.startsWith("/auth/");

  // if (token && isAuthPage) {
  //   // If the user is already authenticated and tries to access auth pages, redirect them
  //   return NextResponse.redirect(new URL("/", req.url));
  // }

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  try {
    // Since verifyToken is now async with jose, we need to await it
    const decoded = (await verifyToken(token)) as { role?: string };

    // Check if role exists in the decoded token
    if (!decoded || !decoded.role) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    const pathname = req.nextUrl.pathname;

    // RBAC checks
    if (pathname.startsWith("/admin") && decoded.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // Add additional role checks as needed
    if (
      pathname.startsWith("/dashboard") &&
      !["ADMIN", "USER"].includes(decoded.role)
    ) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Token verification failed:", error);
    // Clear the invalid token
    const response = NextResponse.redirect(new URL("/auth/login", req.url));
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: ["/my-profile/:path*", "/admin/:path*"],
};
