"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/api/axiosinstance";
import { API } from "@/lib/api/endpoint";
import { RestaurantProfileSchema, RestaurantProfileFormType } from "./RestaurantProfileSchema";

export default function RestaurantProfileForm({ restaurant }: { restaurant: any }) {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RestaurantProfileFormType>({
        resolver: zodResolver(RestaurantProfileSchema),
        defaultValues: {
            restaurantName: restaurant.restaurantName,
            description: restaurant.description,
            location: restaurant.location,
            openingHours: restaurant.openingHours,
            status: restaurant.status,
        },
    });

    const onSubmit = async (data: RestaurantProfileFormType) => {
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, val]) => {
                if (val !== undefined && key !== "restaurantImage") formData.append(key, String(val));
            });
            if (data.restaurantImage instanceof File) {
                formData.append("restaurantImage", data.restaurantImage);
            }
            await axiosInstance.put(API.RESTAURANT.UPDATE(restaurant._id), formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Profile updated");
            router.refresh();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Update failed");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-5">
            {[
                { name: "restaurantName", label: "Restaurant Name" },
                { name: "location", label: "Location" },
                { name: "openingHours", label: "Opening Hours" },
                { name: "status", label: "Status" },
            ].map(({ name, label }) => (
                <div key={name} className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
                    <input
                        {...register(name as any)}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                    />
                    {errors[name as keyof RestaurantProfileFormType] && (
                        <p className="text-xs text-red-500">{errors[name as keyof RestaurantProfileFormType]?.message as string}</p>
                    )}
                </div>
            ))}
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
                <textarea rows={3} {...register("description")}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Restaurant Image</label>
                <input type="file" accept=".jpg,.jpeg,.png,.webp" {...register("restaurantImage")}
                    className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-600"
                />
            </div>
            <div className="flex justify-end pt-2">
                <button type="submit" disabled={isSubmitting}
                    className="px-5 py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 disabled:opacity-50"
                >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </form>
    );
}