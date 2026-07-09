import { NextResponse, NextRequest } from "next/server";

const publicRoutes = ["/login", "/register"];
const adminRoutes = ["/admin"];
const restaurantRoutes = ["/restaurant"];

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

    // 3. Protect Restaurant Routes
    const isRestaurantRoute = restaurantRoutes.some(route => pathname.startsWith(route));
    if (token && user && isRestaurantRoute && user.role !== "restaurant") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (token && isPublicRoute && user) {
        if (user.role === "admin") {
            return NextResponse.redirect(new URL("/admin", request.url));
        }
        if (user.role === "restaurant") {
            return NextResponse.redirect(new URL("/restaurant/settings", request.url));
        }
        
        return NextResponse.redirect(new URL("/customer", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/register",
        "/customer/:path*",
        "/login",
        "/admin/:path*",
        "/restaurant/:path*", 
    ]
}