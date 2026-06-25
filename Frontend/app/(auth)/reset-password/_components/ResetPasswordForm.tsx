"use client";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleResetPassword } from "@/lib/actions/auth_actions";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTogglePassword } from "@/hooks/tooglepassword";
import { Eye, EyeOff } from "lucide-react";

export const ResetPasswordSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters long")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type ResetPasswordDTO = z.infer<typeof ResetPasswordSchema>;

export default function ResetPasswordForm({ token }: { token: string }) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordDTO>({
        resolver: zodResolver(ResetPasswordSchema)
    });
    const router = useRouter();

    const password = useTogglePassword();
    const confirmPassword = useTogglePassword();

    const onSubmit = async (data: ResetPasswordDTO) => {
        try {
            const response = await handleResetPassword(token, data.password);
            if (response.success) {
                toast.success("Password reset successfully");
                router.replace('/login');
            } else {
                toast.error(response.message || "Failed to reset password");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        }
    };

    return (
        <div className="min-h-screen bg-[#fffaf5] flex flex-col font-sans px-[5%] py-8">
            {/* Header */}
            <header className="mb-8">
                <Link href="/" className="text-[#c2210a] font-extrabold text-2xl no-underline">
                    GrubGO
                </Link>
            </header>

            {/* Main */}
            <main className="flex-1 flex items-center justify-center gap-20 max-w-300 mx-auto w-full">

                {/* Left Side */}
                <div className="flex-[1.2] hidden md:block">
                    <p className="text-[1.375rem] font-bold leading-tight text-[#1a1a1a] mb-10 max-w-120">
                        Almost there — set a new password and get back to your favourite meals.
                    </p>
                    <div className="w-full rounded-[40px] overflow-hidden shadow-[0_25px_50px_-12px_rgba(194,33,10,0.15)] h-125">
                        <img
                            src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWtwMGZmczB1bXVqc3JlcTVqbXdxbHBnYndtbDl6Y3ByYm9tc205byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BK1EfIsdkKZMY/giphy.gif"
                            alt="Delicious food"
                            className="w-full h-full object-cover block"
                        />
                    </div>
                </div>

                {/* Right Side — Card */}
                <div className="flex-1 flex justify-center">
                    <div className="bg-white p-12 rounded-[28px] w-full max-w-120 shadow-[0_10px_40px_rgba(0,0,0,0.04)] max-md:shadow-none max-md:bg-transparent max-md:px-6">
                        <h2 className="text-[1.8rem] font-extrabold mb-3 text-[#1a1a1a]">
                            Reset Password
                        </h2>
                        <p className="text-[#71717a] mb-8 text-[0.95rem] leading-relaxed">
                            Choose a strong new password for your account.
                        </p>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* Password */}
                            <div className="mb-6">
                                <label className="block text-[0.85rem] font-bold mb-2 text-[#3f3f46]">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={password.inputType}
                                        id="password"
                                        placeholder="••••••••"
                                        {...register("password")}
                                        className="w-full px-[1.1rem] py-[0.85rem] pr-12 text-black border-2 border-transparent bg-[#fff1f0] rounded-xl text-base outline-none transition-all duration-200 focus:bg-white focus:border-[#fecaca]"
                                    />
                                    <button
                                        type="button"
                                        onClick={password.toggleVisibility}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-[#c2210a] transition-colors"
                                        aria-label={password.isVisible ? "Hide password" : "Show password"}
                                    >
                                        {password.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="mb-6">
                                <label className="block text-[0.85rem] font-bold mb-2 text-[#3f3f46]">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={confirmPassword.inputType}
                                        id="confirmPassword"
                                        placeholder="••••••••"
                                        {...register("confirmPassword")}
                                        className="w-full px-[1.1rem] py-[0.85rem] pr-12 text-black border-2 border-transparent bg-[#fff1f0] rounded-xl text-base outline-none transition-all duration-200 focus:bg-white focus:border-[#fecaca]"
                                    />
                                    <button
                                        type="button"
                                        onClick={confirmPassword.toggleVisibility}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-[#c2210a] transition-colors"
                                        aria-label={confirmPassword.isVisible ? "Hide password" : "Show password"}
                                    >
                                        {confirmPassword.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#c2210a] hover:bg-[#a31b08] disabled:opacity-60 disabled:cursor-not-allowed text-white py-[1.1rem] border-none rounded-xl text-base font-extrabold cursor-pointer transition-colors duration-200"
                            >
                                {isSubmitting ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>

                        <div className="mt-6 text-center flex justify-center gap-6">
                            <Link
                                href="/login"
                                className="text-[#71717a] hover:text-[#c2210a] no-underline text-[0.9rem] font-semibold transition-colors duration-200"
                            >
                                Back to Login
                            </Link>
                            <Link
                                href="/request-password-reset"
                                className="text-[#71717a] hover:text-[#c2210a] no-underline text-[0.9rem] font-semibold transition-colors duration-200"
                            >
                                Request another reset email
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}