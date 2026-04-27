import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const protectedRoutes = {
  admin: ["/admin"],
  seller: ["/seller"],
  customer: ["/profile", "/orders", "/wishlist"],
};

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session?.user;
  const userRole = session?.user?.role;
  const isVerified = session?.user?.isVerified;
  const isApproved = session?.user?.isApproved;

  const isAuthPage = nextUrl.pathname.startsWith("/auth");
  const isPendingApprovalPage =
    nextUrl.pathname.startsWith("/pending-approval");

  if (isAuthPage && isLoggedIn && isApproved) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (
    isLoggedIn &&
    userRole === "seller" &&
    !isApproved &&
    !isPendingApprovalPage &&
    !isAuthPage
  ) {
    return NextResponse.redirect(new URL("/pending-approval", req.url));
  }

  const isAdminRoute = protectedRoutes.admin.some((route) =>
    nextUrl.pathname.startsWith(route),
  );
  if (isAdminRoute) {
    if (!isLoggedIn)
      return NextResponse.redirect(new URL("/auth/login", req.url));
    if (userRole !== "admin")
      return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  const isSellerRoute = protectedRoutes.seller.some((route) =>
    nextUrl.pathname.startsWith(route),
  );
  if (isSellerRoute) {
    if (!isLoggedIn)
      return NextResponse.redirect(new URL("/auth/login", req.url));
    if (userRole !== "seller")
      return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  const isCustomerRoute = protectedRoutes.customer.some((route) =>
    nextUrl.pathname.startsWith(route),
  );
  if (isCustomerRoute) {
    if (!isLoggedIn)
      return NextResponse.redirect(new URL("/auth/login", req.url));
    if (!isVerified)
      return NextResponse.redirect(new URL("/auth/verify-notice", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
