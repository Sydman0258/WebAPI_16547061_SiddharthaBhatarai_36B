"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRestaurant } from "@/lib/api/restaurant";

export default function RestaurantOnboarding() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        restaurantName: "",
        description: "",
        location: "",
        openingHours: "09:00 AM - 10:00 PM",
        foodTypes: [] as string[],
    });

    const [currentFoodType, setCurrentFoodType] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddFoodType = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && currentFoodType.trim()) {
            e.preventDefault();
            if (!formData.foodTypes.includes(currentFoodType.trim())) {
                setFormData((prev) => ({
                    ...prev,
                    foodTypes: [...prev.foodTypes, currentFoodType.trim()],
                }));
            }
            setCurrentFoodType("");
        }
    };

    const handleRemoveFoodType = (typeToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            foodTypes: prev.foodTypes.filter((t) => t !== typeToRemove),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const payload = {
            ...formData,
            status: "active",
        };

        try {
            const result = await createRestaurant(payload);
            if (result?.success) {
                router.push("/restaurant/");
            } else {
                setError(result?.message || "Failed to register restaurant profile");
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occcurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Set up your Restaurant 🍳
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Fill out these details to access your dashboard.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-100 rounded text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Restaurant Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Restaurant Name</label>
                            <input
                                type="text"
                                name="restaurantName"
                                required
                                value={formData.restaurantName}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border text-black border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
                                placeholder="The Flavor Palace"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Description</label>
                            <textarea
                                name="description"
                                rows={3}
                                required
                                value={formData.description}
                                onChange={handleInputChange}
                                className="mt-1 block w-full text-black rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
                                placeholder="Tell customers about your kitchen, signature dishes..."
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Location / Address</label>
                            <input
                                type="text"
                                name="location"
                                required
                                value={formData.location}
                                onChange={handleInputChange}
                                className="mt-1 block w-full text-black rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
                                placeholder="123 Main Street, City"
                            />
                        </div>

                        {/* Opening Hours */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Opening Hours</label>
                            <input
                                type="text"
                                name="openingHours"
                                required
                                value={formData.openingHours}
                                onChange={handleInputChange}
                                className="mt-1 block w-full text-black rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
                            />
                        </div>

                        {/* Food Types */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Cuisine / Food Types</label>
                            <p className="text-xs text-gray-400 mb-1">Type a cuisine (e.g., Italian, Vegan) and press Enter</p>
                            <input
                                type="text"
                                value={currentFoodType}
                                onChange={(e) => setCurrentFoodType(e.target.value)}
                                onKeyDown={handleAddFoodType}
                                className="block w-full text-black rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
                                placeholder="Add food tags..."
                            />
                            <div className="mt-2 flex flex-wrap gap-2">
                                {formData.foodTypes.map((type) => (
                                    <span
                                        key={type}
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800"
                                    >
                                        {type}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveFoodType(type)}
                                            className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-orange-400 hover:bg-orange-200 hover:text-orange-500 focus:outline-none"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                            >
                                {loading ? "Saving Profile..." : "Complete Setup"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}