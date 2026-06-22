import { NextResponse, NextRequest } from "next/server";

const publicRoutes = ["/login", "/register"];
const adminRoutes = ["/admin"];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const token = request.cookies.get("auth_token")?.value;
    const userData = request.cookies.get("user_data")?.value;
    const user = userData ? JSON.parse(userData) : null;

    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    if (!token && !isPublicRoute) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
    if (token && user && isAdminRoute && user.role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (token && isPublicRoute) {
        return NextResponse.redirect(new URL("/customer", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/register",
        "/customer",
        "/login",
        "/admin/:path*",
    ]
}