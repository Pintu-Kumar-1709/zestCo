

import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

 
  const session = await auth()


  const publicRoutes = ["/login", "/register", "/api/auth"];

  if (!session) {

    if (publicRoutes.some((path) => pathname.startsWith(path))) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (session) {
    if (pathname === "/login" || pathname === "/register") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  const role = session.user?.role
  
  if(pathname.startsWith("/user") && role!=="user"){
    return NextResponse.redirect(new URL ("/unauthorized", req.url))
  }

  if(pathname.startsWith("/delivery") && role!=="deliveryBoy"){
    return NextResponse.redirect(new URL ("/unauthorized", req.url))
  }

  if(pathname.startsWith("/admin") && role!=="admin"){
    return NextResponse.redirect(new URL ("/unauthorized", req.url))
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};