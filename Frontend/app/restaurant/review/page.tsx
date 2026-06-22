import { cookies } from "next/headers";
import { API } from "@/lib/api/endpoint";
import ReviewCard from "./_components/ReviewCard";

async function getRestaurant(token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${API.RESTAURANT.GET_MY}`, {
        headers: { Authorization: `Bearer ${token}` }, cache: "no-store",
    });
    return (await res.json())?.data ?? null;
}

async function getReviews(restaurantId: string, token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${API.REVIEW.GET_BY_RESTAURANT(restaurantId)}`, {
        headers: { Authorization: `Bearer ${token}` }, cache: "no-store",
    });
    return (await res.json())?.data ?? [];
}

export default async function ReviewPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value ?? "";
    const restaurant = await getRestaurant(token);
    const reviews = restaurant ? await getReviews(restaurant._id, token) : [];

    const avg = reviews.length
        ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1)
        : "—";

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900">Reviews</h1>
                    <p className="text-sm text-gray-400 mt-1">{reviews.length} reviews · ⭐ {avg} avg</p>
                </div>
            </div>
            {reviews.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <span className="text-4xl block mb-3">⭐</span>
                    <p className="text-sm font-medium">No reviews yet</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((r: any) => <ReviewCard key={r._id} review={r} />)}
                </div>
            )}
        </div>
    );
}