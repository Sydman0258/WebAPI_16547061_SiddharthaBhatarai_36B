import { NextResponse, NextRequest } from "next/server";
import { getUserData,getTokenCookie  } from "./lib/cookies";
const publicRoutes = ["/login", "/register"];
const adminRoutes = ["/admin"];
export async function proxy(request: NextRequest){
    const { pathname } = request.nextUrl; // which path
    const token = await getTokenCookie();
    const user = await getUserData();

    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
    if(!token && !isPublicRoute){
        return NextResponse.redirect(new URL("/login", request.url));
    }
    
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
    if(token && user){
        if(isAdminRoute && user.role !== "admin"){
            return NextResponse.redirect(new URL("/unauthorized", request.url));
        }
    }

    if(token && isPublicRoute){
        return NextResponse.redirect(new URL("/customer", request.url));
    }

    return NextResponse.next(); // continue to page
}

export const config = {
    matcher: [
        "/register", // which path to apply
        "/customer",
        "/login",
        "/admin/:path*", // match all admin routes 
    ]
}