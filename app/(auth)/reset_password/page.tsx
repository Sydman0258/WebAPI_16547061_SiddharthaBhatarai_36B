import Link from 'next/link';
import './reset_password.css';

export default function ResetPasswordPage() {
    return (
        <div className="rp_container">
            <header className="rp_header">
                <div className="rp_logo_top">
                    <Link href="/">GrubGO</Link>
                </div>
            </header>

            <main className="rp_main">
                <div className="rp_left">
                    <h1 className="rp_brand">GrubGO</h1>
                    <p className="rp_tagline">
                        Secure your account and get back to browsing.
                    </p>
                    <div className="rp_image_wrapper">
                        <img
                            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop"
                            alt="Fresh Tacos"
                            className="rp_img"
                        />
                    </div>
                </div>

                <div className="rp_right">
                    <div className="rp_card">
                        <h2>Reset Password</h2>
                        <p className="rp_subtitle">
                            Please enter a strong new password for your account.
                        </p>

                        <form>
                            <div className="rp_form_group">
                                <label>New Password</label>
                                <div className="rp_input_wrapper">
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="rp_form_group">
                                <label>Confirm New Password</label>
                                <div className="rp_input_wrapper">
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="rp_submit_btn">
                                Update Password
                            </button>
                        </form>

                        <div className="rp_footer_links">
                            <p className="rp_help_text">
                                Need help? <Link href="/support">Contact Support</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}