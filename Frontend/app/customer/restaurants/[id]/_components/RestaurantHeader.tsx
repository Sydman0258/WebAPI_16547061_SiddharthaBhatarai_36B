export default function RestaurantHeader({ restaurant }: { restaurant: any }) {
    return (
        <div className="mb-8 border-b border-gray-100 pb-6">
            <div className="flex items-start gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                    {restaurant.restaurantImage ? (
                        <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}${restaurant.restaurantImage}`}
                            alt={restaurant.restaurantName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-3xl">🍽️</span>
                    )}
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900">{restaurant.restaurantName}</h1>
                    <p className="text-sm text-gray-500 mt-1">{restaurant.description}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap text-xs text-gray-400">
                        <span>📍 {restaurant.location}</span>
                        <span>🕒 {restaurant.openingHours}</span>
                        <span className={`font-semibold ${restaurant.status === "open" ? "text-green-500" : "text-red-400"}`}>
                            {restaurant.status}
                        </span>
                    </div>
                    <div className="flex gap-2 mt-2 flex-wrap">
                        {restaurant.foodTypes?.map((type: string) => (
                            <span key={type} className="px-2 py-0.5 bg-orange-50 text-orange-600 text-xs font-medium rounded-full">
                                {type}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}