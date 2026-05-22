import Link from 'next/link';
import './forgot_password.css';

export default function ForgotPasswordPage() {
    return (
        <div className="fp_container">
            <header className="fp_header">
                <div className="fp_logo_top">
                    <Link href="/">GrubGO</Link>
                </div>
            </header>

            <main className="fp_main">
                {/* Left Side: Brand & Visuals */}
                <div className="fp_left">
                    <h1 className="fp_brand">GrubGO</h1>
                    <p className="fp_tagline">
                        Don't worry, we'll help you get back to your favorite meals.
                    </p>
                    <div className="fp_image_wrapper">
                        <img
                            src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2ZsYzRiZXlkbmFpeXZnNnZ6ajN2ZDQybGN4OTVzNHNydzVkN3BlMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/rS4E6cd0bAt1LUrDRN/giphy.gif"
                            alt="Delicious Burger"
                            className="fp_img"
                        />
                    </div>
                </div>

                {/* Right Side: Form Card */}
                <div className="fp_right">
                    <div className="fp_card">
                        <h2>Forgot Password?</h2>
                        <p className="fp_subtitle">
                            Enter the email associated with your account and we'll send you a link to reset your password.
                        </p>

                        <form>
                            <div className="fp_form_group">
                                <label>Email Address</label>
                                <div className="fp_input_wrapper">
                                    <input 
                                        type="email" 
                                        placeholder="name@example.com" 
                                        required 
                                    />
                                </div>
                            </div>

                            <button type="submit" className="fp_submit_btn">
                                Send Reset Link
                            </button>
                        </form>

                        <div className="fp_footer_links">
                            <Link href="/login" className="back_to_login">
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}