"use client";

import Link from 'next/link';
import './login.css';
import { Mail, Lock, EyeOff, Eye } from 'lucide-react';
import loginZod from '../_component/loginZod';
import { useTogglePassword } from '@/hooks/tooglepassword';
import { useState, useEffect } from 'react'; // 1. Import useEffect
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/authContext';
import { loginUser } from '@/lib/actions/auth_actions';
import { LoginFormData } from '../_component/login_register_schema';
import { getMyRestaurant } from '@/lib/api/restaurant';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = loginZod();
  const { inputType, isVisible, toggleVisibility } = useTogglePassword();
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false); // 2. Add mounted state
  const router = useRouter();
  const { setUser, setIsAuthenticated } = useAuth();

  // 3. Set mounted to true on initial client ]
  useEffect(() => {
    setMounted(true);
  }, []);

const onSubmit = async (data: LoginFormData) => {
    setError('');
    try {
        const result = await loginUser(data);
        if (result.success) {
            const token = result.data?.token;
            const payload = JSON.parse(atob(token.split('.')[1]));
            const role = payload.role;

            setUser(result.data.user);
            setIsAuthenticated(true);

            if (role === 'customer') {
                router.replace('/customer');
            } else if (role === 'driver') {
                router.replace('/driver');
            } else if (role === 'restaurant') {
                // ✅ Check if restaurant already exists
                const restaurant = await getMyRestaurant();
                if (restaurant?.success && restaurant?.data) {
                    router.replace('/restaurant/dashboard');
                } else {
                    router.replace('/restaurant/onboarding');
                }
            } else {
                router.replace('/dashboard');
            }
        } else {
            setError(result.message || 'Login Failed');
        }
    } catch (err: any) {
        setError(err?.message || 'Login failed');
    }
};

  return (
    <div className="login_container">
      <header className="login_header">
        <div className="login_logo_top"><Link href="/">GrubGO</Link></div>
      </header>

      <main className="login_main">
        <div className="login_left">
          <p className="login_tagline">
            Your favorite meals, delivered with speed and care.
          </p>
          <div className="login_image_wrapper">
            <img
              src="https://png.pngtree.com/thumb_back/fh260/background/20240720/pngtree-taking-slice-picture-of-prepared-delicious-pizza-with-sausage-rings-and-image_15902897.jpg"
              alt="Delicious Pizza"
              className="login_pizza_img"
            />
          </div>
        </div>

        <div className="login_right">
          <div className="login_card">
            <h2>Welcome Back</h2>
            <p className="login_subtitle">Log in to your account to continue ordering.</p>

            {error && (
              <div style={{ color: '#FF0000', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form_group">
                <label>Email Address</label>
                <div className="input_wrapper">
                  <Mail size={18} className="input_icon" />
                  <input type="email" placeholder="name@example.com" {...register("email")} />
                </div>
                {errors.email && (
                  <span className='error_message' style={{ color: '#FF0000' }}>{errors.email.message}</span>
                )}
              </div>

              <div className="form_group">
                <div className="password_header">
                  <label>Password</label>
                  <Link href="/forgot_password" className="forgot_link">Forgot Password?</Link>
                </div>
                <div className="input_wrapper">
                  <Lock size={18} className="input_icon" />
                  {/* 4. Default input to password type on server to guarantee server match */}
                  <input 
                    type={mounted ? inputType : "password"} 
                    placeholder="••••••••"
                    {...register("password")} 
                  />
                  <button 
                    type='button' 
                    className="password_toggle_btn" 
                    onClick={toggleVisibility} 
                    aria-label={isVisible ? "Hide password" : "Show password"}
                  >
                    {/* 5. Only switch the icon once the client layout is completely mounted */}
                    {mounted && isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <span className='error_message' style={{ color: '#FF0000' }}>{errors.password?.message}</span>
                )}
              </div>

              <button type="submit" className="login_submit_btn" disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p className="signup_prompt">
              New to GrubGO? <a href="/register">Create an account</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}