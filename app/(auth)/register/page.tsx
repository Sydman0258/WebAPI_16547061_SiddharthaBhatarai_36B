import Link from 'next/link';
import './register.css';

export default function RegisterPage() {
    return (
        <div className="reg_container">
            <header className="reg_header">
                <div className="reg_logo_top">
                    <Link href="/">GrubGO</Link>
                </div>
            </header>

            <main className="reg_main">
                <div className="reg_left">
                    <p className="reg_tagline">
                        Join the community and get fresh meals delivered today.
                    </p>
                    <div className="reg_image_wrapper">
                        <img
                            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop"
                            alt="Fresh Pizza"
                            className="reg_img"
                        />
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="reg_right">
                    <div className="reg_card">
                        <h2>Create Account</h2>
                        <p className="reg_subtitle">Start your journey with GrubGO.</p>

                        <form>
                            <div className="reg_form_grid">
                                {/* Row 1: First and Last Name */}
                                <div className="reg_form_group full_width">
                                    <label>Full Name</label>
                                    <div className="reg_input_wrapper">
                                        <input type="text" placeholder="John" required />
                                    </div>
                                </div>


                                <div className="reg_form_group full_width">
                                    <label>Username</label>
                                    <div className="reg_input_wrapper">
                                        <input type="text" placeholder="johndoe123" required />
                                    </div>
                                </div>

                                <div className="reg_form_group full_width">
                                    <label>Email Address</label>
                                    <div className="reg_input_wrapper">
                                        <input type="email" placeholder="name@example.com" required />
                                    </div>
                                </div>

                                <div className="reg_form_group full_width">
                                    <label>Password</label>
                                    <div className="reg_input_wrapper">
                                        <input type="password" placeholder="••••••••" required />
                                    </div>
                                </div>
                                <div className="reg_form_group full_width">
                                    <label>Confirm Password</label>
                                    <div className="reg_input_wrapper">
                                        <input type="password" placeholder="••••••••" required />
                                    </div>
                                </div>

                                <div className="reg_form_group full_width">
                                    <label>I want to join as a:</label>
                                    <div className="reg_input_wrapper">
                                        <select className="reg_select" required defaultValue="">
                                            <option value="" disabled>Select your role</option>
                                            <option value="customer">Customer (Order Food)</option>
                                            <option value="driver">Driver (Deliver Food)</option>
                                            <option value="restaurant">Restaurant (Sell Food)</option>

                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="reg_terms">
                                <label className="checkbox_container">
                                    <input type="checkbox" required />
                                    <span className="terms_text">
                                        By clicking Sign Up, you agree to our
                                        <Link href="/terms"> Terms of Service</Link> and
                                        <Link href="/privacy"> Privacy Policy</Link>.
                                    </span>
                                </label>
                            </div>
                            <button type="submit" className="reg_submit_btn">Sign Up</button>
                        </form>

                        <p className="login_prompt">
                            Already have an account? <Link href="/login">Log in</Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}