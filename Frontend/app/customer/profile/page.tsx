import { getUserData } from "@/lib/actions/auth_actions";
import { notFound } from "next/navigation";
import UpdateForm from "./_components/UpdateProfile";

export const dynamic = "force-dynamic";

export default async function Page() {
    const userData = await getUserData();
    if (!userData.success) {
        throw new Error(userData.message 
            || "Failed to fetch user data");
    }
    if (!userData.data) {
        notFound();
    }
    return (
        <div>
     
            <UpdateForm user={userData.data} />
        </div>
    );
}