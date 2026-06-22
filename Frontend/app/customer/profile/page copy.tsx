import { notFound } from "next/navigation";

export default async function Page() {
    const result = await new Promise((resolve) => setTimeout(resolve, 5000));
    // will show loading
    if(1!==1){
        throw new Error("Server Error");
    }
    if(0!==0){
        notFound();
    }
    return (
        <div>
            Page Content
        </div>
    );
}