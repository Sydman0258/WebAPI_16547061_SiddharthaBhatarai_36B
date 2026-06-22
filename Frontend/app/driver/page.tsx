import { cookies } from "next/headers";
import { API } from "@/lib/api/endpoint";
import { redirect } from "next/navigation";

export default async function DriverHomePage() {
    redirect("/driver/dashboard");
}