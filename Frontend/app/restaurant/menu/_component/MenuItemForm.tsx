"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/api/axiosinstance";
import { API } from "@/lib/api/endpoint";
import { MenuItemSchema, MenuItemFormType } from "./MenuItemSchema";

export default function MenuItemForm({
    restaurantId,
    item,
    onClose,
    onSuccess,
}: {
    restaurantId: string;
    item?: any;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<MenuItemFormType>({
        resolver: zodResolver(MenuItemSchema),
        defaultValues: item ? {
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            preparationTime: item.preparationTime,
        } : {},
    });

    const onSubmit = async (data: MenuItemFormType) => {
    try {
        const formData = new FormData();
        
        // Append text fields safely
        formData.append("name", data.name);
        formData.append("category", data.category);
        if (data.description) formData.append("description", data.description);
        
        // Explicitly append numbers (FormData converts these to strings, 
        // so your BACKEND schema must use z.coerce.number() as well!)
        formData.append("price", String(data.price));
        formData.append("preparationTime", String(data.preparationTime));

        if (data.imageUrl instanceof File) {
            formData.append("itemImage", data.imageUrl);
        }

        if (item) {
            console.log("Submitting to Restaurant ID:", restaurantId);
            await axiosInstance.put(API.MENU.UPDATE(item._id), formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Item updated");
        } else {
            await axiosInstance.post(API.MENU.CREATE(restaurantId), formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Item created");
        }
        onSuccess();
    } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to save item");
    }
};

    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-900">{item ? "Edit Item" : "Add Item"}</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm">✕ Close</button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                    { name: "name", label: "Name", type: "text" },
                    { name: "category", label: "Category", type: "text" },
                    { name: "price", label: "Price", type: "number" },
                    { name: "preparationTime", label: "Prep Time (mins)", type: "number" },
                ].map(({ name, label, type }) => (
                    <div key={name} className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
                        <input
                            type={type}
                            step={name === "price" ? "0.01" : "1"}
                            {...register(name as any, { valueAsNumber: type === "number" })}
                            className="w-full px-3 py-2.5 bg-gray-50 border text-black  border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                        />
                        {errors[name as keyof MenuItemFormType] && (
                            <p className="text-xs text-red-500">{errors[name as keyof MenuItemFormType]?.message as string}</p>
                        )}
                    </div>
                ))}

                <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
                    <textarea
                        rows={2}
                        {...register("description")}
                        className="w-full px-3 py-2.5 bg-gray-50 border text-black  border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                    />
                    {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                </div>

                <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Image</label>
                    <Controller
                        name="imageUrl"
                        control={control}
                        render={({ field: { onChange, ref } }) => (
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.webp"
                                ref={ref}
                                onChange={(e) => onChange(e.target.files?.[0])}
                                className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-600"
                            />
                        )}
                    />
                    {errors.imageUrl && (
                        <p className="text-xs text-red-500">{errors.imageUrl.message as string}</p>
                    )}
                </div>

                <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-5 py-2 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 disabled:opacity-50"
                    >
                        {isSubmitting ? "Saving..." : item ? "Update" : "Create"}
                    </button>
                </div>
            </form>
        </div>
    );
}