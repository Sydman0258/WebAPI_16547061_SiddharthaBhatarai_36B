export default function ReviewCard({ review }: { review: any }) {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="font-semibold text-sm text-gray-900">
                        {review.customerId?.fullname ?? "Customer"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                    {review.comment && (
                        <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
                    )}
                </div>
                <div className="flex items-center gap-1 bg-orange-50 px-2.5 py-1 rounded-xl shrink-0">
                    <span className="text-orange-500 text-sm">⭐</span>
                    <span className="text-sm font-bold text-orange-600">{review.rating}</span>
                </div>
            </div>
        </div>
    );
}