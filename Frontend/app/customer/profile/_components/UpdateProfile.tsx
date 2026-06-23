"use client";

import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { toast } from "react-toastify";
import { User, Lock, MapPin, Camera, X } from "lucide-react";
import { getUserData } from "@/lib/actions/auth_actions";

import Navbar from "../../_components/Navbar";
import { handleUpdateProfile } from "@/lib/actions/auth_actions";
import { useAuth } from "@/lib/context/authContext";
import { UpdateFormType, UserUpdateSchema } from "../_components/UserUpdateSchema";




export default function UpdateUserForm({ user }: { user: any }) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<UpdateFormType>({
        resolver: zodResolver(UserUpdateSchema),
        values: {
            fullname: user?.fullname || "",
            password: "", 
            address: user?.address || "",
        },
    });

    const [error, setError] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { checkAuth } = useAuth();

    const handleImageChange = (file: File | undefined, onChange: (file: File | undefined) => void) => {
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

    const handleDismissImage = (onChange?: (file: File | undefined) => void) => {
        setPreviewImage(null);
        onChange?.(undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

   const onSubmit = async (data: UpdateFormType) => {
    setError(null);
    try {
        const formData = new FormData();
        
        if (data.fullname) {
            formData.append('fullname', data.fullname);
        }
        if (data.password?.trim()) {
            formData.append('password', data.password);
        }
        if (data.address) {
            formData.append('address', data.address);
        }
        
        // CHANGED THIS LINE: Match your backend's uploads.single("profileImage")
        if (data.imageUrl) {
            formData.append('profileImage', data.imageUrl); 
        }
        
        const response = await handleUpdateProfile(formData);
        if (!response.success) {
            throw new Error(response.message || 'Update profile failed');
        }

        if (typeof checkAuth === "function") {
            await checkAuth();
        }

        handleDismissImage();
        toast.success('Profile updated successfully');
    } catch (error: any) {
        toast.error(error.message || 'Profile update failed');
        setError(error.message || 'Profile update failed');
    }
};
    return (
        <div className="min-h-screen bg-white text-gray-900">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 my-6">
                    {/* Form Header */}
                    <div className="mb-8 border-b border-gray-100 pb-5">
                        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Account Settings</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Update your profile details and manage your credentials.
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        {error && (
                            <div className="p-3 bg-red-50 text-xs font-semibold text-red-600 rounded-xl animate-pulse">
                                {error}
                            </div>
                        )}

                        {/* Profile Image Section */}
                        <div className="flex flex-col sm:flex-row items-center gap-5 bg-orange-50/20 border border-dashed border-orange-100 rounded-2xl p-5 mb-2">
                            <div className="relative group w-24 h-24 shrink-0">
                                {previewImage ? (
                                    <div className="w-24 h-24 relative">
                                        <img
                                            src={previewImage}
                                            alt="Profile Image Preview"
                                            className="w-24 h-24 rounded-full object-cover ring-4 ring-orange-100 shadow-sm"
                                        />
                                        <Controller
                                            name="imageUrl"
                                            control={control}
                                            render={({ field }) => (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDismissImage(field.onChange)}
                                                    className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-700 transition-colors"
                                                >
                                                    <X size={14} />
                                                </button>
                                            )}
                                        />
                                    </div>
                                ) : user?.imageUrl ? (
                                    <div className="w-24 h-24 relative">
                                        <Image
                                            src={process.env.NEXT_PUBLIC_API_URL + user.imageUrl}
                                            alt="Profile Image"
                                            width={96}
                                            height={96}
                                            className="w-24 h-24 rounded-full object-cover ring-4 ring-gray-50 shadow-sm"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 ring-4 ring-gray-50">
                                        <User size={40} strokeWidth={1.5} />
                                    </div>
                                )}
                            </div>

                            <div className="text-center sm:text-left space-y-2">
                                <h4 className="text-sm font-bold text-gray-900">Profile Picture</h4>
                                <p className="text-xs text-gray-400 max-w-xs">
                                    JPG, JPEG, PNG or WEBP. Max size of 5MB.
                                </p>

                                <Controller
                                    name="imageUrl"
                                    control={control}
                                    render={({ field }) => (
                                        <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-sm hover:border-orange-200 hover:text-orange-600 transition-colors cursor-pointer">
                                            <Camera size={14} />
                                            Choose Photo
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                className="hidden"
                                                onChange={(e) =>
                                                    handleImageChange(e.target.files?.[0], field.onChange)
                                                }
                                                accept=".jpg,.jpeg,.png,.webp"
                                            />
                                        </label>
                                    )}
                                />
                            </div>
                        </div>
                        {errors.imageUrl && (
                            <p className="-mt-4 text-xs font-medium text-red-600 px-1">
                                {errors.imageUrl.message as string}
                            </p>
                        )}

                        {/* Grid Inputs Area */}
                        <div className="grid grid-cols-1 gap-5">
                            {/* Full Name Input */}
                            <div className="space-y-1.5">
                                <label
                                    className="text-xs font-bold uppercase tracking-wider text-gray-500"
                                    htmlFor="fullname"
                                >
                                    Full Name
                                </label>
                                <div className="relative flex items-center">
                                    <User size={18} className="absolute left-3.5 text-gray-400" />
                                    <input
                                        id="fullname"
                                        type="text"
                                        {...register("fullname")}
                                        placeholder="Enter your full name"
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:bg-white transition-all shadow-inner"
                                    />
                                </div>
                                {errors.fullname && (
                                    <p className="text-xs font-medium text-red-600 px-1">{errors.fullname.message}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-1.5">
                                <label
                                    className="text-xs font-bold uppercase tracking-wider text-gray-500"
                                    htmlFor="password"
                                >
                                    Password
                                </label>
                                <div className="relative flex items-center">
                                    <Lock size={18} className="absolute left-3.5 text-gray-400" />
                                    <input
                                        id="password"
                                        type="password"
                                        {...register("password")}
                                        placeholder="Enter a new password"
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:bg-white transition-all shadow-inner"
                                    />
                                </div>
                                {errors.password && (
                                    <p className="text-xs font-medium text-red-600 px-1">{errors.password.message}</p>
                                )}
                            </div>

                            {/* Address Field */}
                            <div className="space-y-1.5">
                                <label
                                    className="text-xs font-bold uppercase tracking-wider text-gray-500"
                                    htmlFor="address"
                                >
                                    Address
                                </label>
                                <div className="relative flex items-center">
                                    <MapPin size={18} className="absolute left-3.5 text-gray-400" />
                                    <input
                                        id="address"
                                        type="text"
                                        {...register("address")}
                                        placeholder="Enter your delivery address"
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:bg-white transition-all shadow-inner"
                                    />
                                </div>
                                {errors.address && (
                                    <p className="text-xs font-medium text-red-600 px-1">{errors.address.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Submit Action Button */}
                        <div className="pt-4 border-t border-gray-50 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 shadow-sm disabled:opacity-50 transition-colors"
                            >
                                {isSubmitting ? "Saving changes..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}