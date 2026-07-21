import { NextResponse, NextRequest } from "next/server";

const publicRoutes = ["/login", "/register", "/forgot_password", "/reset-password", "/anauthorised","/"];
const adminRoutes = ["/admin"];
const restaurantRoutes = ["/restaurant"];

function isPathMatch(pathname: string, routes: string[]) {
    return routes.some((route) => {
        if (route === "/") return pathname === "/";
        return pathname === route || pathname.startsWith(`${route}/`);
    });
}

function getUserFromCookies(request: NextRequest) {
    const userData = request.cookies.get("user_data")?.value;

    if (!userData) {
        return null;
    }

    try {
        return JSON.parse(userData);
    } catch {
        return null;
    }
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    if (pathname.includes("/esewa-callback")) {
    return NextResponse.next();
  }
    const token = request.cookies.get("auth_token")?.value;
    const user = getUserFromCookies(request);

    const isPublicRoute = isPathMatch(pathname, publicRoutes);
    const isAdminRoute = isPathMatch(pathname, adminRoutes);
    const isRestaurantRoute = isPathMatch(pathname, restaurantRoutes);

    if (!token && !isPublicRoute) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (token && user) {
        if (isAdminRoute && user.role !== "admin") {
            return NextResponse.redirect(new URL("/unauthorized", request.url));
        }

        if (isRestaurantRoute && user.role !== "restaurant") {
            return NextResponse.redirect(new URL("/unauthorized", request.url));
        }

        if (isPublicRoute) {
            if (user.role === "admin") {
                return NextResponse.redirect(new URL("/admin", request.url));
            }
            if (user.role === "restaurant") {
                return NextResponse.redirect(new URL("/restaurant/settings", request.url));
            }

            return NextResponse.redirect(new URL("/customer", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|txt|map)$).*)",
    ],
};