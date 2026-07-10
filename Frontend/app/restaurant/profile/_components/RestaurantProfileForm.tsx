"use client";

import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { toast } from "react-toastify";
import { Camera, X } from "lucide-react";
import axiosInstance from "@/lib/api/axiosinstance";
import { API } from "@/lib/api/endpoint";
import {
    RestaurantProfileSchema,
    RestaurantProfileFormType,
} from "./RestaurantProfileSchema";

export default function RestaurantProfileForm({
    restaurant,
}: {
    restaurant: any;
}) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<RestaurantProfileFormType>({
        resolver: zodResolver(RestaurantProfileSchema),
        values: {
            restaurantName: restaurant?.restaurantName || "",
            description: restaurant?.description || "",
            location: restaurant?.location || "",
            openingHours: restaurant?.openingHours || "",
            status: restaurant?.status ?? true,
        },
    });

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (
        file: File | undefined,
        onChange: (file: File | undefined) => void
    ) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
        onChange(file);
    };

    const removeImage = (onChange?: (file: File | undefined) => void) => {
        setPreviewImage(null);
        onChange?.(undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const onSubmit = async (data: RestaurantProfileFormType) => {
        try {
            const formData = new FormData();

            if (data.restaurantName)
                formData.append("restaurantName", data.restaurantName);

            if (data.description)
                formData.append("description", data.description);

            if (data.location) formData.append("location", data.location);

            if (data.openingHours)
                formData.append("openingHours", data.openingHours);

            if (data.status) formData.append("status", String(data.status));

            if (data.restaurantImage) {
                formData.append("restaurantImage", data.restaurantImage);
            }

            const res = await axiosInstance.put(
                API.RESTAURANT.UPDATE(restaurant._id),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (!res.data?.success) {
                throw new Error(res.data?.message || "Update failed");
            }

            toast.success("Restaurant updated successfully");
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Update failed");
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-6"
        >
            <div className="flex flex-col sm:flex-row items-center gap-5 border border-dashed border-gray-200 rounded-2xl p-5">
                <div className="relative w-24 h-24">
                    {previewImage ? (
                        <>
                            <img
                                src={previewImage}
                                alt="preview"
                                className="w-24 h-24 rounded-full object-cover"
                            />
                            <Controller
                                name="restaurantImage"
                                control={control}
                                render={({ field }) => (
                                    <button
                                        type="button"
                                        onClick={() => removeImage(field.onChange)}
                                        className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            />
                        </>
                    ) : restaurant?.restaurantImage ? (
                        <Image
                            src={
                                process.env.NEXT_PUBLIC_API_URL +
                                restaurant.restaurantImage
                            }
                            alt="restaurant"
                            width={96}
                            height={96}
                            className="w-24 h-24 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                            <Camera />
                        </div>
                    )}
                </div>

                <Controller
                    name="restaurantImage"
                    control={control}
                    render={({ field }) => (
                        <label className="cursor-pointer text-sm font-medium text-orange-600">
                            Change Image
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                accept=".jpg,.jpeg,.png,.webp"
                                onChange={(e) =>
                                    handleImageChange(
                                        e.target.files?.[0],
                                        field.onChange
                                    )
                                }
                            />
                        </label>
                    )}
                />
            </div>

            {errors.restaurantImage && (
                <p className="text-xs text-red-500">
                    {errors.restaurantImage.message as string}
                </p>
            )}
            {/* TEXT FIELDS */}
            {[
                { name: "restaurantName", label: "Restaurant Name" },
                { name: "location", label: "Location" },
                { name: "openingHours", label: "Opening Hours" },
            ].map((field) => (
                <div key={field.name} className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                        {field.label}
                    </label>

                    <input
                        {...register(field.name as any)}
                        className="w-full px-3 py-2 border rounded-xl text-sm text-black bg-gray-50"
                    />

                    {errors[field.name as keyof RestaurantProfileFormType] && (
                        <p className="text-xs text-red-500">
                            {
                                errors[
                                    field.name as keyof RestaurantProfileFormType
                                ]?.message as string
                            }
                        </p>
                    )}
                </div>
            ))}

<div className="space-y-2">
    <label className="text-xs font-bold text-gray-500 uppercase">
        Restaurant Status
    </label>

    <Controller
        name="status"
        control={control}
        render={({ field }) => (
            <div className="flex rounded-xl overflow-hidden border border-gray-300">
                <button
                    type="button"
                    onClick={() => field.onChange(true)}
                    className={`flex-1 py-3 transition-all ${
                        field.value
                            ? "bg-green-500 text-white"
                            : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                >
                     Open
                </button>

                <button
                    type="button"
                    onClick={() => field.onChange(false)}
                    className={`flex-1 py-3 transition-all ${
                        !field.value
                            ? "bg-red-500 text-white"
                            : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                >
                    Closed
                </button>
            </div>
        )}
    />
</div>

            <div className="space-y-1.5">
                <label className="text-xs font-bold text-black uppercase">
                    Description
                </label>

                <textarea
                    rows={3}
                    {...register("description")}
                    className="w-full px-3 py-2 border rounded-xl text-sm text-black bg-gray-50"
                />
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-black uppercase">
                    Description
                </label>
                <textarea
                    rows={3}
                    {...register("description")}
                    className="w-full px-3 py-2 border rounded-xl text-sm text-black bg-gray-50"
                />
            </div>

            {/* SUBMIT */}
            <div className="flex justify-end pt-3">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-red-600 text-black rounded-xl font-bold text-sm disabled:opacity-50"
                >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </form>
    );
}