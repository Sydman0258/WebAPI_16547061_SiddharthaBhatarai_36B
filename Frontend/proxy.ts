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

    // 1. If no token and trying to access a protected route, send to login
    if (!token && !isPublicRoute) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // 2. Protect Admin Routes
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
    if (token && user && isAdminRoute && user.role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // 3. Protect Restaurant Routes
    const isRestaurantRoute = restaurantRoutes.some(route => pathname.startsWith(route));
    if (token && user && isRestaurantRoute && user.role !== "restaurant") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // 4. Fix the loop: Route logged-in users to their specific roles instead of defaulting to /customer
    if (token && isPublicRoute && user) {
        if (user.role === "admin") {
            return NextResponse.redirect(new URL("/admin", request.url));
        }
        if (user.role === "restaurant") {
            return NextResponse.redirect(new URL("/restaurant/settings", request.url));
        }
        
        // Fallback for regular customers
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
        "/restaurant/:path*", // Added to intercept restaurant settings/profile routing
    ]
}