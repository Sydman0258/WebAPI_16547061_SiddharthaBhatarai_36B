"use client";

import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { toast } from "react-toastify";
import { User, Lock, MapPin, Camera, X, Menu, CreditCard, ChevronRight } from "lucide-react";

import Navbar from "../../_components/Navbar";
import { handleUpdateProfile } from "@/lib/actions/auth_actions";
import { useAuth } from "@/lib/context/authContext";
import { UpdateFormType, UserUpdateSchema } from "../_components/UserUpdateSchema";
import PaymentMethods from "./PaymentMethods";

const SECTIONS = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Password", icon: Lock },
    { id: "address", label: "Address", icon: MapPin },
    { id: "payment", label: "Payment methods", icon: CreditCard },
];

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
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("profile");
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

    const scrollToSection = (id: string) => {
        setActiveSection(id);
        setDrawerOpen(false);
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div className="min-h-screen bg-[#FAF7F2]">
            <Navbar />

            {/* Settings shell: fixed-height row below the main navbar so sidebar + content scroll independently */}
            <div className="flex h-[calc(100vh-4rem)]">

                {/* Mobile drawer backdrop */}
                {drawerOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/40 md:hidden"
                        onClick={() => setDrawerOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={`
                        fixed md:static z-50 md:z-auto top-16 md:top-0 bottom-0 left-0
                        w-[272px] shrink-0 h-[calc(100vh-4rem)] md:h-full
                        bg-white/80 md:bg-white/70 backdrop-blur-xl
                        border-r border-stone-200/60
                        overflow-y-auto
                        transition-transform duration-300 ease-out
                        ${drawerOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                    `}
                >
                    <div className="p-6">
                        <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-4 px-2">
                            Account
                        </p>
                        <nav className="space-y-1">
                            {SECTIONS.map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => scrollToSection(id)}
                                    className={`
                                        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                                        transition-all duration-200 group
                                        ${activeSection === id
                                            ? "bg-gradient-to-r from-orange-500/10 to-rose-500/10 text-orange-700"
                                            : "text-stone-600 hover:bg-stone-100/80 hover:text-stone-900"
                                        }
                                    `}
                                >
                                    <Icon size={17} className={activeSection === id ? "text-orange-600" : "text-stone-400 group-hover:text-stone-600"} />
                                    <span className="flex-1 text-left">{label}</span>
                                    {activeSection === id && (
                                        <ChevronRight size={14} className="text-orange-400" />
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Main content — scrolls independently */}
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-8 sm:py-10">

                        {/* Mobile page bar */}
                        <div className="flex items-center justify-between mb-6 md:hidden">
                            <div>
                                <h1 className="text-xl font-extrabold tracking-tight text-stone-900">Account Settings</h1>
                                <p className="text-xs text-stone-500 mt-0.5">Manage your profile and preferences</p>
                            </div>
                            <button
                                onClick={() => setDrawerOpen(true)}
                                className="w-10 h-10 rounded-xl bg-white border border-stone-200 shadow-sm flex items-center justify-center text-stone-600"
                            >
                                <Menu size={18} />
                            </button>
                        </div>

                        {/* Desktop page header */}
                        <div className="hidden md:block mb-8">
                            <h1 className="text-3xl font-extrabold tracking-tight text-stone-900">Account Settings</h1>
                            <p className="mt-1.5 text-sm text-stone-500">
                                Update your profile details and manage your credentials.
                            </p>
                        </div>

                        <div className="space-y-8">

                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 text-sm font-medium text-red-600 rounded-2xl">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                                {/* Profile section */}
                                <section
                                    id="profile"
                                    className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6 sm:p-8 scroll-mt-6"
                                >
                                    <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-6">
                                        Profile
                                    </h2>

                                    {/* Avatar upload — signature element: soft gradient ring, brightens on hover */}
                                    <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                                        <div className="relative group w-24 h-24 shrink-0">
                                            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-orange-400 via-rose-400 to-orange-300 opacity-40 group-hover:opacity-80 blur-[2px] transition-opacity duration-300" />
                                            {previewImage ? (
                                                <div className="relative w-24 h-24">
                                                    <img
                                                        src={previewImage}
                                                        alt="Profile Image Preview"
                                                        className="relative w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-sm"
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
                                                <div className="relative w-24 h-24">
                                                    <Image
                                                        src={process.env.NEXT_PUBLIC_API_URL + user.imageUrl}
                                                        alt="Profile Image"
                                                        width={96}
                                                        height={96}
                                                        className="relative w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-sm"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="relative w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 ring-4 ring-white">
                                                    <User size={40} strokeWidth={1.5} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-center sm:text-left space-y-2">
                                            <h4 className="text-sm font-bold text-stone-900">Profile Picture</h4>
                                            <p className="text-xs text-stone-400 max-w-xs">
                                                JPG, JPEG, PNG or WEBP. Max size of 5MB.
                                            </p>

                                            <Controller
                                                name="imageUrl"
                                                control={control}
                                                render={({ field }) => (
                                                    <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 shadow-sm hover:border-orange-200 hover:text-orange-600 transition-colors cursor-pointer">
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
                                        <p className="-mt-4 mb-4 text-xs font-medium text-red-600 px-1">
                                            {errors.imageUrl.message as string}
                                        </p>
                                    )}

                                    <div className="space-y-1.5">
                                        <label
                                            className="text-xs font-bold uppercase tracking-wider text-stone-500"
                                            htmlFor="fullname"
                                        >
                                            Full Name
                                        </label>
                                        <div className="relative flex items-center">
                                            <User size={18} className="absolute left-3.5 text-stone-400" />
                                            <input
                                                id="fullname"
                                                type="text"
                                                {...register("fullname")}
                                                placeholder="Enter your full name"
                                                className="w-full pl-11 pr-4 py-3 bg-stone-50/50 border border-stone-100 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:bg-white transition-all"
                                            />
                                        </div>
                                        {errors.fullname && (
                                            <p className="text-xs font-medium text-red-600 px-1">{errors.fullname.message}</p>
                                        )}
                                    </div>
                                </section>

                                {/* Security section */}
                                <section
                                    id="security"
                                    className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6 sm:p-8 scroll-mt-6"
                                >
                                    <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-6">
                                        Security
                                    </h2>
                                    <div className="space-y-1.5">
                                        <label
                                            className="text-xs font-bold uppercase tracking-wider text-stone-500"
                                            htmlFor="password"
                                        >
                                            Password
                                        </label>
                                        <div className="relative flex items-center">
                                            <Lock size={18} className="absolute left-3.5 text-stone-400" />
                                            <input
                                                id="password"
                                                type="password"
                                                {...register("password")}
                                                placeholder="Enter a new password"
                                                className="w-full pl-11 pr-4 py-3 bg-stone-50/50 border border-stone-100 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:bg-white transition-all"
                                            />
                                        </div>
                                        {errors.password && (
                                            <p className="text-xs font-medium text-red-600 px-1">{errors.password.message}</p>
                                        )}
                                    </div>
                                </section>

                                {/* Address section */}
                                <section
                                    id="address"
                                    className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6 sm:p-8 scroll-mt-6"
                                >
                                    <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-6">
                                        Delivery Address
                                    </h2>
                                    <div className="space-y-1.5">
                                        <label
                                            className="text-xs font-bold uppercase tracking-wider text-stone-500"
                                            htmlFor="address"
                                        >
                                            Address
                                        </label>
                                        <div className="relative flex items-center">
                                            <MapPin size={18} className="absolute left-3.5 text-stone-400" />
                                            <input
                                                id="address"
                                                type="text"
                                                {...register("address")}
                                                placeholder="Enter your delivery address"
                                                className="w-full pl-11 pr-4 py-3 bg-stone-50/50 border border-stone-100 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:bg-white transition-all"
                                            />
                                        </div>
                                        {errors.address && (
                                            <p className="text-xs font-medium text-red-600 px-1">{errors.address.message}</p>
                                        )}
                                    </div>
                                </section>

                                {/* Save bar */}
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full sm:w-auto px-6 py-3 bg-linear-to-r from-orange-500 to-rose-500 text-white rounded-xl text-sm font-bold hover:opacity-90 shadow-sm disabled:opacity-50 transition-opacity"
                                    >
                                        {isSubmitting ? "Saving changes..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>

                            {/* Payment methods section */}
                            <section
                                id="payment"
                                className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6 sm:p-8 scroll-mt-6"
                            >
                                <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-6">
                                    Payment Methods
                                </h2>
                                <PaymentMethods />
                            </section>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}